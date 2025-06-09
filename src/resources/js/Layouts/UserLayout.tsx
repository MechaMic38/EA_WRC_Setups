import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import { Link, usePage } from "@inertiajs/react";
import { PropsWithChildren } from "react";
import {
    FiSettings,
    FiTruck,
    FiMapPin,
    FiInfo,
    FiUser,
    FiLogIn,
    FiUserPlus,
} from "react-icons/fi";

export default function UserLayout({ children }: PropsWithChildren) {
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <div className="min-h-screen bg-surface dark:bg-gray-900">
            {/* Navigation Bar */}
            <nav className="border-b border-surfaceContainer bg-surfaceContainer dark:border-gray-700">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex items-center">
                            {/* Logo (Home Link) */}
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-onSurface" />
                                </Link>
                            </div>

                            {/* Navigation Links */}
                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <NavLink
                                    href={route("setups.index")}
                                    active={route().current("setups.index")}
                                >
                                    <FiSettings className="mr-1" /> Setups
                                </NavLink>
                                <NavLink
                                    href={route("vehicles.index")}
                                    active={route().current("vehicles.index")}
                                >
                                    <FiTruck className="mr-1" /> Vehicles
                                </NavLink>
                                <NavLink
                                    href={route("locations.index")}
                                    active={route().current("locations.index")}
                                >
                                    <FiMapPin className="mr-1" /> Locations
                                </NavLink>
                                <NavLink
                                    href={route("about")}
                                    active={route().current("about")}
                                >
                                    <FiInfo className="mr-1" /> About
                                </NavLink>
                            </div>
                        </div>

                        {/* User/Auth Section */}
                        <div className="hidden sm:ml-6 sm:flex sm:items-center">
                            {user ? (
                                <div className="relative ml-3">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center rounded-md border border-transparent px-3 py-2 text-sm font-medium leading-4 text-onSurface transition duration-150 ease-in-out hover:text-primary focus:outline-none"
                                                >
                                                    {user.username}
                                                    <svg
                                                        className="-mr-0.5 ml-2 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link
                                                href={route("profile.edit")}
                                            >
                                                <FiUser className="mr-2" />{" "}
                                                Profile
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route("auth.logout")}
                                                method="post"
                                                as="button"
                                            >
                                                <FiLogIn className="mr-2" /> Log
                                                Out
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            ) : (
                                <div className="space-x-4">
                                    <Link
                                        href={route("login")}
                                        className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-onSurface hover:text-primary"
                                    >
                                        <FiLogIn className="mr-1" /> Login
                                    </Link>
                                    <Link
                                        href={route("register")}
                                        className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-onSurface hover:text-primary"
                                    >
                                        <FiUserPlus className="mr-1" /> Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Page Content */}
            <main>
                <div className="mx-auto">{children}</div>
            </main>
        </div>
    );
}
