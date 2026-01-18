const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Upload ảnh lên Cloudinary
 * @param file File ảnh cần upload
 * @returns Promise<string> URL của ảnh sau khi upload
 */
export async function uploadImageToCloudinary(file: File): Promise<string> {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
        console.error("Cloudinary chưa được cấu hình. Vui lòng kiểm tra file .env");
        throw new Error("Lỗi cấu hình hệ thống: Thiếu Cloudinary config.");
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            throw new Error(`Cloudinary Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        throw new Error("Upload ảnh thất bại. Vui lòng thử lại sau.");
    }
}
