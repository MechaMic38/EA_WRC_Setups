import AuthenticatedLayout from "@/Layouts/AdminLayout";
import { PageProps } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { FiUser, FiShield, FiTrash2 } from "react-icons/fi";
import UserLayout from "@/Layouts/UserLayout";

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    // Determine which layout to use based on user role
    const user = usePage().props.auth.user;

    const Layout = user.role === "admin" ? AuthenticatedLayout : UserLayout;

    return (
        <Layout>
            <Head title="Profile Settings" />

            <div className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-onSurface">
                            Profile Settings
                        </h1>
                        <p className="text-onSurface/70 mt-2">
                            Manage your account settings and preferences
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Profile Information Card */}
                        <div className="bg-surfaceContainer rounded-xl p-6 border border-surfaceContainerHigh">
                            <div className="flex items-center mb-6">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                                    <FiUser className="text-primary text-lg" />
                                </div>
                                <h2 className="text-xl font-semibold text-onSurface">
                                    Profile Information
                                </h2>
                            </div>
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                            />
                        </div>

                        {/* Password Update Card */}
                        <div className="bg-surfaceContainer rounded-xl p-6 border border-surfaceContainerHigh">
                            <div className="flex items-center mb-6">
                                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center mr-3">
                                    <FiShield className="text-secondary text-lg" />
                                </div>
                                <h2 className="text-xl font-semibold text-onSurface">
                                    Update Password
                                </h2>
                            </div>
                            <UpdatePasswordForm />
                        </div>

                        {/* Delete Account Card */}
                        <div className="bg-surfaceContainer rounded-xl p-6 border border-surfaceContainerHigh">
                            <div className="flex items-center mb-6">
                                <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center mr-3">
                                    <FiTrash2 className="text-error text-lg" />
                                </div>
                                <h2 className="text-xl font-semibold text-onSurface">
                                    Delete Account
                                </h2>
                            </div>
                            <DeleteUserForm />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
