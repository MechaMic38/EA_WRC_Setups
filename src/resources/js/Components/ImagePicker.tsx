import React, { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";

interface ImagePickerProps {
    fileUrl?: string | null;
    onChange: (file: File | null) => void;
}

export default function ImagePicker({
    fileUrl = null,
    onChange,
}: ImagePickerProps) {
    const [imgPreview, setImgPreview] = useState<string | null>(null);

    useEffect(() => {
        if (fileUrl) {
            setImgPreview(fileUrl);
        }
    }, [fileUrl]);

    useEffect(() => {
        // Cleanup function to revoke object URL
        return () => {
            if (imgPreview) URL.revokeObjectURL(imgPreview);
        };
    }, [imgPreview]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImgPreview(url);
            onChange(file);
        }
    };

    const onRemove = () => {
        setImgPreview(null);
        onChange(null);
    };

    return (
        <div className="relative">
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-surfaceContainer rounded-lg cursor-pointer bg-surface overflow-hidden">
                {imgPreview ? (
                    <div className="w-full h-full relative">
                        <img
                            src={imgPreview}
                            alt="Background preview"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <span className="text-white text-sm">
                                Change Image
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full pt-5 pb-6">
                        <span className="text-sm text-onSurface">
                            Click to upload
                        </span>
                        <span className="text-xs text-onSurface/70">
                            PNG, JPG up to 2MB
                        </span>
                    </div>
                )}
                <input
                    type="file"
                    className="hidden"
                    onChange={handleChange}
                    accept="image/*"
                />
            </label>
            {imgPreview && (
                <button
                    type="button"
                    onClick={onRemove}
                    className="absolute top-2 right-2 p-1.5 bg-red-500/80 rounded-full text-white hover:bg-red-600 transition-colors"
                >
                    <FiTrash2 size={16} />
                </button>
            )}
        </div>
    );
}
