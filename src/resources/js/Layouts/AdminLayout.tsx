import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import { Link, usePage } from "@inertiajs/react";
import { PropsWithChildren, useState } from "react";
import { BsTools } from "react-icons/bs";
import { FaCar } from "react-icons/fa";
import {
    FiHome,
    FiMapPin,
    FiUsers,
    FiSettings,
    FiLogOut,
    FiUser,
    FiMenu,
    FiX,
    FiChevronDown,
    FiTag,
} from "react-icons/fi";
import { LiaCarSideSolid } from "react-icons/lia";
import { MdOutlineDashboard } from "react-icons/md";

export default function AdminLayout({ children }: PropsWithChildren) {
    const user = usePage().props.auth.user;
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

    const navigation = [
        {
            name: "Dashboard",
            href: route("admin"),
            icon: MdOutlineDashboard,
            current: route().current("admin"),
        },
        {
            name: "Vehicles",
            href: route("admin.vehicles.index"),
            icon: LiaCarSideSolid,
            current:
                route().current("admin.vehicles.index") ||
                route().current("admin.vehicles.*"),
        },
        {
            name: "Categories",
            href: route("admin.categories.index"),
            icon: FiTag,
            current:
                route().current("admin.categories.index") ||
                route().current("admin.categories.*"),
        },
        {
            name: "Locations",
            href: route("admin.locations.index"),
            icon: FiMapPin,
            current:
                route().current("admin.locations.index") ||
                route().current("admin.locations.*"),
        },
        {
            name: "Manufacturers",
            href: route("admin.manufacturers.index"),
            icon: BsTools,
            current:
                route().current("admin.manufacturers.index") ||
                route().current("admin.manufacturers.*"),
        },
        {
            name: "Users",
            href: route("admin.users.index"),
            icon: FiUsers,
            current:
                route().current("admin.users.index") ||
                route().current("admin.users.*"),
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
                className={`fixed inset-y-0 left-0 z-50 w-64 transform shadow-2xl transition-all duration-300 ease-in-out lg:translate-x-0 overflow-hidden
        ${
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative bg-surfaceContainer border-r border-surfaceContainerHigh`}
            >
                {/* Light effect - bottom left  */}
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-tertiaryContainer/70 rounded-full blur-[100px] transform -translate-x-1/2 translate-y-1/2"></div>

                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className="flex h-20 shrink-0 items-center justify-center px-6 border-b border-surfaceContainerHigh">
                        <Link
                            href={route("admin")}
                            className="flex items-center"
                        >
                            <ApplicationLogo className="h-8 w-auto" />
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto px-3 py-6">
                        <div className="space-y-2">
                            <div className="px-3 mb-4">
                                <p className="text-xs font-semibold text-onSurface/50 uppercase tracking-wider">
                                    Navigation
                                </p>
                            </div>
                            {navigation.map((item) => (
                                <NavLink
                                    key={item.name}
                                    href={item.href}
                                    active={item.current}
                                    glow={item.current}
                                    className="group flex items-center px-4 py-3 text-sm font-medium rounded-xl w-full transition-all duration-200 text-onSurface hover:bg-surfaceContainerHigh hover:shadow-sm"
                                >
                                    <div
                                        className={`p-2 rounded-lg mr-3 transition-colors duration-200 ${
                                            item.current
                                                ? "bg-primary/20 text-primary"
                                                : "bg-surfaceContainerHigh text-onSurface/70 group-hover:bg-primary/10 group-hover:text-primary"
                                        }`}
                                    >
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <span className="truncate font-medium">
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
                    <div className="p-4 border-t border-surfaceContainerHigh">
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setIsUserDropdownOpen(!isUserDropdownOpen)
                                }
                                className="flex items-center w-full text-left rounded-xl p-3 transition-all duration-200 hover:bg-surfaceContainerHigh"
                            >
                                <div className="flex-shrink-0">
                                    <img
                                        className="h-10 w-10 rounded-full border-2 border-surfaceContainerHigh"
                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                            user.username
                                        )}&background=CFBDFE&color=211F24`}
                                        alt=""
                                    />
                                </div>
                                <div className="ml-3 flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-onSurface truncate">
                                        {user.username}
                                    </p>
                                    <p className="text-xs text-onSurface/70 truncate">
                                        {user.email}
                                    </p>
                                </div>
                                <FiChevronDown
                                    className={`ml-2 h-4 w-4 text-onSurface/50 transition-transform duration-200 ${
                                        isUserDropdownOpen
                                            ? "transform rotate-180"
                                            : ""
                                    }`}
                                />
                            </button>

                            {/* User Dropdown */}
                            {isUserDropdownOpen && (
                                <div className="absolute bottom-full left-0 right-0 mb-2 bg-surfaceContainer rounded-xl shadow-2xl border border-surfaceContainerHigh overflow-hidden z-50">
                                    <div className="p-2">
                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                            className="flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 hover:bg-surfaceContainerHigh text-onSurface"
                                        >
                                            <FiUser className="mr-2 h-4 w-4 text-onSurface/70" />
                                            Profile Settings
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("auth.logout")}
                                            method="post"
                                            as="button"
                                            className="flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 hover:bg-surfaceContainerHigh text-red-500 w-full text-left"
                                        >
                                            <FiLogOut className="mr-2 h-4 w-4" />
                                            Sign Out
                                        </Dropdown.Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Mobile header */}
                <div className="lg:hidden">
                    <div className="flex items-center justify-between px-4 py-4 border-b border-surfaceContainerHigh bg-surfaceContainer">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-xl p-2 text-onSurface hover:bg-surfaceContainerHigh focus:outline-none transition-colors duration-200"
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
                            <ApplicationLogo className="h-7 w-auto" />
                        </div>
                        <div className="w-10">
                            <img
                                className="h-8 w-8 rounded-full border-2 border-surfaceContainerHigh"
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    user.username
                                )}&background=CFBDFE&color=211F24`}
                                alt=""
                            />
                        </div>
                    </div>
                </div>

                {/* Content area */}
                <div className="relative flex flex-1 flex-col overflow-y-auto">
                    {/* Light effect - top right  */}
                    <div className="absolute top-0 right-0 w-[700px] h-[700px] transform translate-x-1/2 -translate-y-1/2">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-secondary/25 to-transparent rounded-full blur-[120px] opacity-60"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-tertiary/20 to-transparent rounded-full blur-[80px] opacity-40 scale-110"></div>
                    </div>

                    <main className="flex-1 p-4 sm:p-6 lg:p-8 text-onSurface z-10">
                        <div className="max-w-7xl mx-auto">{children}</div>
                    </main>
                </div>
            </div>
        </div>
    );
}
