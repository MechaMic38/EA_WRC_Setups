import TextInput from "@/Components/Form/TextInput";
import CategoryCreateModal from "@/Components/Modals/Category/CategoryCreateModal";
import CategoryDeleteModal from "@/Components/Modals/Category/CategoryDeleteModal";
import CategoryEditModal from "@/Components/Modals/Category/CategoryEditModal";
import CategoryShowModal from "@/Components/Modals/Category/CategoryShowModal";
import useAxiosForm from "@/Hooks/useAxiosForm";
import AdminLayout from "@/Layouts/AdminLayout";
import { Category, PaginatedData } from "@/types";
import { Head, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import {
    FiChevronLeft,
    FiChevronRight,
    FiPlus,
    FiEye,
    FiEdit,
    FiTrash2,
    FiSearch,
    FiRefreshCw,
    FiX,
    FiGrid,
    FiPackage,
    FiTag,
    FiGlobe,
} from "react-icons/fi";

interface CategoryIndexProps {
    page?: number;
}

const SkeletonRow = () => (
    <div className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh animate-pulse">
        <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-surfaceContainerHigh rounded-lg"></div>
            <div className="flex-1 space-y-2">
                <div className="h-5 w-40 bg-surfaceContainerHigh rounded"></div>
                <div className="h-4 w-32 bg-surfaceContainerHigh rounded"></div>
            </div>
            <div className="flex space-x-2">
                <div className="h-8 w-8 bg-surfaceContainerHigh rounded"></div>
                <div className="h-8 w-8 bg-surfaceContainerHigh rounded"></div>
                <div className="h-8 w-8 bg-surfaceContainerHigh rounded"></div>
            </div>
        </div>
    </div>
);

const CategoryIndex = ({ page }: CategoryIndexProps) => {
    const { get, isProcessing } = useAxiosForm<PaginatedData<Category>>([]);
    const [categoriesData, setCategoriesData] = useState<
        PaginatedData<Category>
    >({
        data: [],
        links: {},
        meta: {
            current_page: 1,
            from: 0,
            last_page: 1,
            links: [],
            path: "",
            per_page: 15,
            to: 0,
            total: 0,
        },
    });

    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        null
    );
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isShowOpen, setIsShowOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // Filter state - initialize from URL parameters
    const [filters, setFilters] = useState({
        page: page || 1,
        name: "",
    });

    // Initial data fetch
    useEffect(() => {
        fetchCategories();
    }, []);

    // Apply filters when they change
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchCategories();
            updateUrlWithFilters(filters);
        }, 300); // Debounce search

        return () => clearTimeout(timeoutId);
    }, [filters]);

    /**
     * Update the URL with the current filters.
     * @param newFilters The new filter values.
     */
    const updateUrlWithFilters = (newFilters: typeof filters) => {
        const params: any = {};

        if (newFilters.name) params["name"] = newFilters.name;
        if (newFilters.page) params["page"] = newFilters.page;

        router.get(route("admin.categories.index"), params, {
            preserveState: true,
            replace: true,
        });
    };

    /**
     * Fetch categories from the API.
     * @param url The API endpoint URL (optional).
     */
    const fetchCategories = async (url?: string) => {
        const params = new URLSearchParams();

        // Add current filters to the request
        if (filters.page) params.append("page", filters.page.toString());
        if (filters.name) params.append("name", filters.name);

        // Add pagination parameters if it's a new URL
        if (url) {
            const urlObj = new URL(url);
            urlObj.searchParams.forEach((value, key) => {
                params.append(key, value);
            });
        }

        const finalUrl = url
            ? `${url.split("?")[0]}?${params.toString()}`
            : `${route("api.categories.index")}?${params.toString()}`;

        get(finalUrl, {
            onSuccess: (response) => {
                setCategoriesData(response.data);
            },
            onError: (error) => {
                console.error("Error fetching categories:", error);
            },
        });
    };

    /**
     * Open the create category modal.
     */
    const onCreateCategory = () => {
        setSelectedCategory(null);
        setIsCreateOpen(true);
    };

    /**
     * Open the show category modal.
     * @param category The category to show.
     */
    const onShowCategory = (category: Category) => {
        setSelectedCategory(category);
        setIsShowOpen(true);
    };

    /**
     * Open the edit category modal.
     * @param category The category to edit.
     */
    const onEditCategory = (category: Category) => {
        setSelectedCategory(category);
        setIsEditOpen(true);
    };

    /**
     * Open the delete category modal.
     * @param category The category to delete.
     */
    const onDeleteCategory = (category: Category) => {
        setSelectedCategory(category);
        setIsDeleteOpen(true);
    };

    /**
     * Handle filter changes.
     * @param key The filter key.
     * @param value The filter value.
     */
    const onFilterChange = (key: string, value: string) => {
        switch (key) {
            case "name":
                setFilters((prev) => ({
                    ...prev,
                    name: value,
                }));
                break;
            default:
                break;
        }
    };

    /**
     * Clear all filters.
     */
    const clearFilters = () => {
        const newFilters = {
            page: 1,
            name: "",
        };
        setFilters(newFilters);
    };

    /**
     * Handle pagination.
     * @param url The pagination URL.
     */
    const onPaginationChange = (url: string) => {
        const urlObj = new URL(url);
        const page = urlObj.searchParams.get("page");
        if (page) {
            setFilters((prev) => ({
                ...prev,
                page: parseInt(page),
            }));
        }
    };

    const hasActiveFilters = filters.name;

    return (
        <AdminLayout>
            <Head title="Categories" />

            <div className="py-6">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-onSurface">
                                Category Management
                            </h1>
                            <p className="text-onSurface/70 mt-1">
                                Manage all vehicle categories
                            </p>
                        </div>
                        <button
                            onClick={onCreateCategory}
                            className="flex items-center px-6 py-3 bg-primary text-surfaceContainer rounded-xl hover:bg-primary-600 transition-colors duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <FiPlus className="mr-2" /> Create Category
                        </button>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="bg-surfaceContainer rounded-xl p-4 mb-6 border border-surfaceContainerHigh">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <TextInput
                                    type="text"
                                    name="search"
                                    placeholder="Search categories by name..."
                                    value={filters.name}
                                    onChange={(e) =>
                                        onFilterChange("name", e.target.value)
                                    }
                                    icon={
                                        <FiSearch className="text-onSurface/50" />
                                    }
                                />
                            </div>
                            <button
                                onClick={() => fetchCategories()}
                                className="flex items-center px-4 py-3 bg-surface rounded-lg border border-surfaceContainerHigh hover:border-primary/30 transition-colors duration-200"
                            >
                                <FiRefreshCw className="text-onSurface/70" />
                            </button>
                        </div>
                    </div>

                    {/* Active Filters Display */}
                    {hasActiveFilters && (
                        <div className="bg-surfaceContainer rounded-xl p-4 mb-6 border border-surfaceContainerHigh">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-onSurface/70">
                                    Active filters:
                                </span>
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-primary hover:text-primary-600 transition-colors duration-200"
                                >
                                    Clear all
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {filters.name && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                                        Name: {filters.name}
                                        <button
                                            onClick={() =>
                                                onFilterChange("name", "")
                                            }
                                            className="ml-2 hover:text-primary-800"
                                        >
                                            <FiX size={14} />
                                        </button>
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-surfaceContainer rounded-xl p-6 border border-surfaceContainerHigh">
                            <div className="flex items-center">
                                <div className="bg-primary/10 p-3 rounded-lg mr-4">
                                    <FiTag className="text-primary text-xl" />
                                </div>
                                <div>
                                    <p className="text-sm text-onSurface/70">
                                        Total Categories
                                    </p>
                                    <p className="text-2xl font-bold text-onSurface">
                                        {categoriesData.meta.total}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-surfaceContainer rounded-xl p-6 border border-surfaceContainerHigh">
                            <div className="flex items-center">
                                <div className="bg-secondary/10 p-3 rounded-lg mr-4">
                                    <FiGlobe className="text-secondary text-xl" />
                                </div>
                                <div>
                                    <p className="text-sm text-onSurface/70">
                                        Active Categories
                                    </p>
                                    <p className="text-2xl font-bold text-onSurface">
                                        {categoriesData.data.length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-surfaceContainer rounded-xl p-6 border border-surfaceContainerHigh">
                            <div className="flex items-center">
                                <div className="bg-tertiary/10 p-3 rounded-lg mr-4">
                                    <FiPackage className="text-tertiary text-xl" />
                                </div>
                                <div>
                                    <p className="text-sm text-onSurface/70">
                                        Per Page
                                    </p>
                                    <p className="text-2xl font-bold text-onSurface">
                                        {categoriesData.meta.per_page}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Categories Grid */}
                    <div className="space-y-4">
                        {isProcessing ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <SkeletonRow key={i} />
                            ))
                        ) : categoriesData.data.length === 0 ? (
                            <div className="text-center py-12 bg-surfaceContainer rounded-xl border border-surfaceContainerHigh">
                                <FiGrid className="mx-auto text-4xl text-onSurface/50 mb-4" />
                                <h3 className="text-lg font-medium text-onSurface">
                                    {hasActiveFilters
                                        ? "No categories match your search"
                                        : "No categories found"}
                                </h3>
                                <p className="text-onSurface/70 mt-1">
                                    {hasActiveFilters
                                        ? "Try adjusting your search terms"
                                        : "Get started by creating your first category"}
                                </p>
                                {hasActiveFilters ? (
                                    <button
                                        onClick={clearFilters}
                                        className="mt-4 px-6 py-2 bg-primary text-surfaceContainer rounded-xl hover:bg-primary-600 transition-colors duration-200"
                                    >
                                        Clear Search
                                    </button>
                                ) : (
                                    <button
                                        onClick={onCreateCategory}
                                        className="mt-4 px-6 py-2 bg-primary text-surfaceContainer rounded-xl hover:bg-primary-600 transition-colors duration-200"
                                    >
                                        Create Category
                                    </button>
                                )}
                            </div>
                        ) : (
                            categoriesData.data.map((category) => (
                                <div
                                    key={category.id}
                                    className="bg-surface rounded-xl border border-surfaceContainerHigh p-4 hover:border-primary/30 transition-all duration-200"
                                >
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
                                                onClick={() =>
                                                    onShowCategory(category)
                                                }
                                                className="p-2 bg-surfaceContainer rounded-lg text-onSurface hover:bg-surfaceContainerHigh transition-colors duration-200"
                                                title="View details"
                                            >
                                                <FiEye />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    onEditCategory(category)
                                                }
                                                className="p-2 bg-surfaceContainer rounded-lg text-onSurface hover:bg-surfaceContainerHigh transition-colors duration-200"
                                                title="Edit category"
                                            >
                                                <FiEdit />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    onDeleteCategory(category)
                                                }
                                                className="p-2 bg-surfaceContainer rounded-lg text-red-500 hover:bg-red-500/10 transition-colors duration-200"
                                                title="Delete category"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {categoriesData.meta && categoriesData.meta.total > 0 && (
                        <div className="bg-surfaceContainer rounded-xl p-6 mt-6 border border-surfaceContainerHigh">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-sm text-onSurface">
                                    Showing{" "}
                                    <span className="font-medium">
                                        {categoriesData.meta.from}
                                    </span>{" "}
                                    to{" "}
                                    <span className="font-medium">
                                        {categoriesData.meta.to}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-medium">
                                        {categoriesData.meta.total}
                                    </span>{" "}
                                    results
                                </div>
                                <nav className="flex items-center space-x-2">
                                    {categoriesData.links.prev && (
                                        <button
                                            onClick={() =>
                                                onPaginationChange(
                                                    categoriesData.links.prev!
                                                )
                                            }
                                            className="p-2 bg-surface rounded-lg border border-surfaceContainerHigh hover:border-primary/30 transition-colors duration-200"
                                        >
                                            <FiChevronLeft className="h-5 w-5" />
                                        </button>
                                    )}

                                    {categoriesData.meta.links
                                        ?.slice(1, -1)
                                        .map((link, index) => (
                                            <button
                                                key={index}
                                                onClick={() =>
                                                    link.url &&
                                                    onPaginationChange(link.url)
                                                }
                                                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors duration-200 ${
                                                    link.active
                                                        ? "bg-primary border-primary text-surfaceContainer"
                                                        : "bg-surface border-surfaceContainerHigh text-onSurface hover:border-primary/30"
                                                }`}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        ))}

                                    {categoriesData.links.next && (
                                        <button
                                            onClick={() =>
                                                onPaginationChange(
                                                    categoriesData.links.next!
                                                )
                                            }
                                            className="p-2 bg-surface rounded-lg border border-surfaceContainerHigh hover:border-primary/30 transition-colors duration-200"
                                        >
                                            <FiChevronRight className="h-5 w-5" />
                                        </button>
                                    )}
                                </nav>
                            </div>
                        </div>
                    )}

                    {/* Modals */}
                    <CategoryCreateModal
                        isOpen={isCreateOpen}
                        onClose={() => setIsCreateOpen(false)}
                        onSuccess={() => {
                            setIsCreateOpen(false);
                            fetchCategories();
                        }}
                    />
                    <CategoryShowModal
                        isOpen={isShowOpen}
                        category={selectedCategory}
                        onClose={() => setIsShowOpen(false)}
                    />
                    <CategoryEditModal
                        isOpen={isEditOpen}
                        category={selectedCategory}
                        onClose={() => setIsEditOpen(false)}
                        onSuccess={() => {
                            setIsEditOpen(false);
                            fetchCategories();
                        }}
                    />
                    <CategoryDeleteModal
                        isOpen={isDeleteOpen}
                        category={selectedCategory}
                        onClose={() => setIsDeleteOpen(false)}
                        onSuccess={() => {
                            setIsDeleteOpen(false);
                            fetchCategories();
                        }}
                    />
                </div>
            </div>
        </AdminLayout>
    );
};

export default CategoryIndex;
