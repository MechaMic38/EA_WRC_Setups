import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Location, PageProps, PaginatedData } from "@/types";
import { Head } from "@inertiajs/react";

const Locations = ({
    locations,
}: PageProps<{ locations: PaginatedData<Location> }>) => {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Locations
                </h2>
            }
        >
            <Head title="Locations" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <table className="min-w-full border border-gray-200 dark:border-gray-600 bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-900">
                                <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-900 dark:text-gray-100">
                                    Banner
                                </th>
                                <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-900 dark:text-gray-100">
                                    Name
                                </th>
                                <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-900 dark:text-gray-100">
                                    Description
                                </th>
                                <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-900 dark:text-gray-100">
                                    Surface
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {locations.data.map((location) => (
                                <tr
                                    key={location.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600">
                                        <img
                                            src={location.img_banner_path}
                                            alt={location.name}
                                            className="w-20 h-auto object-cover rounded"
                                        />
                                    </td>
                                    <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                                        {location.name}
                                    </td>
                                    <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                                        {location.description}
                                    </td>
                                    <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                                        {location.surface_type}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Locations;
