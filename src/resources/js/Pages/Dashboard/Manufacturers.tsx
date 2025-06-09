import useAxiosForm from "@/Hooks/useAxiosForm";
import AdminLayout from "@/Layouts/AdminLayout";
import { Manufacturer, PageProps, PaginatedData } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const SkeletonRow = () => (
    <tr>
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-12 w-20 bg-surfaceContainer rounded animate-pulse"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-5 w-32 bg-surfaceContainer rounded animate-pulse"></div>
        </td>
    </tr>
);

const Manufacturers = () => {
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

    const fetchManufacturers = async (url?: string) => {
        get(url || route("api.manufacturers.index"), {
            onSuccess: (response) => {
                setManufacturersData(response.data);
            },
            onError: (error) => {
                console.error("Error fetching categories:", error);
            },
        });
    };

    useEffect(() => {
        fetchManufacturers();
    }, []);

    return (
        <AdminLayout>
            <Head title="Locations" />

            <div className="py-6">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
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
                                </tr>
                            </thead>
                            <tbody className="bg-surface divide-y divide-surfaceContainer">
                                {isProcessing
                                    ? Array.from({ length: 5 }).map((_, i) => (
                                          <SkeletonRow key={i} />
                                      ))
                                    : manufacturersData.data.map(
                                          (manufacturer) => (
                                              <tr
                                                  key={manufacturer.id}
                                                  className="hover:bg-surfaceContainer transition-colors duration-150"
                                              >
                                                  <td className="px-6 py-4 whitespace-nowrap">
                                                      <img
                                                          src={
                                                              manufacturer.imgPath
                                                          }
                                                          alt={
                                                              manufacturer.name
                                                          }
                                                          className="h-12 w-20 object-contain"
                                                      />
                                                  </td>
                                                  <td className="px-6 py-4 whitespace-nowrap">
                                                      <div className="text-sm font-medium text-onSurface">
                                                          {manufacturer.name}
                                                      </div>
                                                  </td>
                                              </tr>
                                          )
                                      )}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {manufacturersData.meta && (
                            <div className="bg-surfaceContainer px-4 py-3 flex items-center justify-between border-t border-surfaceContainer sm:px-6">
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-onSurface">
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
                                        </p>
                                    </div>
                                    <div>
                                        <nav
                                            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                                            aria-label="Pagination"
                                        >
                                            {manufacturersData.links.prev && (
                                                <Link
                                                    href={
                                                        manufacturersData.links
                                                            .prev
                                                    }
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        fetchManufacturers(
                                                            manufacturersData
                                                                .links.prev
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

                                            {manufacturersData.meta.links?.map(
                                                (link, index) => (
                                                    <Link
                                                        key={index}
                                                        href={link.url || "#"}
                                                        onClick={(e) => {
                                                            if (link.url) {
                                                                e.preventDefault();
                                                                fetchManufacturers(
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

                                            {manufacturersData.links.next && (
                                                <Link
                                                    href={
                                                        manufacturersData.links
                                                            .next
                                                    }
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        fetchManufacturers(
                                                            manufacturersData
                                                                .links.next
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
                </div>
            </div>
        </AdminLayout>
    );
};

export default Manufacturers;
