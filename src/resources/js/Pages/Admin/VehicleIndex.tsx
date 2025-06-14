import VehicleCreateModal from "@/Components/Modals/VehicleCreateModal";
import useAxiosForm from "@/Hooks/useAxiosForm";
import AdminLayout from "@/Layouts/AdminLayout";
import { PageProps, PaginatedData, Vehicle } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiPlus } from "react-icons/fi";

const SkeletonRow = () => (
    <tr>
        <td className="py-4 px-4">
            <div className="h-12 w-12 bg-surfaceContainer rounded-full animate-pulse"></div>
        </td>
        <td className="py-4 px-4">
            <div className="h-5 w-32 bg-surfaceContainer rounded animate-pulse"></div>
        </td>
        <td className="py-4 px-4">
            <div className="h-5 w-24 bg-surfaceContainer rounded animate-pulse"></div>
        </td>
        <td className="py-4 px-4">
            <div className="h-5 w-24 bg-surfaceContainer rounded animate-pulse"></div>
        </td>
    </tr>
);

const VehicleIndex = () => {
    const { get, isProcessing } = useAxiosForm<PaginatedData<Vehicle>>([]);
    const [vehiclesData, setVehiclesData] = useState<PaginatedData<Vehicle>>({
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

    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

    const fetchVehicles = async (url?: string) => {
        get(url || route("api.vehicles.index"), {
            onSuccess: (response) => {
                setVehiclesData(response.data);
            },
            onError: (error) => {
                console.error("Error fetching vehicles:", error);
            },
        });
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    return (
        <AdminLayout>
            <Head title="Vehicles" />

            <div className="py-6">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center px-4 py-2 bg-primary text-surfaceContainer rounded-md hover:bg-primary-600"
                    >
                        <FiPlus className="mr-2" /> Create Vehicle
                    </button>

                    {/* Table */}
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
                                        Vehicle
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-onSurface uppercase tracking-wider"
                                    >
                                        Manufacturer
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-onSurface uppercase tracking-wider"
                                    >
                                        Category
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-surface divide-y divide-surfaceContainer">
                                {isProcessing
                                    ? Array.from({ length: 5 }).map((_, i) => (
                                          <SkeletonRow key={i} />
                                      ))
                                    : vehiclesData.data.map((vehicle) => (
                                          <tr
                                              key={vehicle.id}
                                              className="hover:bg-surfaceContainer transition-colors duration-150"
                                          >
                                              <td className="px-6 py-4 whitespace-nowrap">
                                                  <div className="flex items-center">
                                                      <div className="flex-shrink-0 h-10 w-10">
                                                          <img
                                                              className="h-10 w-10 rounded-full object-contain"
                                                              src={
                                                                  vehicle.imgPath
                                                              }
                                                              alt={vehicle.name}
                                                          />
                                                      </div>
                                                  </div>
                                              </td>
                                              <td className="px-6 py-4 whitespace-nowrap">
                                                  <div className="text-sm font-medium text-onSurface">
                                                      {vehicle.name}
                                                  </div>
                                              </td>
                                              <td className="px-6 py-4 whitespace-nowrap">
                                                  <div className="flex items-center">
                                                      <div className="flex-shrink-0 h-5 w-5">
                                                          <img
                                                              className="h-5 w-5 object-contain"
                                                              src={
                                                                  vehicle
                                                                      .manufacturer
                                                                      .imgPath
                                                              }
                                                              alt={
                                                                  vehicle
                                                                      .manufacturer
                                                                      .name
                                                              }
                                                          />
                                                      </div>
                                                      <div className="ml-2 text-sm text-onSurface">
                                                          {
                                                              vehicle
                                                                  .manufacturer
                                                                  .name
                                                          }
                                                      </div>
                                                  </div>
                                              </td>
                                              <td className="px-6 py-4 whitespace-nowrap">
                                                  <div className="flex items-center">
                                                      <div className="flex-shrink-0 h-5 w-5">
                                                          <img
                                                              className="h-5 w-5 object-contain"
                                                              src={
                                                                  vehicle
                                                                      .category
                                                                      .imgPath
                                                              }
                                                              alt={
                                                                  vehicle
                                                                      .category
                                                                      .name
                                                              }
                                                          />
                                                      </div>
                                                      <div className="ml-2 text-sm text-onSurface">
                                                          {
                                                              vehicle.category
                                                                  .name
                                                          }
                                                      </div>
                                                  </div>
                                              </td>
                                          </tr>
                                      ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {vehiclesData.meta && (
                            <div className="bg-surfaceContainer px-4 py-3 flex items-center justify-between border-t border-surfaceContainer sm:px-6">
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-onSurface">
                                            Showing{" "}
                                            <span className="font-medium">
                                                {vehiclesData.meta.from}
                                            </span>{" "}
                                            to{" "}
                                            <span className="font-medium">
                                                {vehiclesData.meta.to}
                                            </span>{" "}
                                            of{" "}
                                            <span className="font-medium">
                                                {vehiclesData.meta.total}
                                            </span>{" "}
                                            results
                                        </p>
                                    </div>
                                    <div>
                                        <nav
                                            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                                            aria-label="Pagination"
                                        >
                                            {vehiclesData.links.prev && (
                                                <Link
                                                    href={
                                                        vehiclesData.links.prev
                                                    }
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        fetchVehicles(
                                                            vehiclesData.links
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

                                            {vehiclesData.meta.links?.map(
                                                (link, index) => (
                                                    <Link
                                                        key={index}
                                                        href={link.url || "#"}
                                                        onClick={(e) => {
                                                            if (link.url) {
                                                                e.preventDefault();
                                                                fetchVehicles(
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

                                            {vehiclesData.links.next && (
                                                <Link
                                                    href={
                                                        vehiclesData.links.next
                                                    }
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        fetchVehicles(
                                                            vehiclesData.links
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

                    {/* Create Vehicle Modal */}
                    {isCreateModalOpen && (
                        <VehicleCreateModal
                            onClose={() => setIsCreateModalOpen(false)}
                        />
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default VehicleIndex;
