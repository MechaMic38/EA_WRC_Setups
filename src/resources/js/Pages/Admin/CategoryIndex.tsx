import CategoryCreateModal from "@/Components/Modals/CategoryCreateModal";
import CategoryDeleteModal from "@/Components/Modals/CategoryDeleteModal";
import CategoryEditModal from "@/Components/Modals/CategoryEditModal";
import CategoryShowModal from "@/Components/Modals/CategoryShowModal";
import useAxiosForm from "@/Hooks/useAxiosForm";
import AdminLayout from "@/Layouts/AdminLayout";
import { Category, PageProps, PaginatedData } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import {
    FiChevronLeft,
    FiChevronRight,
    FiPlus,
    FiEye,
    FiEdit,
    FiTrash2,
} from "react-icons/fi";

const SkeletonRow = () => (
    <tr>
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-12 w-20 bg-surfaceContainer rounded animate-pulse"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-5 w-32 bg-surfaceContainer rounded animate-pulse"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex space-x-2">
                <div className="h-8 w-8 bg-surfaceContainer rounded animate-pulse"></div>
                <div className="h-8 w-8 bg-surfaceContainer rounded animate-pulse"></div>
            </div>
        </td>
    </tr>
);

const CategoryIndex = () => {
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
    const [showModalType, setShowModalType] = useState<
        "create" | "show" | "edit" | "delete" | null
    >(null);

    const fetchCategories = async (url?: string) => {
        get(url || route("api.categories.index"), {
            onSuccess: (response) => {
                setCategoriesData(response.data);
            },
            onError: (error) => {
                console.error("Error fetching categories:", error);
            },
        });
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreateCategory = () => {
        setSelectedCategory(null);
        setShowModalType("create");
    };

    const handleShowCategory = (category: Category) => {
        setSelectedCategory(category);
        setShowModalType("show");
    };

    const handleEditCategory = (category: Category) => {
        setSelectedCategory(category);
        setShowModalType("edit");
    };

    const handleDeleteCategory = (category: Category) => {
        setSelectedCategory(category);
        setShowModalType("delete");
    };

    const handleCategoryDeleted = () => {
        setShowModalType(null);
        fetchCategories(); // Refresh the list
    };

    return (
        <AdminLayout>
            <Head title="Categories" />

            <div className="py-6">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold text-onSurface">
                            Categories
                        </h1>
                        <button
                            onClick={handleCreateCategory}
                            className="flex items-center px-4 py-2 bg-primary text-surfaceContainer rounded-md hover:bg-primary-600 transition-colors"
                        >
                            <FiPlus className="mr-2" /> Create Category
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
                                        Image
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-onSurface uppercase tracking-wider"
                                    >
                                        Name
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
                                    : categoriesData.data.map((category) => (
                                          <tr
                                              key={category.id}
                                              className="hover:bg-surfaceContainer transition-colors duration-150"
                                          >
                                              <td className="px-6 py-4 whitespace-nowrap">
                                                  <img
                                                      src={category.imgPath}
                                                      alt={category.name}
                                                      className="h-12 w-20 object-contain"
                                                  />
                                              </td>
                                              <td className="px-6 py-4 whitespace-nowrap">
                                                  <div className="text-sm font-medium text-onSurface">
                                                      {category.name}
                                                  </div>
                                              </td>
                                              <td className="px-6 py-4 whitespace-nowrap text-sm text-onSurface">
                                                  <div className="flex space-x-2">
                                                      <button
                                                          onClick={() =>
                                                              handleShowCategory(
                                                                  category
                                                              )
                                                          }
                                                          className="p-2 bg-surfaceContainer rounded-md text-onSurface hover:bg-surfaceContainer/80 transition-colors"
                                                          title="View details"
                                                      >
                                                          <FiEye />
                                                      </button>
                                                      <button
                                                          onClick={() =>
                                                              handleEditCategory(
                                                                  category
                                                              )
                                                          }
                                                          className="p-2 bg-surfaceContainer rounded-md text-onSurface hover:bg-surfaceContainer/80 transition-colors"
                                                          title="Edit category"
                                                      >
                                                          <FiEdit />
                                                      </button>
                                                      <button
                                                          onClick={() =>
                                                              handleDeleteCategory(
                                                                  category
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
                        {categoriesData.meta && (
                            <div className="bg-surfaceContainer px-4 py-3 flex items-center justify-between border-t border-surfaceContainer sm:px-6">
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-onSurface">
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
                                        </p>
                                    </div>
                                    <div>
                                        <nav
                                            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                                            aria-label="Pagination"
                                        >
                                            {categoriesData.links.prev && (
                                                <Link
                                                    href={
                                                        categoriesData.links
                                                            .prev
                                                    }
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        fetchCategories(
                                                            categoriesData.links
                                                                .prev
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

                                            {categoriesData.meta.links?.map(
                                                (link, index) => (
                                                    <Link
                                                        key={index}
                                                        href={link.url || "#"}
                                                        onClick={(e) => {
                                                            if (link.url) {
                                                                e.preventDefault();
                                                                fetchCategories(
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

                                            {categoriesData.links.next && (
                                                <Link
                                                    href={
                                                        categoriesData.links
                                                            .next
                                                    }
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        fetchCategories(
                                                            categoriesData.links
                                                                .next
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
                        <CategoryCreateModal
                            isOpen={true}
                            onClose={() => setShowModalType(null)}
                        />
                    )}
                    {showModalType === "show" && selectedCategory && (
                        <CategoryShowModal
                            isOpen={true}
                            onClose={() => setShowModalType(null)}
                            category={selectedCategory}
                        />
                    )}
                    {showModalType === "edit" && selectedCategory && (
                        <CategoryEditModal
                            isOpen={true}
                            onClose={() => setShowModalType(null)}
                            category={selectedCategory}
                        />
                    )}
                    {showModalType === "delete" && selectedCategory && (
                        <CategoryDeleteModal
                            isOpen={true}
                            onClose={handleCategoryDeleted}
                            category={selectedCategory}
                        />
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default CategoryIndex;
