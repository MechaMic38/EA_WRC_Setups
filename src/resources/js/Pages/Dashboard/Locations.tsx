import { PageProps } from '@/types';

interface Location {
    id: string;
    name: string;
    description: string;
    surface_type: string;
    img_banner_path: string;
    img_bg_path: string;
}

const Locations = ({
    locations
}: PageProps<{ locations: Location[] }>) => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Locations</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b border-gray-200 text-left">Banner</th>
                            <th className="py-2 px-4 border-b border-gray-200 text-left">Name</th>
                            <th className="py-2 px-4 border-b border-gray-200 text-left">Description</th>
                            <th className="py-2 px-4 border-b border-gray-200 text-left">Surface</th>
                        </tr>
                    </thead>
                    <tbody>
                        {locations.map((location) => (
                            <tr key={location.id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b border-gray-200">
                                    <img
                                        src={`/storage/${location.img_banner_path}`} // TODO: provide from backend
                                        alt={location.name}
                                        className="w-20 h-auto object-cover rounded"
                                    />
                                </td>
                                <td className="py-2 px-4 border-b border-gray-200">{location.name}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{location.description}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{location.surface_type}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Locations;
