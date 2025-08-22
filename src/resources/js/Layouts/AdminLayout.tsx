import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import { Link, usePage } from "@inertiajs/react";
import { PropsWithChildren, ReactNode, useState } from "react";
import {
    FiHome,
    FiGrid,
    FiMapPin,
    FiTruck,
    FiUsers,
    FiSettings,
    FiLogOut,
    FiUser,
    FiMenu,
    FiX,
    FiChevronUp,
} from "react-icons/fi";

export default function AdminLayout({ children }: PropsWithChildren) {
    const user = usePage().props.auth.user;
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const navigation = [
        {
            name: "Dashboard",
            href: route("admin"),
            icon: FiHome,
            current: route().current("admin"),
        },
        {
            name: "Categories",
            href: route("admin.categories.index"),
            icon: FiGrid,
            current: route().current("admin.categories.index"),
        },
        {
            name: "Locations",
            href: route("admin.locations.index"),
            icon: FiMapPin,
            current: route().current("admin.locations.index"),
        },
        {
            name: "Manufacturers",
            href: route("admin.manufacturers.index"),
            icon: FiTruck,
            current: route().current("admin.manufacturers.index"),
        },
        {
            name: "Users",
            href: route("admin.users.index"),
            icon: FiUsers,
            current: route().current("admin.users.index"),
        },
        {
            name: "Vehicles",
            href: route("admin.vehicles.index"),
            icon: FiSettings,
            current: route().current("admin.vehicles.index"),
        },
    ];

    return (
        <div className="flex h-screen bg-surface">
            {/* Mobile sidebar overlay */}
            {mobileSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setMobileSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 transform shadow-lg transition duration-200 ease-in-out lg:translate-x-0
        ${
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative bg-surfaceContainer`}
            >
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className="flex h-16 shrink-0 items-center px-4 border-b border-surfaceContainer">
                        <Link href="/">
                            <ApplicationLogo className="w-auto" />
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto px-2 py-4">
                        <div className="space-y-1">
                            {navigation.map((item) => (
                                <NavLink
                                    key={item.name}
                                    href={item.href}
                                    active={item.current}
                                    className="group flex items-center px-3 py-3 text-sm font-medium rounded-md w-full transition-colors duration-150 text-onSurface hover:bg-surfaceContainer"
                                >
                                    <item.icon
                                        className={`mr-3 flex-shrink-0 h-5 w-5 ${
                                            item.current
                                                ? "text-primary"
                                                : "text-onSurface"
                                        }`}
                                    />
                                    <span className="truncate">
                                        {item.name}
                                    </span>
                                    {item.current && (
                                        <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
                                    )}
                                </NavLink>
                            ))}
                        </div>
                    </nav>

                    {/* User section */}
                    <div className="p-4 border-t border-surfaceContainer">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center w-full text-left rounded-md p-2 transition-colors duration-150 hover:bg-surfaceContainer">
                                    <div className="flex-shrink-0">
                                        <img
                                            className="h-8 w-8 rounded-full"
                                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                user.username
                                            )}&background=${encodeURIComponent(
                                                "CFBDFE".replace("#", "")
                                            )}&color=${encodeURIComponent(
                                                "211F24".replace("#", "")
                                            )}`}
                                            alt=""
                                        />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-onSurface">
                                            {user.username}
                                        </p>
                                        <p className="text-xs font-medium text-onSurface text-opacity-70">
                                            {user.email}
                                        </p>
                                    </div>
                                    <FiChevronUp className="ml-auto h-4 w-4 text-onSurface text-opacity-70" />
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content>
                                <Dropdown.Link
                                    href={route("profile.edit")}
                                    className="flex items-center transition-colors duration-150 hover:bg-surfaceContainer text-onSurface"
                                >
                                    <FiUser className="mr-2 h-4 w-4 text-onSurface text-opacity-70" />
                                    Profile
                                </Dropdown.Link>
                                <Dropdown.Link
                                    href={route("auth.logout")}
                                    method="post"
                                    as="button"
                                    className="flex items-center transition-colors duration-150 hover:bg-surfaceContainer text-onSurface"
                                >
                                    <FiLogOut className="mr-2 h-4 w-4 text-onSurface text-opacity-70" />
                                    Log Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Mobile header */}
                <div className="lg:hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-surfaceContainer bg-surfaceContainer">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-md p-2 text-onSurface hover:bg-surfaceContainer focus:outline-none"
                            onClick={() =>
                                setMobileSidebarOpen(!mobileSidebarOpen)
                            }
                        >
                            <span className="sr-only">Open sidebar</span>
                            {mobileSidebarOpen ? (
                                <FiX className="h-6 w-6" aria-hidden="true" />
                            ) : (
                                <FiMenu
                                    className="h-6 w-6"
                                    aria-hidden="true"
                                />
                            )}
                        </button>
                        <div className="flex-shrink-0">
                            <ApplicationLogo className="h-8 w-auto" />
                        </div>
                        <div className="w-6"></div>
                    </div>
                </div>

                {/* Content area */}
                <div className="flex flex-1 flex-col overflow-y-auto">
                    <main className="flex-1 p-4 sm:p-6 text-onSurface">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
