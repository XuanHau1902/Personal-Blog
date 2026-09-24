import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import { buildGalleryBlock, splitContent } from "../lib/galleryContent";
import { getCurrentUsername } from "../lib/auth";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import PostThumbnail from "../components/PostThumbnail";
import ImageCarousel from "../components/ImageCarousel";
import type { PostResponse } from "../types";

function authHeader() {
  const token = localStorage.getItem("accessToken");
  return { Authorization: `Bearer ${token}` };
}

async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post<{ url: string }>("/files/upload", formData, {
    headers: { ...authHeader(), "Content-Type": "multipart/form-data" },
  });
  return res.data.url;
}

/** Reverses splitContent()/buildGalleryBlock(): pulls the plain body text and
 * the accumulated gallery URLs back out of a saved post's content string. */
function unpackContent(raw: string): { body: string; galleryUrls: string[] } {
  const segments = splitContent(raw);
  const body = segments
    .filter((s) => s.type === "text")
    .map((s) => (s as { type: "text"; value: string }).value)
    .join("")
    .trim();
  const galleryUrls = segments
    .filter((s) => s.type === "gallery")
    .flatMap((s) => (s as { type: "gallery"; urls: string[] }).urls);
  return { body, galleryUrls };
}

export default function PostEditorPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [published, setPublished] = useState(true);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [addingImages, setAddingImages] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    api
      .get<PostResponse>(`/posts/${id}`)
      .then((res) => {
        const post = res.data;
        if (post.authorUsername !== getCurrentUsername()) {
          navigate(`/posts/${id}`, { replace: true });
          return;
        }
        const { body, galleryUrls: urls } = unpackContent(post.content);
        setTitle(post.title);
        setContent(body);
        setGalleryUrls(urls);
        setTags(post.tags.join(", "));
        setPublished(post.published);
        setCoverImageUrl(post.coverImageUrl);
        setLoading(false);
      })
      .catch(() => setError("Không tải được bài viết."));
  }, [id, navigate]);

  async function handleThumbnailChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      setCoverImageUrl(await uploadFile(file));
    } catch {
      setError("Tải thumbnail thất bại.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleAddImages(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setAddingImages(true);
    setError("");
    try {
      // Sequential, not parallel — keeps the preview appearing in the exact
      // order the user picked the files, instead of network-completion order.
      for (const file of files) {
        const url = await uploadFile(file);
        setGalleryUrls((prev) => [...prev, url]);
      }
    } catch {
      setError("Thêm ảnh thất bại.");
    } finally {
      setAddingImages(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const tagNames = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const fullContent = content + buildGalleryBlock(galleryUrls);
      const payload = { title, content: fullContent, coverImageUrl, published, tagNames };

      const res = isEditMode
        ? await api.put<PostResponse>(`/posts/${id}`, payload, { headers: authHeader() })
        : await api.post<PostResponse>("/posts", payload, { headers: authHeader() });

      navigate(`/posts/${res.data.id}`);
    } catch {
      setError(isEditMode ? "Lưu thay đổi thất bại. Vui lòng thử lại." : "Đăng bài thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <main className="mx-auto max-w-2xl px-6 pb-24 md:px-12">
        <h1 className="text-3xl font-extrabold text-white md:text-4xl">
          {isEditMode ? "Chỉnh sửa bài viết" : "Viết bài mới"}
        </h1>

        {loading ? (
          <p className="mt-12 text-sm text-gray-400">Đang tải...</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">Ảnh bìa</label>
              <PostThumbnail
                postId={title || "preview"}
                title={title}
                coverImageUrl={coverImageUrl}
                className="aspect-[16/9] w-full"
              />
              <label>
                <Button as="span" variant="ghost" className="mt-2 !px-0" disabled={uploading}>
                  {uploading
                    ? "Đang tải..."
                    : coverImageUrl
                      ? "Đổi thumbnail khác"
                      : "+ Thêm thumbnail (bỏ trống để dùng nền ngẫu nhiên)"}
                </Button>
                <input type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" disabled={uploading} />
              </label>
            </div>

            <Input label="Tiêu đề" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required />

            <div className="space-y-1.5">
              <Textarea
                label="Nội dung"
                name="content"
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
              <label>
                <Button as="span" variant="ghost" className="!px-0" disabled={addingImages}>
                  {addingImages ? "Đang thêm ảnh..." : "+ Thêm ảnh"}
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAddImages}
                  className="hidden"
                  disabled={addingImages}
                />
              </label>
              {galleryUrls.length > 0 && (
                <ImageCarousel
                  urls={galleryUrls}
                  onRemove={(i) => setGalleryUrls((prev) => prev.filter((_, idx) => idx !== i))}
                />
              )}
            </div>

            <Input
              label="Tags (cách nhau bằng dấu phẩy)"
              name="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="design, ui/ux"
            />

            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="h-4 w-4 rounded border-gray-600 bg-gray-900 text-pink-500 focus:ring-pink-400"
              />
              Xuất bản ngay
            </label>

            <Button type="submit" disabled={saving || uploading}>
              {saving ? "Đang lưu..." : isEditMode ? "Lưu thay đổi" : "Đăng bài"}
            </Button>
          </form>
        )}
      </main>
    </div>
  );
}
