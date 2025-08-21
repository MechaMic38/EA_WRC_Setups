import { useState } from "react";
import { useForm } from "@inertiajs/react";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

type FormDataType = Record<string, any>;

type CallbackHandler<T = any> = (arg: T) => void;

type ValidationErrorResponse<T extends FormDataType> = {
    errors: Record<keyof T, string>;
    message?: string;
}

interface RequestOptions<TResponse, TForm extends FormDataType> extends AxiosRequestConfig {
    onSuccess?: CallbackHandler<AxiosResponse<TResponse>>;
    onError?: CallbackHandler<AxiosError<ValidationErrorResponse<TForm>>>;
    onFinish?: CallbackHandler<void>;
    preserveState?: boolean;
}

export default function useAxiosForm<
    TResponse = unknown,
    TForm extends FormDataType = FormDataType,
>(
    initialData: TForm
) {
    // Form data and error management
    const form = useForm(initialData);

    // States to manage the processing phase
    const [isProcessing, setIsProcessing] = useState(false);
    const [isRecentlySuccessful, setIsRecentlySuccessful] = useState(false);

    // Function to wrap Axios requests
    const wrapRequest = (method: 'get' | 'post' | 'put' | 'patch' | 'delete') => {
        return async (
            url: string,
            {
                onSuccess,
                onError,
                onFinish,
                preserveState = false,
                ...axiosConfig
            }: RequestOptions<TResponse, TForm> = {}
        ) => {
            setIsProcessing(true);
            form.clearErrors();

            axios[method]<TResponse, AxiosResponse<TResponse>, TForm>(
                url,
                form.data,
                axiosConfig
            )
                .then((response) => {
                    setIsRecentlySuccessful(true);
                    setTimeout(() => setIsRecentlySuccessful(false), 2000);
                    onSuccess?.(response);
                })
                .catch((error) => {
                    if (error.response?.status === 422) {
                        const errorData = error.response.data;

                        if (errorData?.errors) {
                            form.setError(errorData.errors);
                        }
                    }
                    onError?.(error);
                })
                .finally(() => {
                    setIsProcessing(false);
                    onFinish?.();
                });
        }
    }

    return {
        ...form,
        isProcessing,
        isRecentlySuccessful,
        get: wrapRequest('get'),
        post: wrapRequest('post'),
        patch: wrapRequest('put'),
        patch: wrapRequest('patch'),
        delete: wrapRequest('delete')
    };
}
