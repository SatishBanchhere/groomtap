// app/lib/imgbb.ts
export const uploadImageToImgBB = async (imageFile: File): Promise<string> => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
        throw new Error('ImgBB API key not found');
    }

    const formData = new FormData();
    formData.append('key', apiKey);
    formData.append('image', imageFile);

    try {
        const response = await fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (data.success) {
            return data.data.url;
        } else {
            throw new Error('Failed to upload image');
        }
    } catch (error) {
        console.error('ImgBB upload error:', error);
        throw new Error('Failed to upload image');
    }
};