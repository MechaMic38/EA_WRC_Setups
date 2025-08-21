import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from "@headlessui/react";
import { Fragment, useState, useEffect, useRef } from "react";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { FiX, FiCheck, FiTrash2, FiUpload } from "react-icons/fi";
import { Category } from "@/types";
import ImagePicker from "@/Components/Form/ImagePicker";
import BaseModal from "../BaseModal";

interface CategoryFormData {
    _method: "PATCH";
    name: string;
    img: File | null;
}

interface CategoryEditModalProps {
    isOpen: boolean;
    category: Category | null;
    onClose: () => void;
    onSuccess: (category: Category) => void;
}

export default function CategoryEditModal({
    isOpen,
    category,
    onClose,
    onSuccess,
}: CategoryEditModalProps) {
    const {
        data,
        setData,
        setError,
        post: updateCategory,
        isProcessing,
        errors,
    } = useAxiosForm<Category, CategoryFormData>({
        _method: "PATCH",
        name: "",
        img: null,
    });

    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        if (category && category.imgPath) {
            setImageUrl(category.imgPath);
        }
    }, [category]);

    // Initialize form with category data
    useEffect(() => {
        if (category && isOpen) {
            setData({
                _method: "PATCH",
                name: category.name,
                img: null,
            });
        }
    }, [category, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({ ...data, name: e.target.value });
    };

    const onImageChange = (file: File | null) => {
        setData({ ...data, img: file });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!category) return;

        updateCategory(
            route("api.categories.update", { category: category.id }),
            {
                onSuccess: (res) => {
                    onSuccess(res.data);
                    onClose();
                },
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
    };

    if (!category) return null;

    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            <DialogPanel className="bg-surfaceContainer rounded-lg shadow-xl w-full max-w-md transform transition-all">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <DialogTitle className="text-2xl font-bold text-onSurface">
                            Edit Category
                        </DialogTitle>
                        <button
                            onClick={onClose}
                            className="text-onSurface hover:text-primary"
                        >
                            <FiX size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6 mb-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-onSurface mb-2">
                                    Category Name
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-surfaceContainer rounded-md bg-surface text-onSurface"
                                    placeholder="e.g., Rally1, Rally2, Historic"
                                    required
                                />
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-onSurface mb-2">
                                    Category Image
                                    <span className="text-xs text-onSurface/70 ml-1">
                                        (Recommended: 500x500)
                                    </span>
                                </label>

                                <ImagePicker
                                    fileUrl={imageUrl}
                                    onChange={onImageChange}
                                />
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-3 pt-4 border-t border-surfaceContainer">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-onSurface bg-surfaceContainer rounded-md hover:bg-surfaceContainer/80"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isProcessing}
                                className={`px-4 py-2 flex items-center ${
                                    isProcessing
                                        ? "bg-surfaceContainer text-onSurface/50"
                                        : "bg-primary text-surfaceContainer hover:bg-primary-600"
                                } rounded-md`}
                            >
                                <FiCheck className="mr-2" />
                                {isProcessing
                                    ? "Updating..."
                                    : "Update Category"}
                            </button>
                        </div>
                    </form>
                </div>
            </DialogPanel>
        </BaseModal>
    );
}
