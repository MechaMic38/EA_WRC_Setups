import { User } from "@/types";
import { DialogPanel, DialogTitle } from "@headlessui/react";
import { FiX, FiUser, FiShield, FiMail } from "react-icons/fi";
import BaseModal from "../BaseModal";
import { USER_ROLES_MAP } from "@/constants";

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

    const getRoleColor = (role: string) => {
        switch (role) {
            case "admin":
                return "bg-red-100 text-red-800 border-red-200";
            case "moderator":
                return "bg-blue-100 text-blue-800 border-blue-200";
            default:
                return "bg-surfaceContainer text-onSurface border-surfaceContainerHigh";
        }
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            <DialogPanel className="bg-surfaceContainer rounded-xl shadow-2xl w-full max-w-md transform transition-all overflow-hidden">
                <div className="flex flex-col">
                    {/* Header Section */}
                    <div className="p-6 bg-gradient-to-r from-surfaceContainerHigh to-surfaceContainer flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="bg-primaryContainer/20 p-3 rounded-lg mr-4">
                                <FiUser className="text-primary text-xl" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold text-onSurface">
                                    User Details
                                </DialogTitle>
                                <p className="text-onSurface/70 text-sm">
                                    View user information
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-onSurface hover:text-primary transition-colors duration-200 p-1 rounded-full hover:bg-surfaceContainerHigh"
                        >
                            <FiX size={24} />
                        </button>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 space-y-6">
                        {/* User Profile Card */}
                        <div className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh transition-all duration-300 hover:border-primary/30">
                            <div className="flex items-center">
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                                    <FiUser className="text-primary text-2xl" />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-xl font-bold text-onSurface">
                                        {user.username}
                                    </h3>
                                    <p className="text-onSurface/70 text-sm">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Email Information */}
                        <div className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh transition-all duration-300 hover:border-primary/30">
                            <div className="flex items-center">
                                <div className="bg-secondaryContainer/20 p-2 rounded-lg mr-4">
                                    <FiMail className="text-secondary text-lg" />
                                </div>
                                <div className="flex-grow">
                                    <p className="text-sm text-onSurface/70 mb-1">
                                        Email Address
                                    </p>
                                    <p className="text-onSurface font-medium">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Role Information */}
                        <div className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh transition-all duration-300 hover:border-primary/30">
                            <div className="flex items-center">
                                <div className="bg-tertiaryContainer/20 p-2 rounded-lg mr-4">
                                    <FiShield className="text-tertiary text-lg" />
                                </div>
                                <div className="flex-grow">
                                    <p className="text-sm text-onSurface/70 mb-1">
                                        User Role
                                    </p>
                                    <span
                                        className={`px-4 py-2 rounded-full text-sm font-medium border ${getRoleColor(
                                            user.role
                                        )}`}
                                    >
                                        {USER_ROLES_MAP[
                                            user.role as keyof typeof USER_ROLES_MAP
                                        ]?.text || user.role}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Section */}
                    <div className="p-6 pt-0">
                        <button
                            onClick={onClose}
                            className="w-full px-6 py-3 text-onSurface bg-surfaceContainer rounded-xl hover:bg-surfaceContainerHigh transition-colors duration-200 font-medium text-center"
                        >
                            Close Details
                        </button>
                    </div>
                </div>
            </DialogPanel>
        </BaseModal>
    );
}
