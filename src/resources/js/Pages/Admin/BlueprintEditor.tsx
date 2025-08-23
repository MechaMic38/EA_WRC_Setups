import { Head, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { useEffect, useState } from "react";
import {
    FiSave,
    FiSliders,
    FiInfo,
    FiCheck,
    FiX,
    FiArrowLeft,
} from "react-icons/fi";
import {
    Vehicle,
    SetupBlueprint,
    SetupSection,
    SetupOptions,
    BlueprintRule,
} from "@/types";

interface BlueprintEditorProps {
    vehicle: Vehicle;
}

type SetupBlueprintFormData = {
    [category in SetupSection]: Record<string, BlueprintRule>;
};

export default function BlueprintEditor({ vehicle }: BlueprintEditorProps) {
    const { get: getBlueprint, isProcessing: isProcessingBlueprint } =
        useAxiosForm<SetupBlueprint>([]);
    const {
        data,
        setData,
        post: updateBlueprint,
        isProcessing,
        errors,
    } = useAxiosForm<SetupBlueprint, SetupBlueprintFormData>({
        alignment: {},
        braking: {},
        differentials: {},
        gears: {},
        damping: {},
        springs: {},
    });

    const [blueprint, setBlueprint] = useState<SetupOptions>({
        alignment: {},
        braking: {},
        differentials: {},
        gears: {},
        damping: {},
        springs: {},
    });
    const [activeTab, setActiveTab] = useState<SetupSection>("alignment");
    const [showDescription, setShowDescription] = useState<string | null>(null);
    const [isModified, setIsModified] = useState(false);

    // Fetch vehicle blueprint
    useEffect(() => {
        getBlueprint(route("api.vehicles.blueprint.show", vehicle.id), {
            onSuccess: (response) => {
                setBlueprint(response.data);
                setData(response.data);
            },
        });
    }, [vehicle.id]);

    // Track modifications
    useEffect(() => {
        const original = JSON.stringify(data);
        const current = JSON.stringify(blueprint);
        setIsModified(original !== current);
    }, [data]);

    // Handle input changes
    const handleValueChange = (
        section: SetupSection,
        setting: string,
        field: "min_value" | "max_value" | "default_value",
        value: string
    ) => {
        const numericValue = parseFloat(value);

        setData((prev) => {
            const sectionData = { ...prev[section] };
            const settingData = { ...sectionData[setting] };

            // Validate min/max relationships
            if (field === "min_value" && numericValue > settingData.max_value) {
                settingData.max_value = numericValue;
            }
            if (field === "max_value" && numericValue < settingData.min_value) {
                settingData.min_value = numericValue;
            }
            if (field === "default_value") {
                if (numericValue < settingData.min_value) {
                    settingData.min_value = numericValue;
                }
                if (numericValue > settingData.max_value) {
                    settingData.max_value = numericValue;
                }
            }

            settingData[field] = numericValue;
            sectionData[setting] = settingData;

            return {
                ...prev,
                [section]: sectionData,
            };
        });
    };

    // Submit the updated blueprint
    const submitBlueprint = () => {
        updateBlueprint(
            route("api.vehicles.blueprint.update", { vehicle: vehicle.id }),
            {
                onSuccess: () => {
                    setIsModified(false);
                    // Show success message
                },
            }
        );
    };

    // Render input for a blueprint field
    const renderBlueprintField = (
        section: SetupSection,
        setting: string,
        option: any,
        field: "min_value" | "max_value" | "default_value"
    ) => {
        const value = data[section]?.[setting]?.[field] || option[field];
        const label = field
            .replace("_", " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());

        return (
            <div key={`${setting}-${field}`} className="mb-4">
                <label className="block text-sm font-medium text-onSurface mb-1">
                    {label}
                </label>
                <div className="relative">
                    <input
                        type="number"
                        value={value}
                        onChange={(e) =>
                            handleValueChange(
                                section,
                                setting,
                                field,
                                e.target.value
                            )
                        }
                        step={
                            field === "default_value"
                                ? (option.max_value - option.min_value) /
                                      (option.steps - 1) || 0.01
                                : 0.01
                        }
                        className="w-full px-3 py-2 border border-surfaceContainer rounded-md bg-surface text-onSurface"
                    />
                    <span className="absolute right-3 top-2 text-onSurface/70">
                        {option.unit}
                    </span>
                </div>
            </div>
        );
    };

    // Render configuration option
    const renderBlueprintOption = (
        section: SetupSection,
        setting: string,
        option: any
    ) => {
        return (
            <div
                key={setting}
                className="bg-surfaceContainer rounded-lg p-5 mb-6"
            >
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-bold text-onSurface text-lg">
                            {option.label}
                        </h3>
                        <p className="text-sm text-onSurface/70">
                            ID: {setting}
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            setShowDescription(
                                showDescription === setting ? null : setting
                            )
                        }
                        className="p-2 text-primary hover:bg-surfaceContainer/50 rounded-full"
                        title="Show description"
                    >
                        <FiInfo size={20} />
                    </button>
                </div>

                {showDescription === setting && (
                    <div className="bg-surfaceContainer/50 p-3 rounded-lg mb-4 text-sm text-onSurface">
                        {option.description}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {renderBlueprintField(
                        section,
                        setting,
                        option,
                        "min_value"
                    )}
                    {renderBlueprintField(
                        section,
                        setting,
                        option,
                        "max_value"
                    )}
                    {renderBlueprintField(
                        section,
                        setting,
                        option,
                        "default_value"
                    )}
                </div>

                <div className="mt-4 pt-4 border-t border-surfaceContainer/30 flex justify-between">
                    <div className="text-sm text-onSurface/70">
                        <span className="block">Steps: {option.steps}</span>
                        <span className="block">
                            Precision: {option.precision}
                        </span>
                    </div>
                    <button
                        onClick={() => {
                            // Reset this setting to original values
                            setData((prev) => ({
                                ...prev,
                                [section]: {
                                    ...prev[section],
                                    [setting]: {
                                        ...option,
                                    },
                                },
                            }));
                        }}
                        className="text-sm text-primary hover:text-primary-600"
                    >
                        Reset Option
                    </button>
                </div>
            </div>
        );
    };

    // Configuration tabs
    const configurationTabs: {
        id: SetupSection;
        icon: JSX.Element;
        label: string;
    }[] = [
        { id: "alignment", icon: <FiSliders />, label: "Alignment" },
        { id: "braking", icon: <FiSliders />, label: "Braking" },
        { id: "differentials", icon: <FiSliders />, label: "Differentials" },
        { id: "gears", icon: <FiSliders />, label: "Gears" },
        { id: "damping", icon: <FiSliders />, label: "Damping" },
        { id: "springs", icon: <FiSliders />, label: "Springs" },
    ];

    return (
        <AdminLayout>
            <Head title={`Blueprint Editor - ${vehicle.name}`} />

            {/* Header */}
            <div className="bg-surfaceContainer py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <button
                                onClick={() =>
                                    router.visit(route("admin.vehicles.index"))
                                }
                                className="inline-flex items-center text-primary hover:text-primary-600 mb-2"
                            >
                                <FiArrowLeft className="mr-1" /> Back to
                                Vehicles
                            </button>
                            <h1 className="text-2xl font-bold text-onSurface">
                                Setup Blueprint Editor
                            </h1>
                            <div className="flex items-center mt-2">
                                <img
                                    src={vehicle.imgPath}
                                    alt={vehicle.name}
                                    className="w-12 h-12 object-contain mr-3"
                                />
                                <div>
                                    <p className="text-onSurface font-medium">
                                        {vehicle.name}
                                    </p>
                                    <p className="text-sm text-onSurface/70">
                                        {vehicle.manufacturer.name} •{" "}
                                        {vehicle.category.name}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    // Reset all to original values
                                    getBlueprint(
                                        route(
                                            "api.vehicles.blueprint.show",
                                            vehicle.id
                                        ),
                                        {
                                            onSuccess: (response) => {
                                                setData(response.data);
                                            },
                                        }
                                    );
                                }}
                                className="px-4 py-2 bg-surface text-primary border border-primary rounded-md hover:bg-surfaceContainer flex items-center"
                                disabled={!isModified}
                            >
                                <FiX className="mr-2" /> Reset All
                            </button>
                            <button
                                onClick={submitBlueprint}
                                disabled={isProcessing || !isModified}
                                className={`px-4 py-2 flex items-center ${
                                    isProcessing || !isModified
                                        ? "bg-surfaceContainer text-onSurface/50"
                                        : "bg-primary text-surfaceContainer hover:bg-primary-600"
                                } rounded-md`}
                            >
                                <FiSave className="mr-2" />
                                {isProcessing ? "Saving..." : "Save Blueprint"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="py-8 bg-surface">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Navigation Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-surfaceContainer rounded-lg overflow-hidden mb-6">
                                <nav className="flex flex-col">
                                    {configurationTabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`px-4 py-3 font-medium text-sm flex items-center ${
                                                activeTab === tab.id
                                                    ? "bg-primary text-surfaceContainer"
                                                    : "text-onSurface hover:bg-surfaceContainer/50"
                                            }`}
                                        >
                                            {tab.icon}
                                            <span className="ml-2">
                                                {tab.label}
                                            </span>
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {/* Information Panel */}
                            <div className="bg-surfaceContainer rounded-lg p-6">
                                <h3 className="text-lg font-bold text-onSurface mb-4">
                                    Blueprint Guidelines
                                </h3>
                                <ul className="space-y-3 text-sm text-onSurface/80">
                                    <li className="flex items-start">
                                        <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                                        <span>
                                            Adjust min, max, and default values
                                            only
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                                        <span>
                                            Min must be less than or equal to
                                            max
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                                        <span>
                                            Default must be between min and max
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                                        <span>
                                            Changes affect all future setups for
                                            this vehicle
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                                        <span>
                                            Existing setups won't be modified
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Blueprint Editor */}
                        <div className="lg:col-span-3">
                            <div className="bg-surfaceContainer rounded-lg p-6 mb-6">
                                <h2 className="text-xl font-bold text-onSurface capitalize mb-6">
                                    {activeTab.replace("_", " ")} Settings
                                </h2>

                                {isProcessingBlueprint ? (
                                    <div className="animate-pulse space-y-8">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="space-y-6">
                                                <div className="h-6 bg-surfaceContainer/50 rounded w-1/2"></div>
                                                <div className="grid grid-cols-3 gap-4">
                                                    {[...Array(3)].map(
                                                        (_, j) => (
                                                            <div
                                                                key={j}
                                                                className="space-y-2"
                                                            >
                                                                <div className="h-4 bg-surfaceContainer/50 rounded w-1/3"></div>
                                                                <div className="h-10 bg-surfaceContainer/50 rounded"></div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : data[activeTab] &&
                                  Object.keys(data[activeTab]).length > 0 ? (
                                    Object.entries(data[activeTab]).map(
                                        ([setting, option]) =>
                                            renderBlueprintOption(
                                                activeTab,
                                                setting,
                                                option
                                            )
                                    )
                                ) : (
                                    <div className="text-center py-10">
                                        <div className="bg-surfaceContainer/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                            <FiSliders className="text-onSurface/50 text-2xl" />
                                        </div>
                                        <h3 className="text-lg font-medium text-onSurface mb-2">
                                            No {activeTab.replace("_", " ")}{" "}
                                            settings available
                                        </h3>
                                        <p className="text-onSurface/70">
                                            This vehicle doesn't have any{" "}
                                            {activeTab.replace("_", " ")}{" "}
                                            settings in its blueprint.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {errors && (
                <div className="fixed bottom-4 right-4 max-w-md bg-red-500/90 text-white p-4 rounded-lg shadow-lg z-50">
                    <div className="font-bold mb-2">Validation Errors</div>
                    <ul className="list-disc pl-5">
                        {Object.entries(errors).map(([field, error], i) => (
                            <li key={i}>
                                <span className="font-medium">{field}:</span>{" "}
                                {error}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </AdminLayout>
    );
}
