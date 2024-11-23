import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";

interface Manufacturer {
    id: string;
    name: string;
    img_path: string;
}

const Manufacturers = ({
    manufacturers,
}: PageProps<{ manufacturers: Manufacturer[] }>) => {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Manufacturers
                </h2>
            }
        >
            <Head title="Manufacturers" />

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
                            </tr>
                        </thead>
                        <tbody>
                            {manufacturers.map((manufacturer) => (
                                <tr
                                    key={manufacturer.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600">
                                        <div className="max-w-[20%] h-12 flex items-center justify-center">
                                            <img
                                                src={`/storage/${manufacturer.img_path}`} // TODO: provide from backend
                                                alt={manufacturer.name}
                                                className="max-h-[100%] object-contain mx-auto"
                                            />
                                        </div>
                                    </td>
                                    <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                                        {manufacturer.name}
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

export default Manufacturers;
