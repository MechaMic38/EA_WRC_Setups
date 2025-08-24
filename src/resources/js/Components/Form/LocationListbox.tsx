import { LocationSummary } from "@/types";
import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
    Transition,
} from "@headlessui/react";
import React, { Fragment } from "react";
import { FiChevronRight } from "react-icons/fi";

interface LocationListboxProps {
    options: LocationSummary[];
    selectedOption: LocationSummary | null;
    placeholder?: string;
    error?: string | null;
    onChange: (option: LocationSummary | null) => void;
}

export default function LocationListbox({
    options,
    selectedOption,
    placeholder = "Select a vehicle",
    error = null,
    onChange,
}: LocationListboxProps) {
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
                            <img
                                src={selectedOption.imgBannerPath}
                                alt={selectedOption.name}
                                className="h-5 w-5 object-contain"
                            />
                            <span className="truncate">
                                {selectedOption.name}
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
                                            src={option.imgBannerPath}
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
