import TextInput from "@/Components/Form/TextInput";
import ManufacturerCreateModal from "@/Components/Modals/Manufacturer/ManufacturerCreateModal";
import ManufacturerDeleteModal from "@/Components/Modals/Manufacturer/ManufacturerDeleteModal";
import ManufacturerEditModal from "@/Components/Modals/Manufacturer/ManufacturerEditModal";
import ManufacturerShowModal from "@/Components/Modals/Manufacturer/ManufacturerShowModal";
import useAxiosForm from "@/Hooks/useAxiosForm";
import AdminLayout from "@/Layouts/AdminLayout";
import { Manufacturer, PaginatedData } from "@/types";
import { Head, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { BsTools } from "react-icons/bs";
import {
    FiChevronLeft,
    FiChevronRight,
    FiEdit,
    FiEye,
    FiPlus,
    FiTrash2,
    FiSearch,
    FiRefreshCw,
    FiX,
    FiPackage,
    FiGlobe,
} from "react-icons/fi";

interface ManufacturerIndexProps {
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

const ManufacturerIndex = ({ page }: ManufacturerIndexProps) => {
    const { get, isProcessing } = useAxiosForm<PaginatedData<Manufacturer>>([]);
    const [manufacturersData, setManufacturersData] = useState<
        PaginatedData<Manufacturer>
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

    const [selectedManufacturer, setSelectedManufacturer] =
        useState<Manufacturer | null>(null);
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
        fetchManufacturers();
    }, []);

    // Apply filters when they change
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchManufacturers();
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

        router.get(route("admin.manufacturers.index"), params, {
            preserveState: true,
            replace: true,
        });
    };

    /**
     * Fetch manufacturers from the API.
     * @param url The API endpoint URL.
     */
    const fetchManufacturers = async (url?: string) => {
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
            : `${route("api.manufacturers.index")}?${params.toString()}`;

        get(finalUrl, {
            onSuccess: (response) => {
                setManufacturersData(response.data);
            },
            onError: (error) => {
                console.error("Error fetching manufacturers:", error);
            },
        });
    };

    /**
     * Open the create manufacturer modal.
     */
    const onCreateManufacturer = () => {
        setSelectedManufacturer(null);
        setIsCreateOpen(true);
    };

    /**
     * Open the show manufacturer modal.
     * @param manufacturer The manufacturer to show.
     */
    const onShowManufacturer = (manufacturer: Manufacturer) => {
        setSelectedManufacturer(manufacturer);
        setIsShowOpen(true);
    };

    /**
     * Open the edit manufacturer modal.
     * @param manufacturer The manufacturer to edit.
     */
    const onEditManufacturer = (manufacturer: Manufacturer) => {
        setSelectedManufacturer(manufacturer);
        setIsEditOpen(true);
    };

    /**
     * Open the delete manufacturer modal.
     * @param manufacturer The manufacturer to delete.
     */
    const onDeleteManufacturer = (manufacturer: Manufacturer) => {
        setSelectedManufacturer(manufacturer);
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
            <Head title="Manufacturers" />

            <div className="py-6">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-onSurface">
                                Manufacturer Management
                            </h1>
                            <p className="text-onSurface/70 mt-1">
                                Manage all vehicle manufacturers
                            </p>
                        </div>
                        <button
                            onClick={onCreateManufacturer}
                            className="flex items-center px-6 py-3 bg-primary text-surfaceContainer rounded-xl hover:bg-primary-600 transition-colors duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <FiPlus className="mr-2" /> Create Manufacturer
                        </button>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="bg-surfaceContainer rounded-xl p-4 mb-6 border border-surfaceContainerHigh">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <TextInput
                                    type="text"
                                    name="search"
                                    placeholder="Search manufacturers by name..."
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
                                onClick={() => fetchManufacturers()}
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
                                    <BsTools className="text-primary text-xl" />
                                </div>
                                <div>
                                    <p className="text-sm text-onSurface/70">
                                        Total Manufacturers
                                    </p>
                                    <p className="text-2xl font-bold text-onSurface">
                                        {manufacturersData.meta.total}
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
                                        Active Manufacturers
                                    </p>
                                    <p className="text-2xl font-bold text-onSurface">
                                        {manufacturersData.data.length}
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
                                        {manufacturersData.meta.per_page}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Manufacturers Grid */}
                    <div className="space-y-4">
                        {isProcessing ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <SkeletonRow key={i} />
                            ))
                        ) : manufacturersData.data.length === 0 ? (
                            <div className="text-center py-12 bg-surfaceContainer rounded-xl border border-surfaceContainerHigh">
                                <BsTools className="mx-auto text-4xl text-onSurface/50 mb-4" />
                                <h3 className="text-lg font-medium text-onSurface">
                                    {hasActiveFilters
                                        ? "No manufacturers match your search"
                                        : "No manufacturers found"}
                                </h3>
                                <p className="text-onSurface/70 mt-1">
                                    {hasActiveFilters
                                        ? "Try adjusting your search terms"
                                        : "Get started by creating your first manufacturer"}
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
                                        onClick={onCreateManufacturer}
                                        className="mt-4 px-6 py-2 bg-primary text-surfaceContainer rounded-xl hover:bg-primary-600 transition-colors duration-200"
                                    >
                                        Create Manufacturer
                                    </button>
                                )}
                            </div>
                        ) : (
                            manufacturersData.data.map((manufacturer) => (
                                <div
                                    key={manufacturer.id}
                                    className="bg-surface rounded-xl border border-surfaceContainerHigh p-4 hover:border-primary/30 transition-all duration-200"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <img
                                                className="h-16 w-16 rounded-lg object-contain bg-surfaceContainerHigh p-2"
                                                src={manufacturer.imgPath}
                                                alt={manufacturer.name}
                                            />
                                            <div>
                                                <h3 className="text-lg font-semibold text-onSurface">
                                                    {manufacturer.name}
                                                </h3>
                                                <p className="text-sm text-onSurface/70 mt-1">
                                                    ID: {manufacturer.id}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() =>
                                                    onShowManufacturer(
                                                        manufacturer
                                                    )
                                                }
                                                className="p-2 bg-surfaceContainer rounded-lg text-onSurface hover:bg-surfaceContainerHigh transition-colors duration-200"
                                                title="View details"
                                            >
                                                <FiEye />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    onEditManufacturer(
                                                        manufacturer
                                                    )
                                                }
                                                className="p-2 bg-surfaceContainer rounded-lg text-onSurface hover:bg-surfaceContainerHigh transition-colors duration-200"
                                                title="Edit manufacturer"
                                            >
                                                <FiEdit />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    onDeleteManufacturer(
                                                        manufacturer
                                                    )
                                                }
                                                className="p-2 bg-surfaceContainer rounded-lg text-red-500 hover:bg-red-500/10 transition-colors duration-200"
                                                title="Delete manufacturer"
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
                    {manufacturersData.meta &&
                        manufacturersData.meta.total > 0 && (
                            <div className="bg-surfaceContainer rounded-xl p-6 mt-6 border border-surfaceContainerHigh">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="text-sm text-onSurface">
                                        Showing{" "}
                                        <span className="font-medium">
                                            {manufacturersData.meta.from}
                                        </span>{" "}
                                        to{" "}
                                        <span className="font-medium">
                                            {manufacturersData.meta.to}
                                        </span>{" "}
                                        of{" "}
                                        <span className="font-medium">
                                            {manufacturersData.meta.total}
                                        </span>{" "}
                                        results
                                    </div>
                                    <nav className="flex items-center space-x-2">
                                        {manufacturersData.links.prev && (
                                            <button
                                                onClick={() =>
                                                    onPaginationChange(
                                                        manufacturersData.links
                                                            .prev!
                                                    )
                                                }
                                                className="p-2 bg-surface rounded-lg border border-surfaceContainerHigh hover:border-primary/30 transition-colors duration-200"
                                            >
                                                <FiChevronLeft className="h-5 w-5" />
                                            </button>
                                        )}

                                        {manufacturersData.meta.links
                                            ?.slice(1, -1)
                                            .map((link, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() =>
                                                        link.url &&
                                                        onPaginationChange(
                                                            link.url
                                                        )
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

                                        {manufacturersData.links.next && (
                                            <button
                                                onClick={() =>
                                                    onPaginationChange(
                                                        manufacturersData.links
                                                            .next!
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
                    <ManufacturerCreateModal
                        isOpen={isCreateOpen}
                        onClose={() => setIsCreateOpen(false)}
                        onSuccess={() => {
                            setIsCreateOpen(false);
                            fetchManufacturers();
                        }}
                    />
                    <ManufacturerEditModal
                        isOpen={isEditOpen}
                        manufacturer={selectedManufacturer}
                        onClose={() => setIsEditOpen(false)}
                        onSuccess={() => {
                            setIsEditOpen(false);
                            fetchManufacturers();
                        }}
                    />
                    <ManufacturerShowModal
                        isOpen={isShowOpen}
                        manufacturer={selectedManufacturer}
                        onClose={() => setIsShowOpen(false)}
                    />
                    <ManufacturerDeleteModal
                        isOpen={isDeleteOpen}
                        manufacturer={selectedManufacturer}
                        onClose={() => setIsDeleteOpen(false)}
                        onSuccess={() => {
                            setIsDeleteOpen(false);
                            fetchManufacturers();
                        }}
                    />
                </div>
            </div>
        </AdminLayout>
    );
};

export default ManufacturerIndex;
