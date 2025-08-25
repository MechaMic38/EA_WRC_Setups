import { USER_ROLES_MAP } from "@/constants";
import { User } from "@/types";
import React from "react";
import { FiEdit, FiEye, FiTrash2 } from "react-icons/fi";

interface UserRowProps {
    user: User;
    onShowUser: (user: UserRowProps["user"]) => void;
    onEditUser: (user: UserRowProps["user"]) => void;
    onDeleteUser: (user: UserRowProps["user"]) => void;
}

export default function UserRow({
    user,
    onShowUser,
    onEditUser,
    onDeleteUser,
}: UserRowProps) {
    const getRoleColor = (role: string) => {
        switch (role) {
            case "admin":
                return "bg-errorContainer text-onErrorContainer";
            default:
                return "bg-surfaceContainer text-onSurfaceContainer";
        }
    };

    return (
        <div className="bg-surface rounded-xl border border-surfaceContainerHigh p-4 hover:border-primary/30 transition-all duration-200">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <img
                        className="h-12 w-12 rounded-full object-cover"
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.username
                        )}&background=CFBDFE&color=211F24`}
                        alt={user.username}
                    />
                    <div>
                        <h3 className="text-lg font-semibold text-onSurface">
                            {user.username}
                        </h3>
                        <p className="text-sm text-onSurface/70 mt-1">
                            {user.email}
                        </p>
                        <div className="flex items-center mt-2">
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(
                                    user.role
                                )}`}
                            >
                                {
                                    USER_ROLES_MAP[
                                        user.role as keyof typeof USER_ROLES_MAP
                                    ].text
                                }
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => onShowUser(user)}
                        className="p-2 bg-surfaceContainer rounded-lg text-onSurface hover:bg-surfaceContainerHigh transition-colors duration-200"
                        title="View details"
                    >
                        <FiEye />
                    </button>
                    <button
                        onClick={() => onEditUser(user)}
                        className="p-2 bg-surfaceContainer rounded-lg text-onSurface hover:bg-surfaceContainerHigh transition-colors duration-200"
                        title="Edit user"
                    >
                        <FiEdit />
                    </button>
                    <button
                        onClick={() => onDeleteUser(user)}
                        className="p-2 bg-surfaceContainer rounded-lg text-red-500 hover:bg-red-500/10 transition-colors duration-200"
                        title="Delete user"
                    >
                        <FiTrash2 />
                    </button>
                </div>
            </div>
        </div>
    );
}
