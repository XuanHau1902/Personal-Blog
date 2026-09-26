import { useState, type ChangeEvent, type PointerEvent as ReactPointerEvent } from "react";
import { api } from "../api";
import { uploadFile } from "../lib/upload";
import Button from "./Button";
import type { UserProfile } from "../types";

interface Props {
  profile: UserProfile;
  onClose: () => void;
  onSaved: (profile: UserProfile) => void;
}

export default function EditAvatarModal({ profile, onClose, onSaved }: Props) {
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [avatarPosition, setAvatarPosition] = useState(profile.avatarPosition);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const previewSrc =
    avatarUrl || `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(profile.username)}`;

  function handlePositionPointer(e: ReactPointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100));
    setAvatarPosition(`${x.toFixed(0)}% ${y.toFixed(0)}%`);
  }

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      setAvatarUrl(await uploadFile(file));
      setAvatarPosition(null);
    } catch {
      setError("Tải ảnh thất bại.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const res = await api.put<UserProfile>("/users/me/avatar", { avatarUrl, avatarPosition });
      onSaved(res.data);
      onClose();
    } catch {
      setError("Lưu avatar thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm rounded-2xl bg-gray-900 p-6">
        <h2 className="text-lg font-bold text-white">Chỉnh sửa avatar</h2>

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        <div className="mt-5 flex flex-col items-center">
          <div
            className={`relative h-40 w-40 overflow-hidden rounded-full bg-cover ${
              avatarUrl ? "cursor-crosshair touch-none" : ""
            }`}
            style={{ backgroundImage: `url(${previewSrc})`, backgroundPosition: avatarPosition || "50% 50%" }}
            onPointerDown={(e) => {
              if (!avatarUrl) return;
              e.currentTarget.setPointerCapture(e.pointerId);
              handlePositionPointer(e);
            }}
            onPointerMove={(e) => {
              if (!avatarUrl || e.buttons !== 1) return;
              handlePositionPointer(e);
            }}
          >
            {avatarUrl && (
              <span
                className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md"
                style={{
                  left: avatarPosition?.split(" ")[0] ?? "50%",
                  top: avatarPosition?.split(" ")[1] ?? "50%",
                }}
              />
            )}
          </div>

          {avatarUrl && <p className="mt-2 text-xs text-gray-500">Kéo hoặc bấm vào ảnh để chọn phần hiển thị.</p>}

          <label className="mt-3">
            <Button as="span" variant="ghost" disabled={uploading}>
              {uploading ? "Đang tải..." : "Đổi ảnh"}
            </Button>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={uploading} />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Hủy
          </Button>
          <Button type="button" onClick={handleSave} disabled={saving || uploading}>
            {saving ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      </div>
    </div>
  );
}
