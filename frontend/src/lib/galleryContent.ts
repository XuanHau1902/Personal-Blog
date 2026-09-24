const GALLERY_START = "<!--gallery-->";
const GALLERY_END = "<!--/gallery-->";
const GALLERY_BLOCK_RE = /<!--gallery-->([\s\S]*?)<!--\/gallery-->/g;
const IMAGE_MD_RE = /!\[\]\(([^)]*)\)/g;

export function buildGalleryBlock(urls: string[]): string {
  if (urls.length === 0) return "";
  const images = urls.map((url) => `![](${url})`).join("\n");
  return `\n\n${GALLERY_START}\n${images}\n${GALLERY_END}\n`;
}

export type ContentSegment = { type: "text"; value: string } | { type: "gallery"; urls: string[] };

/** Splits post content into alternating text/gallery segments so each can be
 * rendered differently (markdown prose vs. a horizontal image carousel). */
export function splitContent(content: string): ContentSegment[] {
  const segments: ContentSegment[] = [];
  let lastIndex = 0;

  for (const match of content.matchAll(GALLERY_BLOCK_RE)) {
    const [full, inner] = match;
    const index = match.index ?? 0;

    if (index > lastIndex) {
      segments.push({ type: "text", value: content.slice(lastIndex, index) });
    }

    const urls = [...inner.matchAll(IMAGE_MD_RE)].map((m) => m[1]);
    if (urls.length > 0) {
      segments.push({ type: "gallery", urls });
    }

    lastIndex = index + full.length;
  }

  if (lastIndex < content.length) {
    segments.push({ type: "text", value: content.slice(lastIndex) });
  }

  return segments;
}

/** Strips gallery blocks entirely — used for plain-text excerpts (post cards). */
export function stripGalleryBlocks(content: string): string {
  return content.replace(GALLERY_BLOCK_RE, "");
}
