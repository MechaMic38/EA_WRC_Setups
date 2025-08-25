import { Category } from "@/types";
import React from "react";
import { FiEdit, FiEye, FiTrash2 } from "react-icons/fi";

interface CategoryRowProps {
    category: Category;
    onEditCategory: (category: CategoryRowProps["category"]) => void;
    onShowCategory: (category: CategoryRowProps["category"]) => void;
    onDeleteCategory: (category: CategoryRowProps["category"]) => void;
}

export default function CategoryRow({
    category,
    onEditCategory,
    onShowCategory,
    onDeleteCategory,
}: CategoryRowProps) {
    return (
        <div className="bg-surface rounded-xl border border-surfaceContainerHigh p-4 hover:border-primary/30 transition-all duration-200">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <img
                        className="h-16 w-16 rounded-lg object-contain bg-surfaceContainerHigh p-2"
                        src={category.imgPath}
                        alt={category.name}
                    />
                    <div>
                        <h3 className="text-lg font-semibold text-onSurface">
                            {category.name}
                        </h3>
                        <p className="text-sm text-onSurface/70 mt-1">
                            ID: {category.id}
                        </p>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => onShowCategory(category)}
                        className="p-2 bg-surfaceContainer rounded-lg text-onSurface hover:bg-surfaceContainerHigh transition-colors duration-200"
                        title="View details"
                    >
                        <FiEye />
                    </button>
                    <button
                        onClick={() => onEditCategory(category)}
                        className="p-2 bg-surfaceContainer rounded-lg text-onSurface hover:bg-surfaceContainerHigh transition-colors duration-200"
                        title="Edit category"
                    >
                        <FiEdit />
                    </button>
                    <button
                        onClick={() => onDeleteCategory(category)}
                        className="p-2 bg-surfaceContainer rounded-lg text-red-500 hover:bg-red-500/10 transition-colors duration-200"
                        title="Delete category"
                    >
                        <FiTrash2 />
                    </button>
                </div>
            </div>
        </div>
    );
}
