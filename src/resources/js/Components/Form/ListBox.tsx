import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
    Transition,
} from "@headlessui/react";
import React, { Fragment } from "react";
import { FiChevronRight } from "react-icons/fi";

interface Option {
    id: string;
    name: string;
    imgPath: string;
}

interface ListBoxProps {
    options: Option[];
    selectedOption: Option | null;
    placeholder?: string;
    error?: string | null;
    onChange: (option: Option | null) => void;
}

export default function ListBox({
    options,
    selectedOption,
    placeholder = "Select an option",
    error = null,
    onChange,
}: ListBoxProps) {
    return (
        <Listbox value={selectedOption} onChange={onChange}>
            <div className="relative">
                <ListboxButton
                    className={`w-full px-4 py-2 text-left bg-surface rounded-md border focus:outline-none focus:ring-2 focus:ring-primary hover:border-primary flex items-center justify-between ${
                        error
                            ? "border-error focus:ring-error"
                            : "border-outline hover:border-outline"
                    }`}
                >
                    {selectedOption ? (
                        <div className="flex items-center gap-2">
                            <img
                                src={selectedOption.imgPath}
                                alt={selectedOption.name}
                                className="h-5 w-5 object-contain"
                            />
                            <span>{selectedOption.name}</span>
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
                                key={option.id}
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
                                        <img
                                            src={option.imgPath}
                                            alt={option.name}
                                            className="h-5 w-5 object-contain"
                                        />
                                        <span
                                            className={`block truncate ${
                                                selected ? "font-semibold" : ""
                                            }`}
                                        >
                                            {option.name}
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
