import AdminLayout from "@/Layouts/AdminLayout";
import { PageProps, PaginatedData, User } from "@/types";
import { useEffect, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import useAxiosForm from "@/Hooks/useAxiosForm";
import {
    FiChevronLeft,
    FiChevronRight,
    FiEdit,
    FiEye,
    FiPlus,
    FiTrash2,
} from "react-icons/fi";
import UserCreateModal from "@/Components/Modals/User/UserCreateModal";
import UserEditModal from "@/Components/Modals/User/UserEditModal";
import UserShowModal from "@/Components/Modals/User/UserShowModal";
import UserDeleteModal from "@/Components/Modals/User/UserDeleteModal";

const SkeletonRow = () => (
    <tr>
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-10 w-10 bg-surfaceContainer rounded-full animate-pulse"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-5 w-32 bg-surfaceContainer rounded animate-pulse"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-5 w-48 bg-surfaceContainer rounded animate-pulse"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-5 w-24 bg-surfaceContainer rounded animate-pulse"></div>
        </td>
    </tr>
);

const UserIndex = () => {
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
    const [showModalType, setShowModalType] = useState<
        "create" | "show" | "edit" | "delete" | null
    >(null);

    const fetchUsers = async (url?: string) => {
        get(url || route("api.users.index"), {
            onSuccess: (response) => {
                setUsersData(response.data);
            },
            onError: (error) => {
                console.error("Error fetching users:", error);
            },
        });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = () => {
        setSelectedUser(null);
        setShowModalType("create");
    };

    const handleShowUser = (user: User) => {
        setSelectedUser(user);
        setShowModalType("show");
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setShowModalType("edit");
    };

    const handleDeleteUser = (user: User) => {
        setSelectedUser(user);
        setShowModalType("delete");
    };

    const handleDeletedUser = () => {
        setSelectedUser(null);
        setShowModalType(null);
        fetchUsers();
    };

    return (
        <AdminLayout>
            <Head title="Users" />

            <div className="py-6">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold text-onSurface">
                            Users
                        </h1>
                        <button
                            onClick={handleCreateUser}
                            className="flex items-center px-4 py-2 bg-primary text-surfaceContainer rounded-md hover:bg-primary-600 transition-colors"
                        >
                            <FiPlus className="mr-2" /> Create User
                        </button>
                    </div>

                    <div className="overflow-hidden border border-surfaceContainer rounded-lg">
                        <table className="min-w-full divide-y divide-surfaceContainer">
                            <thead className="bg-surfaceContainer">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-onSurface uppercase tracking-wider"
                                    >
                                        Profile
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-onSurface uppercase tracking-wider"
                                    >
                                        Username
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-onSurface uppercase tracking-wider"
                                    >
                                        Email
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-onSurface uppercase tracking-wider"
                                    >
                                        Role
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-onSurface uppercase tracking-wider"
                                    >
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-surface divide-y divide-surfaceContainer">
                                {isProcessing
                                    ? Array.from({ length: 5 }).map((_, i) => (
                                          <SkeletonRow key={i} />
                                      ))
                                    : usersData.data.map((user) => (
                                          <tr
                                              key={user.id}
                                              className="hover:bg-surfaceContainer transition-colors duration-150"
                                          >
                                              <td className="px-6 py-4 whitespace-nowrap">
                                                  <div className="flex-shrink-0 h-10 w-10">
                                                      <img
                                                          className="h-10 w-10 rounded-full object-cover"
                                                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                              user.username
                                                          )}&background=CFBDFE&color=211F24`}
                                                          alt={user.username}
                                                      />
                                                  </div>
                                              </td>
                                              <td className="px-6 py-4 whitespace-nowrap">
                                                  <div className="text-sm font-medium text-onSurface">
                                                      {user.username}
                                                  </div>
                                              </td>
                                              <td className="px-6 py-4 whitespace-nowrap">
                                                  <div className="text-sm text-onSurface">
                                                      {user.email}
                                                  </div>
                                              </td>
                                              <td className="px-6 py-4 whitespace-nowrap">
                                                  <span
                                                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                          user.role === "admin"
                                                              ? "bg-primary text-surfaceContainer"
                                                              : "bg-surfaceContainer text-onSurface"
                                                      }`}
                                                  >
                                                      {user.role}
                                                  </span>
                                              </td>
                                              <td className="px-6 py-4 whitespace-nowrap text-sm text-onSurface">
                                                  <div className="flex space-x-2">
                                                      <button
                                                          onClick={() =>
                                                              handleShowUser(
                                                                  user
                                                              )
                                                          }
                                                          className="p-2 bg-surfaceContainer rounded-md text-onSurface hover:bg-surfaceContainer/80 transition-colors"
                                                          title="View details"
                                                      >
                                                          <FiEye />
                                                      </button>
                                                      <button
                                                          onClick={() =>
                                                              handleEditUser(
                                                                  user
                                                              )
                                                          }
                                                          className="p-2 bg-surfaceContainer rounded-md text-onSurface hover:bg-surfaceContainer/80 transition-colors"
                                                          title="Edit category"
                                                      >
                                                          <FiEdit />
                                                      </button>
                                                      <button
                                                          onClick={() =>
                                                              handleDeleteUser(
                                                                  user
                                                              )
                                                          }
                                                          className="p-2 bg-surfaceContainer rounded-md text-red-500 hover:bg-red-500/10 transition-colors"
                                                          title="Delete category"
                                                      >
                                                          <FiTrash2 />
                                                      </button>
                                                  </div>
                                              </td>
                                          </tr>
                                      ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {usersData.meta && (
                            <div className="bg-surfaceContainer px-4 py-3 flex items-center justify-between border-t border-surfaceContainer sm:px-6">
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-onSurface">
                                            Showing{" "}
                                            <span className="font-medium">
                                                {usersData.meta.from}
                                            </span>{" "}
                                            to{" "}
                                            <span className="font-medium">
                                                {usersData.meta.to}
                                            </span>{" "}
                                            of{" "}
                                            <span className="font-medium">
                                                {usersData.meta.total}
                                            </span>{" "}
                                            results
                                        </p>
                                    </div>
                                    <div>
                                        <nav
                                            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                                            aria-label="Pagination"
                                        >
                                            {usersData.links.prev && (
                                                <Link
                                                    href={usersData.links.prev}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        fetchUsers(
                                                            usersData.links.prev
                                                        );
                                                    }}
                                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-surfaceContainer bg-surface text-sm font-medium text-onSurface hover:bg-surfaceContainer"
                                                >
                                                    <span className="sr-only">
                                                        Previous
                                                    </span>
                                                    <FiChevronLeft
                                                        className="h-5 w-5"
                                                        aria-hidden="true"
                                                    />
                                                </Link>
                                            )}

                                            {usersData.meta.links?.map(
                                                (link, index) => (
                                                    <Link
                                                        key={index}
                                                        href={link.url || "#"}
                                                        onClick={(e) => {
                                                            if (link.url) {
                                                                e.preventDefault();
                                                                fetchUsers(
                                                                    link.url
                                                                );
                                                            }
                                                        }}
                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                            link.active
                                                                ? "z-10 bg-primary border-primary text-surfaceContainer"
                                                                : "bg-surface border-surfaceContainer text-onSurface hover:bg-surfaceContainer"
                                                        }`}
                                                        dangerouslySetInnerHTML={{
                                                            __html: link.label,
                                                        }}
                                                    />
                                                )
                                            )}

                                            {usersData.links.next && (
                                                <Link
                                                    href={usersData.links.next}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        fetchUsers(
                                                            usersData.links.next
                                                        );
                                                    }}
                                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-surfaceContainer bg-surface text-sm font-medium text-onSurface hover:bg-surfaceContainer"
                                                >
                                                    <span className="sr-only">
                                                        Next
                                                    </span>
                                                    <FiChevronRight
                                                        className="h-5 w-5"
                                                        aria-hidden="true"
                                                    />
                                                </Link>
                                            )}
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Modals */}
                    {showModalType === "create" && (
                        <UserCreateModal
                            isOpen={true}
                            onClose={() => setShowModalType(null)}
                        />
                    )}
                    {showModalType === "edit" && selectedUser && (
                        <UserEditModal
                            isOpen={true}
                            onClose={() => setShowModalType(null)}
                            user={selectedUser}
                        />
                    )}
                    {showModalType === "show" && selectedUser && (
                        <UserShowModal
                            isOpen={true}
                            onClose={() => setShowModalType(null)}
                            user={selectedUser}
                        />
                    )}
                    {showModalType === "delete" && selectedUser && (
                        <UserDeleteModal
                            isOpen={true}
                            onClose={handleDeletedUser}
                            user={selectedUser}
                        />
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default UserIndex;
