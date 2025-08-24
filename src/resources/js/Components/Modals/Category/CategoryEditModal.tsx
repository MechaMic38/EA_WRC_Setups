import {
    DialogPanel,
    DialogTitle,
    Field,
    Input,
    Label,
} from "@headlessui/react";
import { useState, useEffect } from "react";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { FiX, FiCheck, FiTag, FiAlertCircle } from "react-icons/fi";
import { Category } from "@/types";
import ImagePicker from "@/Components/Form/ImagePicker";
import BaseModal from "../BaseModal";
import TextInput from "@/Components/Form/TextInput";
import InputError from "@/Components/Form/InputError";

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
        reset,
        clearErrors,
    } = useAxiosForm<Category, CategoryFormData>({
        _method: "PATCH",
        name: "",
        img: null,
    });

    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        if (category && category.imgPath) {
            setImageUrl(category.imgPath);
        }
    }, [category]);

    // Initialize form with category data
    useEffect(() => {
        if (category && isOpen) {
            reset();
            clearErrors();
            setShowSuccess(false);
            setShowError(false);
            setErrorMessage("");

            setData({
                _method: "PATCH",
                name: category.name,
                img: null,
            });
        }
    }, [category, isOpen]);

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

        if (!category) return;

        updateCategory(
            route("api.categories.update", { category: category.id }),
            {
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
                            "An error occurred while updating the category. Please try again."
                    );
                },
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
    };

    const handleClose = () => {
        setShowSuccess(false);
        setShowError(false);
        setErrorMessage("");
        clearErrors();
        onClose();
    };

    if (!category) return null;

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
                                    Edit Category
                                </DialogTitle>
                                <p className="text-onSurface/70 text-sm">
                                    Edit the vehicle category
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
                                <span>Category updated successfully!</span>
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

                        {/* Name Input */}
                        <Field className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh transition-all duration-300 hover:border-primary/30">
                            <Label className="block text-sm font-medium text-onSurface/70 mb-2">
                                Category Name
                            </Label>
                            <TextInput
                                inputClassName="bg-surfaceContainer"
                                type="text"
                                name="name"
                                placeholder="Enter category name"
                                required
                                value={data.name}
                                onChange={handleInputChange}
                                error={errors.name}
                            />
                            <InputError message={errors.name} />
                        </Field>

                        {/* Image Upload */}
                        <Field className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh transition-all duration-300 hover:border-primary/30">
                            <Label className="block text-sm font-medium text-onSurface/70 mb-2">
                                Category Image
                                <span className="text-xs text-onSurface/50 ml-1">
                                    (Recommended: 512x256)
                                </span>
                            </Label>
                            <ImagePicker
                                fileUrl={imageUrl}
                                onChange={onImageChange}
                                error={errors.img}
                            />
                            <InputError message={errors.img} />
                        </Field>
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
                                    ? "Updating..."
                                    : "Update Category"}
                            </button>
                        </div>
                    </div>
                </div>
            </DialogPanel>
        </BaseModal>
    );
}
