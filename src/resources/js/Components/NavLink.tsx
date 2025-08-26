import { InertiaLinkProps, Link } from "@inertiajs/react";

export default function NavLink({
    active = false,
    glow = false,
    className = "",
    children,
    ...props
}: InertiaLinkProps & { active: boolean; glow?: boolean }) {
    return (
        <Link
            {...props}
            className={`relative inline-flex items-center text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ${
                active
                    ? "text-primary"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            } ${className}`}
        >
            {/* Glow effect when active */}
            {active && glow && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 -ml-[44px] w-16 h-16 rounded-full bg-primary/70 blur-xl"></span>
            )}
            {children}
        </Link>
    );
}
