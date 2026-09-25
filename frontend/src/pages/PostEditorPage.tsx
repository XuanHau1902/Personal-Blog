import { useEffect, useState, type ChangeEvent, type PointerEvent as ReactPointerEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import { buildGalleryBlock, splitContent } from "../lib/galleryContent";
import { getCurrentUsername, isAdmin } from "../lib/auth";
import { postEditorSchema, type PostEditorFormValues } from "../lib/schemas";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import PostThumbnail from "../components/PostThumbnail";
import ImageCarousel from "../components/ImageCarousel";
import type { PostResponse } from "../types";

async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post<{ url: string }>("/files/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
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

  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [coverImagePosition, setCoverImagePosition] = useState<string | null>(null);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [addingImages, setAddingImages] = useState(false);
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PostEditorFormValues>({
    resolver: zodResolver(postEditorSchema),
    defaultValues: { title: "", content: "", tags: "", published: true },
  });

  const titleValue = watch("title");

  useEffect(() => {
    if (!id) return;
    api
      .get<PostResponse>(`/posts/${id}`)
      .then((res) => {
        const post = res.data;
        if (post.authorUsername !== getCurrentUsername() && !isAdmin()) {
          navigate(`/posts/${id}`, { replace: true });
          return;
        }
        const { body, galleryUrls: urls } = unpackContent(post.content);
        reset({
          title: post.title,
          content: body,
          tags: post.tags.join(", "),
          published: post.published,
        });
        setGalleryUrls(urls);
        setCoverImageUrl(post.coverImageUrl);
        setCoverImagePosition(post.coverImagePosition);
        setLoading(false);
      })
      .catch(() => setError("Không tải được bài viết."));
  }, [id, navigate, reset]);

  async function handleThumbnailChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      setCoverImageUrl(await uploadFile(file));
      setCoverImagePosition(null);
    } catch {
      setError("Tải thumbnail thất bại.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function handlePositionPointer(e: ReactPointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100));
    setCoverImagePosition(`${x.toFixed(0)}% ${y.toFixed(0)}%`);
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

  async function onSubmit(values: PostEditorFormValues) {
    setError("");
    try {
      const tagNames = values.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const fullContent = values.content + buildGalleryBlock(galleryUrls);
      const payload = {
        title: values.title,
        content: fullContent,
        coverImageUrl,
        coverImagePosition,
        published: values.published,
        tagNames,
      };

      const res = isEditMode
        ? await api.put<PostResponse>(`/posts/${id}`, payload)
        : await api.post<PostResponse>("/posts", payload);

      navigate(`/posts/${res.data.id}`);
    } catch {
      setError(isEditMode ? "Lưu thay đổi thất bại. Vui lòng thử lại." : "Đăng bài thất bại. Vui lòng thử lại.");
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
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">Ảnh bìa</label>
              <div
                className={`relative ${coverImageUrl ? "cursor-crosshair touch-none" : ""}`}
                onPointerDown={(e) => {
                  if (!coverImageUrl) return;
                  e.currentTarget.setPointerCapture(e.pointerId);
                  handlePositionPointer(e);
                }}
                onPointerMove={(e) => {
                  if (!coverImageUrl || e.buttons !== 1) return;
                  handlePositionPointer(e);
                }}
              >
                <PostThumbnail
                  postId={titleValue || "preview"}
                  title={titleValue}
                  coverImageUrl={coverImageUrl}
                  coverImagePosition={coverImagePosition}
                  className="aspect-[16/9] w-full"
                />
                {coverImageUrl && (
                  <span
                    className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md"
                    style={{
                      left: coverImagePosition?.split(" ")[0] ?? "50%",
                      top: coverImagePosition?.split(" ")[1] ?? "50%",
                    }}
                  />
                )}
              </div>
              {coverImageUrl && (
                <p className="text-xs text-gray-500">Kéo hoặc bấm vào ảnh để chọn phần sẽ hiển thị trong khung.</p>
              )}
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

            <div>
              <Input label="Tiêu đề" {...register("title")} />
              {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
            </div>

            <div className="space-y-1.5">
              <div>
                <Textarea label="Nội dung" rows={10} {...register("content")} />
                {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content.message}</p>}
              </div>
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

            <Input label="Tags (cách nhau bằng dấu phẩy)" placeholder="design, ui/ux" {...register("tags")} />

            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <input
                type="checkbox"
                {...register("published")}
                className="h-4 w-4 rounded border-gray-600 bg-gray-900 text-pink-500 focus:ring-pink-400"
              />
              Xuất bản ngay
            </label>

            <Button type="submit" disabled={isSubmitting || uploading}>
              {isSubmitting ? "Đang lưu..." : isEditMode ? "Lưu thay đổi" : "Đăng bài"}
            </Button>
          </form>
        )}
      </main>
    </div>
  );
}
