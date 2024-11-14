import { PageProps } from '@/types';

interface Vehicle {
    id: string;
    name: string;
    category_id: string;
    img_path: string;
}

const Vehicles = ({
    vehicles
}: PageProps<{ vehicles: Vehicle[] }>) => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Vehicles</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b border-gray-200 text-left">Image</th>
                            <th className="py-2 px-4 border-b border-gray-200 text-left">Name</th>
                            <th className="py-2 px-4 border-b border-gray-200 text-left">Category</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehicles.map((vehicle) => (
                            <tr key={vehicle.id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b border-gray-200">
                                    <img
                                        src={`/storage/${vehicle.img_path}`} // TODO: provide from backend
                                        alt={vehicle.name}
                                        className="w-20 h-auto object-cover rounded"
                                    />
                                </td>
                                <td className="py-2 px-4 border-b border-gray-200">{vehicle.name}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{vehicle.category_id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Vehicles;
