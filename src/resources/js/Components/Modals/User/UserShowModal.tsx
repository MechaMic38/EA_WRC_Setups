import { User } from "@/types";
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";
import { FiX, FiUser, FiShield, FiMail } from "react-icons/fi";
import BaseModal from "../BaseModal";

interface UserShowModalProps {
    isOpen: boolean;
    user: User | null;
    onClose: () => void;
}

export default function UserShowModal({
    isOpen,
    user,
    onClose,
}: UserShowModalProps) {
    if (!user) return null;

    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            <DialogPanel className="bg-surfaceContainer rounded-lg shadow-xl w-full max-w-md transform transition-all">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <DialogTitle className="text-2xl font-bold text-onSurface">
                            User Details
                        </DialogTitle>
                        <button
                            onClick={onClose}
                            className="text-onSurface hover:text-primary"
                        >
                            <FiX size={24} />
                        </button>
                    </div>

                    <div className="space-y-6 mb-6">
                        <div className="flex items-center p-4 bg-surface rounded-lg border border-surfaceContainer">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                                <FiUser className="text-primary text-2xl" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-onSurface">
                                    {user.username}
                                </h3>
                                <p className="text-onSurface/70">
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-surface rounded-lg border border-surfaceContainer p-4">
                                <div className="flex items-center">
                                    <FiMail className="text-onSurface/70 mr-2" />
                                    <span className="text-sm font-medium text-onSurface/70">
                                        Email
                                    </span>
                                </div>
                                <p className="mt-1 text-onSurface truncate">
                                    {user.email}
                                </p>
                            </div>

                            <div className="bg-surface rounded-lg border border-surfaceContainer p-4">
                                <div className="flex items-center">
                                    <FiShield className="text-onSurface/70 mr-2" />
                                    <span className="text-sm font-medium text-onSurface/70">
                                        Role
                                    </span>
                                </div>
                                <div className="mt-1">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            user.role === "admin"
                                                ? "bg-blue-100 text-blue-800"
                                                : "bg-surfaceContainer text-onSurface"
                                        }`}
                                    >
                                        {user.role}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-surfaceContainer">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-onSurface bg-surfaceContainer rounded-md hover:bg-surfaceContainer/80"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </DialogPanel>
        </BaseModal>
    );
}
