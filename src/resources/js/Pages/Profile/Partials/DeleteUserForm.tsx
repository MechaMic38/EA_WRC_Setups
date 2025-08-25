import DangerButton from "@/Components/Form/DangerButton";
import InputError from "@/Components/Form/InputError";
import InputLabel from "@/Components/Form/InputLabel";
import TextInput from "@/Components/Form/TextInput";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/Form/SecondaryButton";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useRef, useState } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import BaseModal from "@/Components/Modals/BaseModal";
import { DialogPanel } from "@headlessui/react";
import ProfileDeleteModal from "@/Components/Modals/ProfileDeleteModal";

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

            <ProfileDeleteModal
                isOpen={confirmingUserDeletion}
                onClose={closeModal}
            />
        </div>
    );
}
