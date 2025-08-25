import React, { FormEventHandler } from "react";
import BaseModal from "./BaseModal";
import { Description, DialogPanel, DialogTitle } from "@headlessui/react";
import { FiAlertCircle, FiAlertTriangle, FiX } from "react-icons/fi";
import InputLabel from "../Form/InputLabel";
import TextInput from "../Form/TextInput";
import InputError from "../Form/InputError";
import SecondaryButton from "../Form/SecondaryButton";
import DangerButton from "../Form/DangerButton";
import { useForm } from "@inertiajs/react";

interface ProfileDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProfileDeleteModal({
    isOpen,
    onClose,
}: ProfileDeleteModalProps) {
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

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route("profile.destroy"), {
            preserveScroll: true,
            onSuccess: () => handleClose(),
            onFinish: () => reset(),
        });
    };

    const handleClose = () => {
        onClose();
        clearErrors();
        reset();
    };

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose}>
            <DialogPanel className="bg-surfaceContainer rounded-xl shadow-2xl w-full max-w-md transform transition-all overflow-hidden">
                <div className="flex flex-col">
                    {/* Header Section */}
                    <div className="p-6 bg-gradient-to-r from-red-500/10 to-red-500/5 flex justify-between items-center border-b border-red-500/20">
                        <div className="flex items-center">
                            <div className="bg-red-500/20 p-3 rounded-lg mr-4">
                                <FiAlertTriangle className="text-red-500 text-xl" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold text-onSurface">
                                    Delete Account
                                </DialogTitle>
                                <p className="text-onSurface/70 text-sm">
                                    Confirm permanent deletion
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-onSurface hover:text-red-500 transition-colors duration-200 p-1 rounded-full hover:bg-surfaceContainerHigh"
                        >
                            <FiX size={24} />
                        </button>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 space-y-6">
                        {/* Warning Icon */}
                        <div className="flex justify-center">
                            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center border-4 border-red-500/20">
                                <FiAlertTriangle className="text-red-500 text-3xl" />
                            </div>
                        </div>

                        {/* Warning Text */}
                        <div className="text-center">
                            <Description className="text-lg font-semibold text-onSurface mb-3">
                                Are you sure you want to delete your account?
                            </Description>

                            <p className="text-onSurface/70 mb-4">
                                This action cannot be undone. All data
                                associated with this account will be permanently
                                removed.
                            </p>
                        </div>

                        {/* Additional Warning */}
                        <div className="p-4 bg-red-500/5 rounded-xl border border-red-500/20">
                            <div className="flex items-start">
                                <FiAlertCircle className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-onSurface/80">
                                    <strong>Warning:</strong> once your account
                                    is deleted, all of its resources and data
                                    will be permanently deleted. Please enter
                                    your password to confirm you would like to
                                    permanently delete your account.
                                </p>
                            </div>
                        </div>

                        {/* Password form */}
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

                            {/* Footer Section */}
                            <div className="flex justify-end gap-4">
                                <SecondaryButton
                                    onClick={handleClose}
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
                                    {processing
                                        ? "Deleting..."
                                        : "Delete Account"}
                                </DangerButton>
                            </div>
                        </form>
                    </div>
                </div>
            </DialogPanel>
        </BaseModal>
    );
}
