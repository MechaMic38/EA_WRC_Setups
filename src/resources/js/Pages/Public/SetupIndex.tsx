import { Head, Link } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { useEffect, useState, Fragment } from "react";
import { FiChevronRight, FiFilter, FiX } from "react-icons/fi";
import { Listbox, Transition } from "@headlessui/react";
import {
    Category,
    Manufacturer,
    PaginatedData,
    Setup,
    Vehicle,
    User,
} from "@/types";

export default function SetupIndex() {
    // API hooks
    const { get: getSetups, isProcessing: loadingSetups } = useAxiosForm<
        PaginatedData<Setup>
    >([]);
    const { get: getVehicles } = useAxiosForm<PaginatedData<Vehicle>>([]);
    const { get: getCategories } = useAxiosForm<PaginatedData<Category>>([]);
    const { get: getManufacturers } = useAxiosForm<PaginatedData<Manufacturer>>(
        []
    );

    // State
    const [setups, setSetups] = useState<Setup[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);

    const seasons = ["spring", "summer", "autumn", "winter"];
    const surfaces = ["dry", "wet", "snow"];

    const [filters, setFilters] = useState<{
        category: Category | null;
        manufacturer: Manufacturer | null;
        season: string | null;
        surface: string | null;
        username: string;
    }>({
        category: null,
        manufacturer: null,
        season: null,
        surface: null,
        username: "",
    });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Fetch data
    useEffect(() => {
        getSetups(route("api.setups.index", { paginate: false }), {
            onSuccess: ({ data }) => setSetups(data.data),
        });
        getVehicles(route("api.vehicles.index", { paginate: false }), {
            onSuccess: (res) => setVehicles(res.data.data),
        });
        getCategories(route("api.categories.index", { paginate: false }), {
            onSuccess: (res) => setCategories(res.data.data),
        });
        getManufacturers(
            route("api.manufacturers.index", { paginate: false }),
            {
                onSuccess: (res) => setManufacturers(res.data.data),
            }
        );
    }, []);

    // Apply filters
    const filtered = setups.filter((s) => {
        const veh = vehicles.find((v) => v.id === s.vehicle.id);
        if (filters.category && veh?.category.id !== filters.category.id)
            return false;
        if (
            filters.manufacturer &&
            veh?.manufacturer.id !== filters.manufacturer.id
        )
            return false;
        if (filters.season && s.season !== filters.season) return false;
        if (filters.surface && s.surfaceCondition !== filters.surface)
            return false;
        if (
            filters.username &&
            !s.user.username
                .toLowerCase()
                .includes(filters.username.toLowerCase())
        )
            return false;
        return true;
    });

    // Page calculations
    const pageCount = Math.ceil(filtered.length / itemsPerPage);
    const paginated = filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const clearFilters = () => {
        setFilters({
            category: null,
            manufacturer: null,
            season: null,
            surface: null,
            username: "",
        });
        setCurrentPage(1);
    };

    return (
        <UserLayout>
            <Head title="Setups" />

            {/* Hero */}
            <div className="relative bg-surfaceContainer py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold text-onSurface">
                        Setups
                    </h1>
                    <p className="mt-2 text-onSurface">
                        {filtered.length} setups found
                        {Object.values(filters).some((v) => v) && " (filtered)"}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="sticky top-0 z-50 bg-surface py-4 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 flex flex-wrap gap-4 items-end">
                    <div className="flex items-center gap-2">
                        <FiFilter className="text-primary" />
                        <h2 className="text-onSurface font-medium">Filters</h2>
                        <button
                            onClick={clearFilters}
                            className="ml-2 text-primary hover:underline"
                        >
                            <FiX /> Clear
                        </button>
                    </div>

                    {/* Category */}
                    <div className="w-1/5">
                        <Listbox
                            value={filters.category}
                            onChange={(c) => {
                                setFilters((f) => ({ ...f, category: c }));
                                setCurrentPage(1);
                            }}
                        >
                            <div className="relative">
                                <Listbox.Button className="w-full bg-surfaceContainer p-2 rounded-md border border-outline flex justify-between items-center">
                                    {filters.category
                                        ? filters.category.name
                                        : "Category"}
                                    <FiChevronRight />
                                </Listbox.Button>
                                <Transition
                                    as={Fragment}
                                    leave="transition ease-in duration-75"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <Listbox.Options className="absolute mt-1 w-full bg-surfaceContainer rounded-md shadow-lg max-h-60 overflow-auto z-20">
                                        <Listbox.Option
                                            key="all"
                                            value={null}
                                            className="p-2 cursor-pointer"
                                        >
                                            All Categories
                                        </Listbox.Option>
                                        {categories.map((cat) => (
                                            <Listbox.Option
                                                key={cat.id}
                                                value={cat}
                                                className="p-2 cursor-pointer"
                                            >
                                                {cat.name}
                                            </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                </Transition>
                            </div>
                        </Listbox>
                    </div>

                    {/* Manufacturer */}
                    <div className="w-1/5">
                        <Listbox
                            value={filters.manufacturer}
                            onChange={(m) => {
                                setFilters((f) => ({ ...f, manufacturer: m }));
                                setCurrentPage(1);
                            }}
                        >
                            <div className="relative">
                                <Listbox.Button className="w-full bg-surfaceContainer p-2 rounded-md border border-outline flex justify-between items-center">
                                    {filters.manufacturer
                                        ? filters.manufacturer.name
                                        : "Manufacturer"}
                                    <FiChevronRight />
                                </Listbox.Button>
                                <Transition
                                    as={Fragment}
                                    leave="transition ease-in duration-75"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <Listbox.Options className="absolute mt-1 w-full bg-surfaceContainer rounded-md shadow-lg max-h-60 overflow-auto z-20">
                                        <Listbox.Option
                                            key="all"
                                            value={null}
                                            className="p-2 cursor-pointer"
                                        >
                                            All Manufacturers
                                        </Listbox.Option>
                                        {manufacturers.map((m) => (
                                            <Listbox.Option
                                                key={m.id}
                                                value={m}
                                                className="p-2 cursor-pointer"
                                            >
                                                {m.name}
                                            </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                </Transition>
                            </div>
                        </Listbox>
                    </div>

                    {/* Season */}
                    <div className="w-1/5">
                        <Listbox
                            value={filters.season}
                            onChange={(s) => {
                                setFilters((f) => ({ ...f, season: s }));
                                setCurrentPage(1);
                            }}
                        >
                            <div className="relative">
                                <Listbox.Button className="w-full bg-surfaceContainer p-2 rounded-md border border-outline flex justify-between items-center">
                                    {filters.season || "Season"}
                                    <FiChevronRight />
                                </Listbox.Button>
                                <Transition
                                    as={Fragment}
                                    leave="transition ease-in duration-75"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <Listbox.Options className="absolute mt-1 w-full bg-surfaceContainer rounded-md shadow-lg max-h-60 overflow-auto z-20">
                                        <Listbox.Option
                                            key="all"
                                            value={null}
                                            className="p-2 cursor-pointer"
                                        >
                                            All Seasons
                                        </Listbox.Option>
                                        {seasons.map((s) => (
                                            <Listbox.Option
                                                key={s}
                                                value={s}
                                                className="p-2 cursor-pointer capitalize"
                                            >
                                                {s}
                                            </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                </Transition>
                            </div>
                        </Listbox>
                    </div>

                    {/* Surface */}
                    <div className="w-1/5">
                        <Listbox
                            value={filters.surface}
                            onChange={(s) => {
                                setFilters((f) => ({ ...f, surface: s }));
                                setCurrentPage(1);
                            }}
                        >
                            <div className="relative">
                                <Listbox.Button className="w-full bg-surfaceContainer p-2 rounded-md border border-outline flex justify-between items-center">
                                    {filters.surface || "Surface"}
                                    <FiChevronRight />
                                </Listbox.Button>
                                <Transition
                                    as={Fragment}
                                    leave="transition ease-in duration-75"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <Listbox.Options className="absolute mt-1 w-full bg-surfaceContainer rounded-md shadow-lg max-h-60 overflow-auto z-20">
                                        <Listbox.Option
                                            key="all"
                                            value={null}
                                            className="p-2 cursor-pointer"
                                        >
                                            All Surfaces
                                        </Listbox.Option>
                                        {surfaces.map((s) => (
                                            <Listbox.Option
                                                key={s}
                                                value={s}
                                                className="p-2 cursor-pointer capitalize"
                                            >
                                                {s}
                                            </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                </Transition>
                            </div>
                        </Listbox>
                    </div>

                    {/* Username */}
                    <div className="flex-1">
                        <label className="sr-only">User</label>
                        <input
                            type="text"
                            placeholder="Username"
                            value={filters.username}
                            onChange={(e) => {
                                setFilters((f) => ({
                                    ...f,
                                    username: e.target.value,
                                }));
                                setCurrentPage(1);
                            }}
                            className="w-full bg-surfaceContainer p-2 rounded-md border border-outline text-onSurface"
                        />
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="py-8 bg-surface">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loadingSetups ? (
                        <p className="text-onSurface">Loading...</p>
                    ) : (
                        paginated.map((setup) => (
                            <div
                                key={setup.id}
                                className="bg-surfaceContainer rounded-lg p-4 shadow hover:shadow-lg"
                            >
                                <h3 className="text-lg font-semibold text-onSurface mb-2">
                                    {setup.location.name}
                                </h3>
                                <p className="text-sm text-onSurface mb-1">
                                    Vehicle: {setup.vehicle.name}
                                </p>
                                <p className="text-sm text-onSurface mb-1">
                                    Season: {setup.season}
                                </p>
                                <p className="text-sm text-onSurface mb-1">
                                    Surface: {setup.surfaceCondition}
                                </p>
                                <p className="text-sm text-onSurface mb-1">
                                    By: {setup.user.username}
                                </p>
                                <Link
                                    href={route("setups.show", setup.id)}
                                    className="inline-flex items-center text-primary mt-2"
                                >
                                    View Details{" "}
                                    <FiChevronRight className="ml-1" />
                                </Link>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                <div className="mt-8 flex justify-center items-center space-x-3">
                    <button
                        onClick={() =>
                            setCurrentPage((p) => Math.max(p - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-surfaceContainer rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    {[...Array(pageCount)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-3 py-1 rounded ${
                                currentPage === i + 1
                                    ? "bg-primary text-onPrimary"
                                    : "bg-surfaceContainer"
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() =>
                            setCurrentPage((p) => Math.min(p + 1, pageCount))
                        }
                        disabled={currentPage === pageCount}
                        className="px-3 py-1 bg-surfaceContainer rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </UserLayout>
    );
}
