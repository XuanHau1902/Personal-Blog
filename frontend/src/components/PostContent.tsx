import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { splitContent } from "../lib/galleryContent";
import ImageCarousel from "./ImageCarousel";

const markdownComponents = {
  img: ({ src, alt }: { src?: string; alt?: string }) => (
    <img src={src} alt={alt} className="my-6 w-full rounded-2xl" loading="lazy" />
  ),
  p: ({ children }: { children?: ReactNode }) => <p className="mb-4">{children}</p>,
  h1: ({ children }: { children?: ReactNode }) => (
    <h2 className="mb-3 mt-8 text-2xl font-extrabold text-white">{children}</h2>
  ),
  h2: ({ children }: { children?: ReactNode }) => (
    <h3 className="mb-3 mt-6 text-xl font-bold text-white">{children}</h3>
  ),
  a: ({ children, href }: { children?: ReactNode; href?: string }) => (
    <a href={href} className="text-pink-500 underline hover:text-pink-600" target="_blank" rel="noreferrer">
      {children}
    </a>
  ),
};

export default function PostContent({ content }: { content: string }) {
  const segments = splitContent(content);

  return (
    <div className="prose-content mt-8 break-words text-base leading-relaxed text-gray-300">
      {segments.map((segment, i) =>
        segment.type === "gallery" ? (
          <ImageCarousel key={i} urls={segment.urls} />
        ) : (
          <ReactMarkdown key={i} remarkPlugins={[remarkBreaks]} components={markdownComponents}>
            {segment.value}
          </ReactMarkdown>
        )
      )}
    </div>
  );
}
