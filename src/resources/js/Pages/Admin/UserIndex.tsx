import AdminLayout from "@/Layouts/AdminLayout";
import { PaginatedData, User } from "@/types";
import { useEffect, useRef, useState } from "react";
import { Head, router } from "@inertiajs/react";
import useAxiosForm from "@/Hooks/useAxiosForm";
import {
    FiPlus,
    FiSearch,
    FiFilter,
    FiRefreshCw,
    FiX,
    FiUsers,
    FiUser,
    FiShield,
} from "react-icons/fi";
import UserCreateModal from "@/Components/Modals/User/UserCreateModal";
import UserEditModal from "@/Components/Modals/User/UserEditModal";
import UserShowModal from "@/Components/Modals/User/UserShowModal";
import UserDeleteModal from "@/Components/Modals/User/UserDeleteModal";
import UserRoleListbox from "@/Components/Form/UserRoleListbox";
import { USER_ROLES_MAP } from "@/constants";
import { Field, Input, Label } from "@headlessui/react";
import TextInput from "@/Components/Form/TextInput";
import UserRowSkeleton from "@/Components/Skeletons/UserRowSkeleton";
import Pagination from "@/Components/Pagination";
import UserRow from "@/Components/Rows/UserRow";
import FilteredEmptyState from "@/Components/FilteredEmptyState";

interface UserIndexProps {
    page?: number;
    role?: string;
}

const UserIndex = ({ page, role }: UserIndexProps) => {
    const { get, isProcessing } = useAxiosForm<PaginatedData<User>>([]);
    const [usersData, setUsersData] = useState<PaginatedData<User>>({
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

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isShowOpen, setIsShowOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const isInitialMount = useRef(true);

    // Filter states - initialize from URL parameters
    const [filters, setFilters] = useState({
        page: page || 1,
        username: "",
        email: "",
        role: role || "",
    });

    // Initial data fetch
    useEffect(() => {
        fetchUsers();
    }, []);

    // Apply filters when they change
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const timeoutId = setTimeout(() => {
            fetchUsers();
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

        if (newFilters.role) params["role"] = newFilters.role;
        if (newFilters.page) params["page"] = newFilters.page;

        router.get(route("admin.users.index"), params, {
            preserveState: true,
            replace: true,
        });
    };

    /**
     * Fetch users from the API with current filters.
     * @param url The API endpoint URL (optional).
     */
    const fetchUsers = async (url?: string) => {
        const params = new URLSearchParams();

        // Add current filters to the request
        if (filters.page) params.append("page", filters.page.toString());
        if (filters.username) params.append("username", filters.username);
        if (filters.email) params.append("email", filters.email);
        if (filters.role) params.append("role", filters.role);

        // Add pagination parameters if it's a new URL
        if (url) {
            const urlObj = new URL(url);
            urlObj.searchParams.forEach((value, key) => {
                params.append(key, value);
            });
        }

        const finalUrl = url
            ? `${url.split("?")[0]}?${params.toString()}`
            : `${route("api.users.index")}?${params.toString()}`;

        get(finalUrl, {
            onSuccess: (response) => {
                setUsersData(response.data);
                setIsInitialLoading(false);
            },
            onError: (error) => {
                console.error("Error fetching users:", error);
            },
        });
    };

    /**
     * Open the create user modal.
     */
    const onCreateUser = () => {
        setSelectedUser(null);
        setIsCreateOpen(true);
    };

    /**
     * Open the show user modal.
     * @param user The user to show.
     */
    const onShowUser = (user: User) => {
        setSelectedUser(user);
        setIsShowOpen(true);
    };

    /**
     * Open the edit user modal.
     * @param user The user to edit.
     */
    const onEditUser = (user: User) => {
        setSelectedUser(user);
        setIsEditOpen(true);
    };

    /**
     * Open the delete user modal.
     * @param user The user to delete.
     */
    const onDeleteUser = (user: User) => {
        setSelectedUser(user);
        setIsDeleteOpen(true);
    };

    /**
     * Handle filter changes.
     * @param key The filter key.
     * @param value The filter value.
     */
    const onFilterChange = (key: string, value: string) => {
        switch (key) {
            case "username":
                setFilters((prev) => ({ ...prev, username: value }));
                break;
            case "email":
                setFilters((prev) => ({ ...prev, email: value }));
                break;
            case "role":
                setFilters((prev) => ({ ...prev, role: value }));
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
            username: "",
            email: "",
            role: "",
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

    const hasActiveFilters = filters.username || filters.email || filters.role;

    return (
        <AdminLayout>
            <Head title="Users" />

            <div className="py-6">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-onSurface">
                                User Management
                            </h1>
                            <p className="text-onSurface/70 mt-1">
                                Manage user accounts and permissions
                            </p>
                        </div>
                        <button
                            onClick={onCreateUser}
                            className="flex items-center px-6 py-3 bg-primary text-surfaceContainer rounded-xl hover:bg-primary-600 transition-colors duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <FiPlus className="mr-2" /> Create User
                        </button>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="bg-surfaceContainer rounded-xl p-4 mb-6 border border-surfaceContainerHigh">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <TextInput
                                    type="text"
                                    name="search"
                                    placeholder="Search users by name..."
                                    value={filters.username}
                                    onChange={(e) =>
                                        onFilterChange(
                                            "username",
                                            e.target.value
                                        )
                                    }
                                    icon={
                                        <FiSearch className="text-onSurface/50" />
                                    }
                                />
                            </div>
                            <button
                                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                                className="flex items-center px-4 py-3 bg-surface rounded-lg border border-surfaceContainerHigh hover:border-primary/30 transition-colors duration-200"
                            >
                                <FiFilter className="mr-2 text-onSurface/70" />
                                Filters
                                {hasActiveFilters && (
                                    <span className="ml-2 bg-primary text-surfaceContainer text-xs px-2 py-1 rounded-full">
                                        Active
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => fetchUsers()}
                                className="flex items-center px-4 py-3 bg-surface rounded-lg border border-surfaceContainerHigh hover:border-primary/30 transition-colors duration-200"
                            >
                                <FiRefreshCw className="text-onSurface/70" />
                            </button>
                        </div>

                        {/* Advanced Filters Dropdown */}
                        {isFiltersOpen && (
                            <div className="mt-4 p-4 bg-surface rounded-lg border border-surfaceContainerHigh">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Email Filter */}
                                    <Field>
                                        <Label className="block text-sm font-medium text-onSurface/70 mb-2">
                                            Email
                                        </Label>
                                        <Input
                                            type="text"
                                            placeholder="Search by email..."
                                            value={filters.email}
                                            onChange={(e) =>
                                                onFilterChange(
                                                    "email",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-4 py-2 bg-surfaceContainer rounded-lg border border-surfaceContainerHigh focus:border-primary focus:ring-1 focus:ring-primary text-onSurface"
                                        />
                                    </Field>

                                    {/* Role Filter */}
                                    <Field>
                                        <Label className="block text-sm font-medium text-onSurface/70 mb-2">
                                            Role
                                        </Label>
                                        <UserRoleListbox
                                            options={Object.keys(
                                                USER_ROLES_MAP
                                            )}
                                            selectedOption={filters.role}
                                            onChange={(value) =>
                                                onFilterChange(
                                                    "role",
                                                    value || ""
                                                )
                                            }
                                        />
                                    </Field>
                                </div>

                                {/* Clear Filters Button */}
                                {hasActiveFilters && (
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            onClick={clearFilters}
                                            className="flex items-center px-4 py-2 text-onSurface/70 hover:text-onSurface transition-colors duration-200"
                                        >
                                            <FiX className="mr-1" />
                                            Clear all filters
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
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
                                {filters.username && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                                        Username: {filters.username}
                                        <button
                                            onClick={() =>
                                                onFilterChange("username", "")
                                            }
                                            className="ml-2 hover:text-primary-800"
                                        >
                                            <FiX size={14} />
                                        </button>
                                    </span>
                                )}
                                {filters.email && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm">
                                        Email: {filters.email}
                                        <button
                                            onClick={() =>
                                                onFilterChange("email", "")
                                            }
                                            className="ml-2 hover:text-secondary-800"
                                        >
                                            <FiX size={14} />
                                        </button>
                                    </span>
                                )}
                                {filters.role && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-tertiary/10 text-tertiary text-sm">
                                        Role:{" "}
                                        {
                                            USER_ROLES_MAP[
                                                filters.role as keyof typeof USER_ROLES_MAP
                                            ].text
                                        }
                                        <button
                                            onClick={() =>
                                                onFilterChange("role", "")
                                            }
                                            className="ml-2 hover:text-tertiary-800"
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
                                    <FiUsers className="text-primary text-xl" />
                                </div>
                                <div>
                                    <p className="text-sm text-onSurface/70">
                                        Total Users
                                    </p>
                                    <p className="text-2xl font-bold text-onSurface">
                                        {usersData.meta.total}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-surfaceContainer rounded-xl p-6 border border-surfaceContainerHigh">
                            <div className="flex items-center">
                                <div className="bg-secondary/10 p-3 rounded-lg mr-4">
                                    <FiUser className="text-secondary text-xl" />
                                </div>
                                <div>
                                    <p className="text-sm text-onSurface/70">
                                        Regular Users
                                    </p>
                                    <p className="text-2xl font-bold text-onSurface">
                                        {
                                            usersData.data.filter(
                                                (u) => u.role === "user"
                                            ).length
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-surfaceContainer rounded-xl p-6 border border-surfaceContainerHigh">
                            <div className="flex items-center">
                                <div className="bg-tertiary/10 p-3 rounded-lg mr-4">
                                    <FiShield className="text-tertiary text-xl" />
                                </div>
                                <div>
                                    <p className="text-sm text-onSurface/70">
                                        Administrators
                                    </p>
                                    <p className="text-2xl font-bold text-onSurface">
                                        {
                                            usersData.data.filter(
                                                (u) => u.role === "admin"
                                            ).length
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Users Grid */}
                    <div className="space-y-4">
                        {isInitialLoading || isProcessing ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <UserRowSkeleton key={i} />
                            ))
                        ) : usersData.data.length === 0 ? (
                            <FilteredEmptyState
                                entityName="users"
                                icon={<FiUsers />}
                                hasActiveFilters={hasActiveFilters}
                                onClearFilters={clearFilters}
                                onCreate={onCreateUser}
                            />
                        ) : (
                            usersData.data.map((user) => (
                                <UserRow
                                    key={user.id}
                                    user={user}
                                    onShowUser={onShowUser}
                                    onEditUser={onEditUser}
                                    onDeleteUser={onDeleteUser}
                                />
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {usersData.meta && usersData.meta.total > 0 && (
                        <Pagination
                            meta={usersData.meta}
                            links={usersData.links}
                            onPageChange={onPageChange}
                        />
                    )}

                    {/* Modals */}
                    <UserCreateModal
                        isOpen={isCreateOpen}
                        onClose={() => setIsCreateOpen(false)}
                        onSuccess={() => {
                            setIsCreateOpen(false);
                            fetchUsers();
                        }}
                    />
                    <UserEditModal
                        isOpen={isEditOpen}
                        user={selectedUser}
                        onClose={() => setIsEditOpen(false)}
                        onSuccess={() => {
                            setIsEditOpen(false);
                            fetchUsers();
                        }}
                    />
                    <UserShowModal
                        isOpen={isShowOpen}
                        user={selectedUser}
                        onClose={() => setIsShowOpen(false)}
                    />
                    <UserDeleteModal
                        isOpen={isDeleteOpen}
                        user={selectedUser}
                        onClose={() => setIsDeleteOpen(false)}
                        onSuccess={() => {
                            setIsDeleteOpen(false);
                            fetchUsers();
                        }}
                    />
                </div>
            </div>
        </AdminLayout>
    );
};

export default UserIndex;
