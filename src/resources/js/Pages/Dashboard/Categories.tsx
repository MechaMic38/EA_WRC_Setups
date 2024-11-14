import { PageProps } from '@/types';

interface Category {
    id: string;
    name: string;
    img_path: string;
}

const Categories = ({
    categories
}: PageProps<{ categories: Category[] }>) => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Categories</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b border-gray-200 text-left">Image</th>
                            <th className="py-2 px-4 border-b border-gray-200 text-left">Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b border-gray-200">
                                    <img
                                        src={`/storage/${category.img_path}`} // TODO: provide from backend
                                        alt={category.name}
                                        className="w-20 h-auto object-cover rounded"
                                    />
                                </td>
                                <td className="py-2 px-4 border-b border-gray-200">{category.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Categories;
