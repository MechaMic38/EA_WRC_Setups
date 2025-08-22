import { DialogPanel, DialogTitle } from "@headlessui/react";
import { useState, useEffect } from "react";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { FiX, FiCheck, FiTag, FiAlertCircle } from "react-icons/fi";
import { Category } from "@/types";
import ImagePicker from "@/Components/Form/ImagePicker";
import BaseModal from "../BaseModal";

interface CategoryFormData {
    name: string;
    img: File | null;
}

interface CategoryCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (category: Category) => void;
}

export default function CategoryCreateModal({
    isOpen,
    onClose,
    onSuccess,
}: CategoryCreateModalProps) {
    const {
        data,
        setData,
        post: postCategory,
        isProcessing,
        errors,
        reset,
        clearErrors,
    } = useAxiosForm<Category, CategoryFormData>({
        name: "",
        img: null,
    });

    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            reset();
            clearErrors();
            setShowSuccess(false);
            setShowError(false);
            setErrorMessage("");
        }
    }, [isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({ ...data, name: e.target.value });

        // Clear error when user starts typing
        if (errors.name) {
            clearErrors();
            setShowError(false);
        }
    };

    const onImageChange = (file: File | null) => {
        setData({ ...data, img: file });

        // Clear error when user selects an image
        if (errors.img) {
            clearErrors();
            setShowError(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowSuccess(false);
        setShowError(false);
        setErrorMessage("");

        postCategory(route("api.categories.store"), {
            onSuccess: (res) => {
                setShowSuccess(true);
                setTimeout(() => {
                    onSuccess(res.data);
                    onClose();
                }, 1500);
            },
            onError: (error) => {
                setShowError(true);
                setErrorMessage(
                    error.response?.data?.message ||
                        "An error occurred while creating the category. Please try again."
                );
            },
            headers: { "Content-Type": "multipart/form-data" },
        });
    };

    const handleClose = () => {
        setShowSuccess(false);
        setShowError(false);
        setErrorMessage("");
        clearErrors();
        onClose();
    };

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose}>
            <DialogPanel className="bg-surfaceContainer rounded-xl shadow-2xl w-full max-w-md transform transition-all overflow-hidden">
                <div className="flex flex-col">
                    {/* Header Section */}
                    <div className="p-6 bg-gradient-to-r from-surfaceContainerHigh to-surfaceContainer flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="bg-primaryContainer/20 p-3 rounded-lg mr-4">
                                <FiTag className="text-primary text-xl" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold text-onSurface">
                                    Create Category
                                </DialogTitle>
                                <p className="text-onSurface/70 text-sm">
                                    Add a new vehicle category
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-onSurface hover:text-primary transition-colors duration-200 p-1 rounded-full hover:bg-surfaceContainerHigh"
                        >
                            <FiX size={24} />
                        </button>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 space-y-6">
                        {/* Success Message */}
                        {showSuccess && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center">
                                <FiCheck className="mr-2 text-green-600" />
                                <span>Category created successfully!</span>
                            </div>
                        )}

                        {/* Error Message */}
                        {showError && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-start">
                                <FiAlertCircle className="mr-2 text-red-600 mt-0.5 flex-shrink-0" />
                                <span>{errorMessage}</span>
                                <button
                                    onClick={() => setShowError(false)}
                                    className="ml-auto text-red-700 hover:text-red-900"
                                >
                                    <FiX size={18} />
                                </button>
                            </div>
                        )}

                        {/* Preview Section */}
                        <div className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh">
                            <h3 className="text-sm font-medium text-onSurface/70 mb-3">
                                Preview
                            </h3>
                            <div className="flex items-center justify-center bg-surfaceContainerHigh rounded-lg p-4 min-h-32">
                                {data.img ? (
                                    <img
                                        src={URL.createObjectURL(data.img)}
                                        alt="Category preview"
                                        className="max-h-24 max-w-full object-contain"
                                    />
                                ) : (
                                    <div className="text-onSurface/50 text-center">
                                        <FiTag className="mx-auto text-2xl mb-2" />
                                        <p className="text-sm">
                                            Category preview
                                        </p>
                                    </div>
                                )}
                            </div>
                            {data.name && (
                                <p className="text-onSurface font-medium text-center mt-3">
                                    {data.name}
                                </p>
                            )}
                        </div>

                        {/* Name Input */}
                        <div className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh transition-all duration-300 hover:border-primary/30">
                            <label className="block text-sm font-medium text-onSurface/70 mb-2">
                                Category Name
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 bg-surfaceContainer rounded-lg text-onSurface border border-surfaceContainerHigh focus:border-primary focus:ring-1 focus:ring-primary"
                                placeholder="e.g., Rally1, Rally2, Historic"
                                required
                                autoFocus
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <FiAlertCircle className="mr-1" />
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Image Upload */}
                        <div className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh transition-all duration-300 hover:border-primary/30">
                            <label className="block text-sm font-medium text-onSurface/70 mb-2">
                                Category Image
                                <span className="text-xs text-onSurface/50 ml-1">
                                    (Recommended: 500x500)
                                </span>
                            </label>
                            <ImagePicker
                                onChange={onImageChange}
                                error={errors.img}
                            />
                            {errors.img && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <FiAlertCircle className="mr-1" />
                                    {errors.img}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Footer Section */}
                    <div className="p-6 pt-0">
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-6 py-3 text-onSurface bg-surfaceContainer rounded-xl hover:bg-surfaceContainerHigh transition-colors duration-200 font-medium"
                                disabled={isProcessing}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={isProcessing}
                                className={`px-6 py-3 flex items-center rounded-xl font-medium transition-colors duration-200 ${
                                    isProcessing
                                        ? "bg-surfaceContainer text-onSurface/50"
                                        : "bg-primary text-surfaceContainer hover:bg-primary-600"
                                }`}
                            >
                                <FiCheck className="mr-2" />
                                {isProcessing
                                    ? "Creating..."
                                    : "Create Category"}
                            </button>
                        </div>
                    </div>
                </div>
            </DialogPanel>
        </BaseModal>
    );
}
