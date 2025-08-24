import InputError from "@/Components/InputError";
import InputLabel from "@/Components/Form/InputLabel";
import PrimaryButton from "@/Components/Form/PrimaryButton";
import TextInput from "@/Components/TextInput";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { Transition } from "@headlessui/react";
import { FormEventHandler, useRef } from "react";

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
    // Refs to manage focus on input fields
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    // Form data and error management
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
                        passwordInput.current?.focus();
                    }
                    if (errors.current_password) {
                        reset("current_password");
                        currentPasswordInput.current?.focus();
                    }
                }
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Update Password
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Ensure your account is using a long, random password to stay
                    secure.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                <div>
                    <InputLabel
                        htmlFor="current_password"
                        value="Current Password"
                    />

                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) =>
                            setData("current_password", e.target.value)
                        }
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                    />

                    <InputError
                        message={errors.current_password}
                        className="mt-2"
                    />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="New Password" />

                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                    />

                    <TextInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={isProcessing}>Save</PrimaryButton>

                    <Transition
                        show={isRecentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
