import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import { Link, usePage } from "@inertiajs/react";
import { PropsWithChildren, useState } from "react";
import { BsWrenchAdjustable } from "react-icons/bs";
import {
    FiSettings,
    FiMapPin,
    FiInfo,
    FiUser,
    FiLogIn,
    FiUserPlus,
    FiMenu,
    FiX,
    FiChevronDown,
    FiHome,
} from "react-icons/fi";
import { LiaCarSideSolid } from "react-icons/lia";

export default function UserLayout({ children }: PropsWithChildren) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

    const navigation = [
        {
            name: "Home",
            href: route("home"),
            icon: FiHome,
            current: route().current("home"),
        },
        {
            name: "Vehicles",
            href: route("vehicles.index"),
            icon: LiaCarSideSolid,
            current:
                route().current("vehicles.index") ||
                route().current("vehicles.*"),
        },
        {
            name: "Locations",
            href: route("locations.index"),
            icon: FiMapPin,
            current:
                route().current("locations.index") ||
                route().current("locations.*"),
        },
        {
            name: "About",
            href: route("about"),
            icon: FiInfo,
            current: route().current("about"),
        },
    ];

    return (
        <div className="min-h-screen bg-surface">
            {/* Mobile sidebar overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Navigation Bar */}
            <nav className="border-b border-surfaceContainerHigh bg-surfaceContainer">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex items-center">
                            {/* Mobile menu button */}
                            <div className="flex lg:hidden items-center mr-2">
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center rounded-xl p-2 text-onSurface hover:bg-surfaceContainerHigh focus:outline-none transition-colors duration-200"
                                    onClick={() =>
                                        setMobileMenuOpen(!mobileMenuOpen)
                                    }
                                >
                                    <span className="sr-only">
                                        Open main menu
                                    </span>
                                    {mobileMenuOpen ? (
                                        <FiX
                                            className="h-6 w-6"
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <FiMenu
                                            className="h-6 w-6"
                                            aria-hidden="true"
                                        />
                                    )}
                                </button>
                            </div>

                            {/* Logo */}
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-onSurface" />
                                </Link>
                            </div>

                            {/* Desktop Navigation Links */}
                            <div className="hidden lg:flex space-x-2 sm:ml-10">
                                {navigation.map((item) => (
                                    <NavLink
                                        key={item.name}
                                        href={item.href}
                                        active={item.current}
                                        className="group flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 text-onSurface hover:bg-surfaceContainerHigh hover:shadow-sm"
                                    >
                                        <item.icon className="h-4 w-4 mr-1" />
                                        {item.name}
                                    </NavLink>
                                ))}
                            </div>
                        </div>

                        {/* User/Auth Section */}
                        <div className="hidden sm:ml-6 sm:flex sm:items-center">
                            {user ? (
                                <div className="relative">
                                    <button
                                        onClick={() =>
                                            setIsUserDropdownOpen(
                                                !isUserDropdownOpen
                                            )
                                        }
                                        className="flex items-center text-left rounded-xl px-3 py-2 transition-all duration-200 hover:bg-surfaceContainerHigh text-onSurface"
                                    >
                                        <div className="flex-shrink-0">
                                            <img
                                                className="h-8 w-8 rounded-full border-2 border-surfaceContainerHigh"
                                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                    user.username
                                                )}&background=CFBDFE&color=211F24`}
                                                alt=""
                                            />
                                        </div>
                                        <div className="ml-2 hidden md:block">
                                            <p className="text-sm font-medium truncate">
                                                {user.username}
                                            </p>
                                        </div>
                                        <FiChevronDown
                                            className={`ml-1 h-4 w-4 text-onSurface/50 transition-transform duration-200 ${
                                                isUserDropdownOpen
                                                    ? "transform rotate-180"
                                                    : ""
                                            }`}
                                        />
                                    </button>

                                    {/* User Dropdown */}
                                    {isUserDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-surfaceContainer rounded-xl shadow-2xl border border-surfaceContainerHigh overflow-hidden z-50">
                                            <div className="p-2">
                                                <Dropdown.Link
                                                    href={route("profile.edit")}
                                                    className="flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 hover:bg-surfaceContainerHigh text-onSurface"
                                                >
                                                    <FiUser className="mr-2 h-4 w-4" />
                                                    Profile
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={route(
                                                        "profile.setups.index"
                                                    )}
                                                    className="flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 hover:bg-surfaceContainerHigh text-onSurface"
                                                >
                                                    <BsWrenchAdjustable className="mr-2 h-4 w-4" />
                                                    My Setups
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={route("auth.logout")}
                                                    method="post"
                                                    as="button"
                                                    className="flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 hover:bg-surfaceContainerHigh text-red-500 w-full text-left"
                                                >
                                                    <FiLogIn className="mr-2 h-4 w-4" />
                                                    Log Out
                                                </Dropdown.Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex space-x-2">
                                    <Link
                                        href={route("login")}
                                        className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 text-onSurface hover:bg-surfaceContainerHigh"
                                    >
                                        <FiLogIn className="mr-1 h-4 w-4" />{" "}
                                        Login
                                    </Link>
                                    <Link
                                        href={route("register")}
                                        className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 text-primaryContainer hover:bg-primary/20"
                                    >
                                        <FiUserPlus className="mr-1 h-4 w-4" />{" "}
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile sidebar menu */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 transform shadow-2xl transition-all duration-300 ease-in-out lg:hidden
                    ${
                        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                    } bg-surfaceContainer border-r border-surfaceContainerHigh`}
            >
                <div className="flex h-full flex-col">
                    {/* Logo section */}
                    <div className="flex h-16 shrink-0 items-center px-6 border-b border-surfaceContainerHigh">
                        <Link href="/" className="flex items-center">
                            <ApplicationLogo className="h-8 w-auto" />
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto px-3 py-6">
                        <div className="space-y-2">
                            {navigation.map((item) => (
                                <NavLink
                                    key={item.name}
                                    href={item.href}
                                    active={item.current}
                                    className="group flex items-center px-4 py-3 text-sm font-medium rounded-xl w-full transition-all duration-200 text-onSurface hover:bg-surfaceContainerHigh hover:shadow-sm"
                                    onClick={() => setMobileMenuOpen(false)}
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

                    {/* Auth section for mobile */}
                    <div className="p-4 border-t border-surfaceContainerHigh">
                        {user ? (
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <img
                                            className="h-10 w-10 rounded-full border-2 border-surfaceContainerHigh"
                                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                user.username
                                            )}&background=CFBDFE&color=211F24`}
                                            alt=""
                                        />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-semibold text-onSurface">
                                            {user.username}
                                        </p>
                                        <p className="text-xs text-onSurface/70">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Link
                                        href={route("profile.edit")}
                                        className="flex items-center w-full px-4 py-2 text-sm rounded-xl transition-all duration-200 hover:bg-surfaceContainerHigh text-onSurface"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <FiUser className="mr-2 h-4 w-4" />
                                        Profile
                                    </Link>
                                    <Link
                                        href={route("auth.logout")}
                                        method="post"
                                        as="button"
                                        className="flex items-center w-full px-4 py-2 text-sm rounded-xl transition-all duration-200 hover:bg-surfaceContainerHigh text-red-500 text-left"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <FiLogIn className="mr-2 h-4 w-4" />
                                        Log Out
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Link
                                    href={route("login")}
                                    className="flex items-center justify-center w-full px-4 py-2 text-sm rounded-xl transition-all duration-200 hover:bg-surfaceContainerHigh text-onSurface"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <FiLogIn className="mr-2 h-4 w-4" />
                                    Login
                                </Link>
                                <Link
                                    href={route("register")}
                                    className="flex items-center justify-center w-full px-4 py-2 text-sm rounded-xl transition-all duration-200 bg-primaryContainer text-onPrimaryContainer hover:bg-primaryContainer/80"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <FiUserPlus className="mr-2 h-4 w-4" />
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Page Content */}
            <main>
                <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
