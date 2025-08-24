import InputError from "@/Components/Form/InputError";
import TextInput from "@/Components/Form/TextInput";
import InputLabel from "@/Components/Form/InputLabel";
import PrimaryButton from "@/Components/Form/PrimaryButton";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("password.confirm"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Confirm Password" />

            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                This is a secure area of the application. Please confirm your
                password before continuing.
            </div>

            <form onSubmit={submit}>
                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        onChange={(e) => setData("password", e.target.value)}
                        error={errors.password}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <PrimaryButton className="ms-4" disabled={processing}>
                        Confirm
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
