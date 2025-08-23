import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import { PropsWithChildren } from "react";

interface GuestLayoutProps extends PropsWithChildren {
    header?: React.ReactNode;
}

export default function Guest({ children, header }: GuestLayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-surfaceContainer via-surface to-surfaceContainerHigh flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <ApplicationLogo className="h-16 w-auto mx-auto" />
                    </Link>
                    {header}
                </div>

                {/* Content Card */}
                <div className="bg-surfaceContainer rounded-2xl shadow-2xl border border-surfaceContainerHigh p-8">
                    {children}
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-onSurface/70 text-sm">
                        © 2024 EA WRC Setups. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
