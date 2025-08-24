import InputError from "@/Components/Form/InputError";
import InputLabel from "@/Components/Form/InputLabel";
import PrimaryButton from "@/Components/Form/PrimaryButton";
import TextInput from "@/Components/Form/TextInput";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { User } from "@/types";
import { Transition } from "@headlessui/react";
import { Link, usePage } from "@inertiajs/react";
import { FormEventHandler, useRef } from "react";
import { FiCheck } from "react-icons/fi";

interface UpdateProfileInformationFormData {
    username: string;
    email: string;
}

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage().props.auth.user;

    const {
        data,
        setData,
        patch,
        errors,
        reset,
        isProcessing,
        isRecentlySuccessful,
    } = useAxiosForm<User, UpdateProfileInformationFormData>({
        username: user.username,
        email: user.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route("api.profile.update"), {
            onError: (error) => {
                if (error.response?.status === 422) {
                    if (errors.username) {
                        reset("username");
                    }
                    if (errors.email) {
                        reset("email");
                    }
                }
            },
        });
    };

    return (
        <div className={className}>
            <p className="text-onSurface/70 mb-6">
                Update your account's profile information and email address.
            </p>

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel
                        htmlFor="username"
                        value="Username"
                        className="text-onSurface/70 mb-2"
                    />
                    <TextInput
                        className="w-full"
                        value={data.username}
                        onChange={(e) => setData("username", e.target.value)}
                        required
                        error={errors.username}
                    />
                    <InputError className="mt-2" message={errors.username} />
                </div>

                <div>
                    <InputLabel
                        htmlFor="email"
                        value="Email"
                        className="text-onSurface/70 mb-2"
                    />
                    <TextInput
                        type="email"
                        className="w-full"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                        error={errors.email}
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && (
                    <div className="bg-surfaceContainerHigh p-4 rounded-lg">
                        <p className="text-sm text-onSurface">
                            Your email address is unverified.
                            <Link
                                href={route("verification.send")}
                                method="post"
                                as="button"
                                className="ml-1 text-primary hover:text-primary-600 underline transition-colors"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === "verification-link-sent" && (
                            <div className="mt-2 text-sm font-medium text-green-500">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton
                        disabled={isProcessing}
                        className="px-6 py-3"
                    >
                        {isProcessing ? "Saving..." : "Save Changes"}
                    </PrimaryButton>

                    <Transition
                        show={isRecentlySuccessful}
                        enter="transition-opacity duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="flex items-center text-green-500">
                            <FiCheck className="mr-2" />
                            <span className="text-sm font-medium">
                                Saved successfully
                            </span>
                        </div>
                    </Transition>
                </div>
            </form>
        </div>
    );
}
