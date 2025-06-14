import LocationCreateModal from "@/Components/Modals/Location/LocationCreateModal";
import LocationDeleteModal from "@/Components/Modals/Location/LocationDeleteModal";
import LocationEditModal from "@/Components/Modals/Location/LocationEditModal";
import LocationShowModal from "@/Components/Modals/Location/LocationShowModal";
import useAxiosForm from "@/Hooks/useAxiosForm";
import AdminLayout from "@/Layouts/AdminLayout";
import { LocationSummary, PageProps, PaginatedData } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import {
    FiChevronLeft,
    FiChevronRight,
    FiEdit,
    FiEye,
    FiPlus,
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
            <div className="h-5 w-24 bg-surfaceContainer rounded animate-pulse"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-5 w-24 bg-surfaceContainer rounded animate-pulse"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex space-x-2">
                <div className="h-8 w-8 bg-surfaceContainer rounded animate-pulse"></div>
                <div className="h-8 w-8 bg-surfaceContainer rounded animate-pulse"></div>
                <div className="h-8 w-8 bg-surfaceContainer rounded animate-pulse"></div>
            </div>
        </td>
    </tr>
);

const LocationIndex = () => {
    const { get, isProcessing } = useAxiosForm<PaginatedData<LocationSummary>>(
        []
    );
    const [locationsData, setLocationsData] = useState<
        PaginatedData<LocationSummary>
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

    const [selectedLocation, setSelectedLocation] =
        useState<LocationSummary | null>(null);
    const [showModalType, setShowModalType] = useState<
        "create" | "show" | "edit" | "delete" | null
    >(null);

    const fetchLocations = async (url?: string) => {
        get(url || route("api.locations.index"), {
            onSuccess: (response) => {
                setLocationsData(response.data);
            },
            onError: (error) => {
                console.error("Error fetching locations:", error);
            },
        });
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    const handleCreateLocation = () => {
        setSelectedLocation(null);
        setShowModalType("create");
    };

    const handleShowLocation = (location: LocationSummary) => {
        setSelectedLocation(location);
        setShowModalType("show");
    };

    const handleEditLocation = (location: LocationSummary) => {
        setSelectedLocation(location);
        setShowModalType("edit");
    };

    const handleDeleteLocation = (location: LocationSummary) => {
        setSelectedLocation(location);
        setShowModalType("delete");
    };

    const handleDeletedLocation = () => {
        setShowModalType(null);
        fetchLocations();
    };

    return (
        <AdminLayout>
            <Head title="Locations" />

            <div className="py-6">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold text-onSurface">
                            Locations
                        </h1>
                        <button
                            onClick={handleCreateLocation}
                            className="flex items-center px-4 py-2 bg-primary text-surfaceContainer rounded-md hover:bg-primary-600 transition-colors"
                        >
                            <FiPlus className="mr-2" /> Create Location
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
                                        Banner
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
                                        Description
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-onSurface uppercase tracking-wider"
                                    >
                                        Surface
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
                                    : locationsData.data.map((location) => (
                                          <tr
                                              key={location.id}
                                              className="hover:bg-surfaceContainer transition-colors duration-150"
                                          >
                                              <td className="px-6 py-4 whitespace-nowrap">
                                                  <img
                                                      src={
                                                          location.imgBannerPath
                                                      }
                                                      alt={location.name}
                                                      className="h-12 w-20 object-cover rounded"
                                                  />
                                              </td>
                                              <td className="px-6 py-4 whitespace-nowrap">
                                                  <div className="text-sm font-medium text-onSurface">
                                                      {location.name}
                                                  </div>
                                              </td>
                                              <td className="px-6 py-4">
                                                  <div className="text-sm text-onSurface line-clamp-2">
                                                      {location.description}
                                                  </div>
                                              </td>
                                              <td className="px-6 py-4 whitespace-nowrap">
                                                  <div className="text-sm text-onSurface">
                                                      {location.surfaceType}
                                                  </div>
                                              </td>
                                              <td className="px-6 py-4 whitespace-nowrap text-sm text-onSurface">
                                                  <div className="flex space-x-2">
                                                      <button
                                                          onClick={() =>
                                                              handleShowLocation(
                                                                  location
                                                              )
                                                          }
                                                          className="p-2 bg-surfaceContainer rounded-md text-onSurface hover:bg-surfaceContainer/80 transition-colors"
                                                          title="View details"
                                                      >
                                                          <FiEye />
                                                      </button>
                                                      <button
                                                          onClick={() =>
                                                              handleEditLocation(
                                                                  location
                                                              )
                                                          }
                                                          className="p-2 bg-surfaceContainer rounded-md text-onSurface hover:bg-surfaceContainer/80 transition-colors"
                                                          title="Edit category"
                                                      >
                                                          <FiEdit />
                                                      </button>
                                                      <button
                                                          onClick={() =>
                                                              handleDeleteLocation(
                                                                  location
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
                        {locationsData.meta && (
                            <div className="bg-surfaceContainer px-4 py-3 flex items-center justify-between border-t border-surfaceContainer sm:px-6">
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-onSurface">
                                            Showing{" "}
                                            <span className="font-medium">
                                                {locationsData.meta.from}
                                            </span>{" "}
                                            to{" "}
                                            <span className="font-medium">
                                                {locationsData.meta.to}
                                            </span>{" "}
                                            of{" "}
                                            <span className="font-medium">
                                                {locationsData.meta.total}
                                            </span>{" "}
                                            results
                                        </p>
                                    </div>
                                    <div>
                                        <nav
                                            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                                            aria-label="Pagination"
                                        >
                                            {locationsData.links.prev && (
                                                <Link
                                                    href={
                                                        locationsData.links.prev
                                                    }
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        fetchLocations(
                                                            locationsData.links
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

                                            {locationsData.meta.links?.map(
                                                (link, index) => (
                                                    <Link
                                                        key={index}
                                                        href={link.url || "#"}
                                                        onClick={(e) => {
                                                            if (link.url) {
                                                                e.preventDefault();
                                                                fetchLocations(
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

                                            {locationsData.links.next && (
                                                <Link
                                                    href={
                                                        locationsData.links.next
                                                    }
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        fetchLocations(
                                                            locationsData.links
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
                        <LocationCreateModal
                            isOpen={true}
                            onClose={() => setShowModalType(null)}
                        />
                    )}
                    {showModalType === "edit" && selectedLocation && (
                        <LocationEditModal
                            isOpen={true}
                            onClose={() => setShowModalType(null)}
                            location={selectedLocation}
                        />
                    )}
                    {showModalType === "show" && selectedLocation && (
                        <LocationShowModal
                            isOpen={true}
                            onClose={() => setShowModalType(null)}
                            location={selectedLocation}
                        />
                    )}
                    {showModalType === "delete" && selectedLocation && (
                        <LocationDeleteModal
                            isOpen={true}
                            onClose={handleDeletedLocation}
                            location={selectedLocation}
                        />
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default LocationIndex;
