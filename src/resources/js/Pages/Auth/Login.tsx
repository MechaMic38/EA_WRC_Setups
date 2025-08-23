import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import { FiEye, FiEyeOff, FiMail, FiLock, FiAlertCircle } from "react-icons/fi";

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("auth.login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout
            header={
                <>
                    <h1 className="text-2xl font-bold text-onSurface mt-4">
                        Welcome Back
                    </h1>
                    <p className="text-onSurface/70 mt-2">
                        Sign in to your account
                    </p>
                </>
            }
        >
            <Head title="Log in" />

            {/* Status Message */}
            {status && (
                <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl flex items-center">
                    <FiAlertCircle className="mr-2" />
                    <span className="text-sm">{status}</span>
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                {/* Email Field */}
                <div>
                    <InputLabel
                        htmlFor="email"
                        value="Email Address"
                        className="block text-sm font-medium text-onSurface/70 mb-2"
                    />

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiMail className="h-5 w-5 text-onSurface/50" />
                        </div>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="pl-10 w-full bg-surface border-surfaceContainerHigh focus:border-primary focus:ring-1 focus:ring-primary"
                            autoComplete="username"
                            onChange={(e) => setData("email", e.target.value)}
                            placeholder="Enter your email address"
                        />
                    </div>

                    <InputError message={errors.email} className="mt-2" />
                </div>

                {/* Password Field */}
                <div>
                    <InputLabel
                        htmlFor="password"
                        value="Password"
                        className="block text-sm font-medium text-onSurface/70 mb-2"
                    />

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiLock className="h-5 w-5 text-onSurface/50" />
                        </div>
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={data.password}
                            className="pl-10 pr-10 w-full bg-surface border-surfaceContainerHigh focus:border-primary focus:ring-1 focus:ring-primary"
                            autoComplete="current-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            placeholder="Enter your password"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <FiEyeOff className="h-5 w-5 text-onSurface/50 hover:text-onSurface" />
                            ) : (
                                <FiEye className="h-5 w-5 text-onSurface/50 hover:text-onSurface" />
                            )}
                        </button>
                    </div>

                    <InputError message={errors.password} className="mt-2" />
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-onSurface/80">
                            Remember me
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className="text-sm text-primary hover:text-primary-600 transition-colors duration-200"
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                {/* Submit Button */}
                <div className="mt-6">
                    <PrimaryButton
                        className="w-full justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
                        disabled={processing}
                    >
                        {processing ? (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                                Signing in...
                            </div>
                        ) : (
                            "Sign in"
                        )}
                    </PrimaryButton>
                </div>

                {/* Error Summary */}
                {(errors.email || errors.password) && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
                        <div className="flex items-center">
                            <FiAlertCircle className="mr-2" />
                            <span className="text-sm">
                                Please check your credentials and try again.
                            </span>
                        </div>
                    </div>
                )}
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
                <p className="text-onSurface/70 text-sm">
                    Don't have an account?{" "}
                    <Link
                        href={route("register")}
                        className="text-primary hover:text-primary-600 font-medium transition-colors duration-200"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}
