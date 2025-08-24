import DangerButton from "@/Components/Form/DangerButton";
import InputError from "@/Components/Form/InputError";
import InputLabel from "@/Components/Form/InputLabel";
import TextInput from "@/Components/Form/TextInput";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/Form/SecondaryButton";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useRef, useState } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";

export default function DeleteUserForm({
    className = "",
}: {
    className?: string;
}) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: "",
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route("profile.destroy"), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <div className={className}>
            <p className="text-onSurface/70 mb-6">
                Once your account is deleted, all of its resources and data will
                be permanently deleted. Before deleting your account, please
                download any data or information that you wish to retain.
            </p>

            <DangerButton onClick={confirmUserDeletion} className="px-6 py-3">
                Delete Account
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-onSurface">
                            Delete Account
                        </h2>
                        <button
                            onClick={closeModal}
                            className="text-onSurface/70 hover:text-onSurface transition-colors"
                        >
                            <FiX size={24} />
                        </button>
                    </div>

                    <div className="flex items-start mb-6">
                        <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            <FiAlertTriangle className="text-error" />
                        </div>
                        <p className="text-onSurface/70">
                            Once your account is deleted, all of its resources
                            and data will be permanently deleted. Please enter
                            your password to confirm you would like to
                            permanently delete your account.
                        </p>
                    </div>

                    <form onSubmit={deleteUser}>
                        <div className="mb-6">
                            <InputLabel
                                htmlFor="password"
                                value="Password"
                                className="text-onSurface/70 mb-2"
                            />
                            <TextInput
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                className="w-full"
                                placeholder="Enter your password to confirm"
                                error={errors.password}
                            />
                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <SecondaryButton
                                onClick={closeModal}
                                type="button"
                                className="px-6 py-2"
                            >
                                Cancel
                            </SecondaryButton>
                            <DangerButton
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2"
                            >
                                {processing ? "Deleting..." : "Delete Account"}
                            </DangerButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}
