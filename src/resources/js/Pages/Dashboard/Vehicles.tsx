import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps, PaginatedData, Vehicle } from "@/types";
import { Head } from "@inertiajs/react";

const Vehicles = ({
    vehicles,
}: PageProps<{ vehicles: PaginatedData<Vehicle> }>) => {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Vehicles
                </h2>
            }
        >
            <Head title="Vehicles" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <table className="min-w-full border border-gray-200 dark:border-gray-600 bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-900">
                                <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-900 dark:text-gray-100">
                                    Image
                                </th>
                                <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-900 dark:text-gray-100">
                                    Name
                                </th>
                                <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-900 dark:text-gray-100">
                                    Category
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehicles.data.map((vehicle) => (
                                <tr
                                    key={vehicle.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                                        <div className="max-w-[20%] h-12 flex items-center justify-center">
                                            <img
                                                src={
                                                    vehicle.manufacturer
                                                        .img_path
                                                }
                                                alt={vehicle.manufacturer.name}
                                                className="max-h-[100%] object-contain mx-auto"
                                            />
                                        </div>
                                    </td>
                                    <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                                        {vehicle.name}
                                    </td>
                                    <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                                        {vehicle.category.name}
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

export default Vehicles;
