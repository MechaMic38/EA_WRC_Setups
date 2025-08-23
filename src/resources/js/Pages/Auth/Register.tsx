import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import {
    FiEye,
    FiEyeOff,
    FiMail,
    FiLock,
    FiUser,
    FiAlertCircle,
    FiCheck,
} from "react-icons/fi";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("auth.register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    // Password strength indicators
    const passwordStrength = {
        hasLength: data.password.length >= 8,
        hasUppercase: /[A-Z]/.test(data.password),
        hasLowercase: /[a-z]/.test(data.password),
        hasNumber: /[0-9]/.test(data.password),
        hasSpecial: /[^A-Za-z0-9]/.test(data.password),
    };

    const passwordStrengthScore =
        Object.values(passwordStrength).filter(Boolean).length;
    const passwordStrengthText = [
        "Very Weak",
        "Weak",
        "Fair",
        "Good",
        "Strong",
        "Very Strong",
    ][passwordStrengthScore];

    return (
        <GuestLayout
            header={
                <>
                    <h1 className="text-2xl font-bold text-onSurface mt-4">
                        Create an Account
                    </h1>
                    <p className="text-onSurface/70 mt-2">
                        Please fill in the details below to create a new
                        account.
                    </p>
                </>
            }
        >
            <Head title="Register" />

            <form onSubmit={submit} className="space-y-6">
                {/* Name Field */}
                <div>
                    <InputLabel
                        htmlFor="name"
                        value="Full Name"
                        className="block text-sm font-medium text-onSurface/70 mb-2"
                    />

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiUser className="h-5 w-5 text-onSurface/50" />
                        </div>
                        <input
                            id="name"
                            name="name"
                            value={data.name}
                            className="pl-10 w-full bg-surface border-surfaceContainerHigh focus:border-primary focus:ring-1 focus:ring-primary"
                            autoComplete="name"
                            onChange={(e) => setData("name", e.target.value)}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    <InputError message={errors.name} className="mt-2" />
                </div>

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
                            autoComplete="email"
                            onChange={(e) => setData("email", e.target.value)}
                            placeholder="Enter your email address"
                            required
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
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            placeholder="Create a strong password"
                            required
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

                    {/* Password Strength Indicator */}
                    {data.password && (
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-onSurface/70">
                                    Password strength:{" "}
                                    <span
                                        className={`font-medium ${
                                            passwordStrengthScore >= 4
                                                ? "text-green-500"
                                                : passwordStrengthScore >= 2
                                                ? "text-yellow-500"
                                                : "text-red-500"
                                        }`}
                                    >
                                        {passwordStrengthText}
                                    </span>
                                </span>
                                <div className="flex space-x-1">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div
                                            key={i}
                                            className={`h-1 w-6 rounded-full ${
                                                i <= passwordStrengthScore
                                                    ? passwordStrengthScore >= 4
                                                        ? "bg-green-500"
                                                        : passwordStrengthScore >=
                                                          2
                                                        ? "bg-yellow-500"
                                                        : "bg-red-500"
                                                    : "bg-surfaceContainerHigh"
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Password Requirements */}
                            <div className="space-y-1 text-xs text-onSurface/60">
                                <div
                                    className={`flex items-center ${
                                        passwordStrength.hasLength
                                            ? "text-green-500"
                                            : ""
                                    }`}
                                >
                                    <FiCheck
                                        className={`mr-1 ${
                                            passwordStrength.hasLength
                                                ? ""
                                                : "invisible"
                                        }`}
                                    />
                                    At least 8 characters
                                </div>
                                <div
                                    className={`flex items-center ${
                                        passwordStrength.hasUppercase
                                            ? "text-green-500"
                                            : ""
                                    }`}
                                >
                                    <FiCheck
                                        className={`mr-1 ${
                                            passwordStrength.hasUppercase
                                                ? ""
                                                : "invisible"
                                        }`}
                                    />
                                    Uppercase letter
                                </div>
                                <div
                                    className={`flex items-center ${
                                        passwordStrength.hasLowercase
                                            ? "text-green-500"
                                            : ""
                                    }`}
                                >
                                    <FiCheck
                                        className={`mr-1 ${
                                            passwordStrength.hasLowercase
                                                ? ""
                                                : "invisible"
                                        }`}
                                    />
                                    Lowercase letter
                                </div>
                                <div
                                    className={`flex items-center ${
                                        passwordStrength.hasNumber
                                            ? "text-green-500"
                                            : ""
                                    }`}
                                >
                                    <FiCheck
                                        className={`mr-1 ${
                                            passwordStrength.hasNumber
                                                ? ""
                                                : "invisible"
                                        }`}
                                    />
                                    Number
                                </div>
                                <div
                                    className={`flex items-center ${
                                        passwordStrength.hasSpecial
                                            ? "text-green-500"
                                            : ""
                                    }`}
                                >
                                    <FiCheck
                                        className={`mr-1 ${
                                            passwordStrength.hasSpecial
                                                ? ""
                                                : "invisible"
                                        }`}
                                    />
                                    Special character
                                </div>
                            </div>
                        </div>
                    )}

                    <InputError message={errors.password} className="mt-2" />
                </div>

                {/* Confirm Password Field */}
                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                        className="block text-sm font-medium text-onSurface/70 mb-2"
                    />

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiLock className="h-5 w-5 text-onSurface/50" />
                        </div>
                        <input
                            id="password_confirmation"
                            type={showConfirmPassword ? "text" : "password"}
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="pl-10 pr-10 w-full bg-surface border-surfaceContainerHigh focus:border-primary focus:ring-1 focus:ring-primary"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            placeholder="Confirm your password"
                            required
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                        >
                            {showConfirmPassword ? (
                                <FiEyeOff className="h-5 w-5 text-onSurface/50 hover:text-onSurface" />
                            ) : (
                                <FiEye className="h-5 w-5 text-onSurface/50 hover:text-onSurface" />
                            )}
                        </button>
                    </div>

                    {/* Password Match Indicator */}
                    {data.password_confirmation && (
                        <div className="mt-2">
                            <div
                                className={`flex items-center text-xs ${
                                    data.password === data.password_confirmation
                                        ? "text-green-500"
                                        : "text-red-500"
                                }`}
                            >
                                <FiCheck className="mr-1" />
                                {data.password === data.password_confirmation
                                    ? "Passwords match"
                                    : "Passwords do not match"}
                            </div>
                        </div>
                    )}

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                {/* Submit Button */}
                <div className="mt-8">
                    <PrimaryButton
                        className="w-full justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
                        disabled={
                            processing ||
                            data.password !== data.password_confirmation
                        }
                    >
                        {processing ? (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                                Creating account...
                            </div>
                        ) : (
                            "Create Account"
                        )}
                    </PrimaryButton>
                </div>

                {/* Error Summary */}
                {(errors.name ||
                    errors.email ||
                    errors.password ||
                    errors.password_confirmation) && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
                        <div className="flex items-center">
                            <FiAlertCircle className="mr-2" />
                            <span className="text-sm">
                                Please check your information and try again.
                            </span>
                        </div>
                    </div>
                )}
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center">
                <p className="text-onSurface/70 text-sm">
                    Already have an account?{" "}
                    <Link
                        href={route("login")}
                        className="text-primary hover:text-primary-600 font-medium transition-colors duration-200"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}
