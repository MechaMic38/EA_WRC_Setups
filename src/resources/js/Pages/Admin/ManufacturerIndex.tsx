import FilteredEmptyState from "@/Components/FilteredEmptyState";
import TextInput from "@/Components/Form/TextInput";
import ManufacturerCreateModal from "@/Components/Modals/Manufacturer/ManufacturerCreateModal";
import ManufacturerDeleteModal from "@/Components/Modals/Manufacturer/ManufacturerDeleteModal";
import ManufacturerEditModal from "@/Components/Modals/Manufacturer/ManufacturerEditModal";
import ManufacturerShowModal from "@/Components/Modals/Manufacturer/ManufacturerShowModal";
import Pagination from "@/Components/Pagination";
import ManufacturerRow from "@/Components/Rows/ManufacturerRow";
import ManufacturerRowSkeleton from "@/Components/Skeletons/ManufacturerRowSkeleton";
import useAxiosForm from "@/Hooks/useAxiosForm";
import AdminLayout from "@/Layouts/AdminLayout";
import { Manufacturer, PaginatedData } from "@/types";
import { Head, router } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import { BsTools } from "react-icons/bs";
import {
    FiPlus,
    FiSearch,
    FiRefreshCw,
    FiX,
    FiPackage,
    FiGlobe,
} from "react-icons/fi";

interface ManufacturerIndexProps {
    page?: number;
}

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

    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const isInitialMount = useRef(true);

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
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

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
                setIsInitialLoading(false);
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
    const onPageChange = (url: string) => {
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
                        {isInitialLoading || isProcessing ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <ManufacturerRowSkeleton key={i} />
                            ))
                        ) : manufacturersData.data.length === 0 ? (
                            <FilteredEmptyState
                                entityName="manufacturers"
                                icon={<BsTools />}
                                hasActiveFilters={hasActiveFilters}
                                onClearFilters={clearFilters}
                                onCreate={onCreateManufacturer}
                            />
                        ) : (
                            manufacturersData.data.map((manufacturer) => (
                                <ManufacturerRow
                                    key={manufacturer.id}
                                    manufacturer={manufacturer}
                                    onEditManufacturer={onEditManufacturer}
                                    onShowManufacturer={onShowManufacturer}
                                    onDeleteManufacturer={onDeleteManufacturer}
                                />
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {manufacturersData.meta &&
                        manufacturersData.meta.total > 0 && (
                            <Pagination
                                meta={manufacturersData.meta}
                                links={manufacturersData.links}
                                onPageChange={onPageChange}
                            />
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
