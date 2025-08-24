import InputError from "@/Components/Form/InputError";
import InputLabel from "@/Components/Form/InputLabel";
import PrimaryButton from "@/Components/Form/PrimaryButton";
import TextInput from "@/Components/Form/TextInput";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { Transition } from "@headlessui/react";
import { FormEventHandler } from "react";
import { FiCheck } from "react-icons/fi";

interface UpdatePasswordFormData {
    current_password: string;
    password: string;
    password_confirmation: string;
}

export default function UpdatePasswordForm({
    className = "",
}: {
    className?: string;
}) {
    const {
        data,
        setData,
        errors,
        reset,
        isProcessing,
        isRecentlySuccessful,
        patch,
    } = useAxiosForm<{}, UpdatePasswordFormData>({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route("api.profile.password.update"), {
            onSuccess: () => reset(),
            onError: (error) => {
                if (error.response?.status === 422) {
                    if (errors.password) {
                        reset("password", "password_confirmation");
                    }
                    if (errors.current_password) {
                        reset("current_password");
                    }
                }
            },
        });
    };

    return (
        <div className={className}>
            <p className="text-onSurface/70 mb-6">
                Ensure your account is using a long, random password to stay
                secure.
            </p>

            <form onSubmit={updatePassword} className="space-y-6">
                <div>
                    <InputLabel
                        htmlFor="current_password"
                        value="Current Password"
                        className="text-onSurface/70 mb-2"
                    />
                    <TextInput
                        value={data.current_password}
                        onChange={(e) =>
                            setData("current_password", e.target.value)
                        }
                        type="password"
                        className="w-full"
                        error={errors.current_password}
                    />
                    <InputError
                        message={errors.current_password}
                        className="mt-2"
                    />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password"
                        value="New Password"
                        className="text-onSurface/70 mb-2"
                    />
                    <TextInput
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        type="password"
                        className="w-full"
                        error={errors.password}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                        className="text-onSurface/70 mb-2"
                    />
                    <TextInput
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        type="password"
                        className="w-full"
                        error={errors.password_confirmation}
                    />
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton
                        disabled={isProcessing}
                        className="px-6 py-3"
                    >
                        {isProcessing ? "Updating..." : "Update Password"}
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
                                Password updated
                            </span>
                        </div>
                    </Transition>
                </div>
            </form>
        </div>
    );
}
