import { SEASONS_MAP, TYRES_MAP } from "@/constants";
import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
    Transition,
} from "@headlessui/react";
import React, { Fragment } from "react";
import { FiChevronRight } from "react-icons/fi";

interface TyresListboxProps {
    options: string[];
    selectedOption: string | null;
    placeholder?: string;
    error?: string | null;
    onChange: (option: string | null) => void;
}

export default function TyresListbox({
    options,
    selectedOption,
    placeholder = "Select a tyre",
    error = null,
    onChange,
}: TyresListboxProps) {
    return (
        <Listbox value={selectedOption} onChange={onChange}>
            <div className="relative">
                <ListboxButton
                    className={`w-full px-4 py-2 bg-surfaceContainer rounded-lg border focus:border-primary focus:ring-1 focus:ring-primary text-onSurface flex items-center justify-between ${
                        error ? "border-error" : "border-surfaceContainerHigh"
                    }`}
                >
                    {selectedOption ? (
                        <div className="flex items-center gap-2">
                            <span>
                                {
                                    TYRES_MAP[
                                        selectedOption as keyof typeof TYRES_MAP
                                    ]?.text
                                }
                            </span>
                        </div>
                    ) : (
                        <span>{placeholder}</span>
                    )}
                    <FiChevronRight className="w-4 h-4 text-onSurface" />
                </ListboxButton>

                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <ListboxOptions className="absolute z-20 mt-1 w-full bg-surfaceContainerHigh rounded-md shadow-lg max-h-60 py-1 text-base overflow-auto focus:outline-none">
                        <ListboxOption
                            key="all"
                            value={null}
                            className={({ active }) =>
                                `cursor-pointer select-none relative py-2 pl-4 pr-10 ${
                                    active ? "bg-surfaceContainerHighest" : ""
                                }`
                            }
                        >
                            {({ selected }) => (
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`block truncate ${
                                            selected ? "font-semibold" : ""
                                        }`}
                                    >
                                        {placeholder}
                                    </span>
                                </div>
                            )}
                        </ListboxOption>
                        {options.map((option) => (
                            <ListboxOption
                                key={option}
                                value={option}
                                className={({ active }) =>
                                    `cursor-pointer select-none relative py-2 pl-4 pr-10 ${
                                        active
                                            ? "bg-surfaceContainerHighest"
                                            : ""
                                    }`
                                }
                            >
                                {({ selected }) => (
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`block truncate ${
                                                selected ? "font-semibold" : ""
                                            }`}
                                        >
                                            {
                                                TYRES_MAP[
                                                    option as keyof typeof TYRES_MAP
                                                ]?.text
                                            }
                                        </span>
                                    </div>
                                )}
                            </ListboxOption>
                        ))}
                    </ListboxOptions>
                </Transition>
            </div>
        </Listbox>
    );
}
