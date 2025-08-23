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
    FiSettings,
    FiAlertCircle,
    FiRotateCcw,
    FiChevronRight,
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
        clearErrors,
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
    const [saveSuccess, setSaveSuccess] = useState(false);

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
    }, [data, blueprint]);

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
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 3000);
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
                <label className="block text-sm font-medium text-onSurface/70 mb-2">
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
                        className="w-full px-4 py-3 bg-surfaceContainer rounded-lg border border-surfaceContainerHigh focus:border-primary focus:ring-1 focus:ring-primary text-onSurface"
                    />
                    <span className="absolute right-3 top-3 text-onSurface/70 text-sm">
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
                className="bg-surfaceContainer rounded-xl p-6 mb-6 border border-surfaceContainerHigh"
            >
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <h3 className="font-bold text-onSurface text-lg mb-1">
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
                        className="p-2 text-primary hover:bg-surfaceContainerHigh rounded-lg transition-colors duration-200 ml-4"
                        title="Show description"
                    >
                        <FiInfo size={20} />
                    </button>
                </div>

                {showDescription === setting && (
                    <div className="bg-surfaceContainerHigh p-4 rounded-lg mb-4 text-sm text-onSurface">
                        {option.description}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                <div className="mt-6 pt-4 border-t border-surfaceContainerHigh/30 flex justify-between items-center">
                    <div className="text-sm text-onSurface/70">
                        <span className="block">Steps: {option.steps}</span>
                        <span className="block">
                            Precision: {option.precision}
                        </span>
                    </div>
                    <button
                        onClick={() => {
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
                        className="flex items-center text-sm text-primary hover:text-primary-600 transition-colors duration-200"
                    >
                        <FiRotateCcw className="mr-1" />
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
            <div className="bg-surfaceContainer py-8 border-b border-surfaceContainerHigh">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex-1">
                            <button
                                onClick={() =>
                                    router.visit(route("admin.vehicles.index"))
                                }
                                className="inline-flex items-center text-primary hover:text-primary-600 mb-4 transition-colors duration-200"
                            >
                                <FiArrowLeft className="mr-2" />
                                Back to Vehicles
                            </button>
                            <div className="flex items-center gap-4">
                                <div className="bg-primary/10 p-3 rounded-xl">
                                    <FiSettings className="text-primary text-2xl" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-onSurface">
                                        Setup Blueprint Editor
                                    </h1>
                                    <div className="flex items-center mt-2">
                                        <img
                                            src={vehicle.imgPath}
                                            alt={vehicle.name}
                                            className="w-10 h-10 object-contain mr-3 rounded-lg bg-surfaceContainerHigh p-1"
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
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
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
                                className="px-6 py-3 bg-surfaceContainer text-onSurface border border-surfaceContainerHigh rounded-xl hover:bg-surfaceContainerHigh transition-colors duration-200 flex items-center"
                                disabled={!isModified}
                            >
                                <FiX className="mr-2" /> Reset All
                            </button>
                            <button
                                onClick={submitBlueprint}
                                disabled={isProcessing || !isModified}
                                className={`px-6 py-3 flex items-center rounded-xl font-medium transition-colors duration-200 ${
                                    isProcessing || !isModified
                                        ? "bg-surfaceContainer text-onSurface/50 cursor-not-allowed"
                                        : "bg-primary text-surfaceContainer hover:bg-primary-600 shadow-lg hover:shadow-xl transform hover:scale-105"
                                }`}
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
                    {/* Success Message */}
                    {saveSuccess && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-xl mb-6 flex items-center">
                            <FiCheck className="mr-2 text-green-600" />
                            <span>Blueprint saved successfully!</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Navigation Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-surfaceContainer rounded-xl overflow-hidden mb-6 border border-surfaceContainerHigh">
                                <div className="p-4 bg-surfaceContainerHigh">
                                    <h3 className="text-sm font-semibold text-onSurface/70 uppercase tracking-wide">
                                        Configuration Sections
                                    </h3>
                                </div>
                                <nav className="flex flex-col p-2">
                                    {configurationTabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`px-4 py-3 font-medium text-sm flex items-center rounded-lg transition-all duration-200 ${
                                                activeTab === tab.id
                                                    ? "bg-primary text-surfaceContainer shadow-lg"
                                                    : "text-onSurface hover:bg-surfaceContainerHigh"
                                            }`}
                                        >
                                            <div
                                                className={`p-2 rounded-lg mr-3 ${
                                                    activeTab === tab.id
                                                        ? "bg-surfaceContainer/20"
                                                        : "bg-surfaceContainerHigh"
                                                }`}
                                            >
                                                {tab.icon}
                                            </div>
                                            <span className="flex-1 text-left">
                                                {tab.label}
                                            </span>
                                            {activeTab === tab.id && (
                                                <FiChevronRight className="ml-2" />
                                            )}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {/* Information Panel */}
                            <div className="bg-surfaceContainer rounded-xl p-6 border border-surfaceContainerHigh">
                                <div className="flex items-center mb-4">
                                    <div className="bg-primary/10 p-2 rounded-lg mr-3">
                                        <FiInfo className="text-primary text-lg" />
                                    </div>
                                    <h3 className="text-lg font-bold text-onSurface">
                                        Blueprint Guidelines
                                    </h3>
                                </div>
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
                            <div className="bg-surfaceContainer rounded-xl p-6 mb-6 border border-surfaceContainerHigh">
                                <div className="flex items-center mb-6">
                                    <div className="bg-primary/10 p-2 rounded-lg mr-3">
                                        <FiSliders className="text-primary text-lg" />
                                    </div>
                                    <h2 className="text-xl font-bold text-onSurface capitalize">
                                        {activeTab.replace("_", " ")} Settings
                                    </h2>
                                </div>

                                {isProcessingBlueprint ? (
                                    <div className="animate-pulse space-y-8">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="space-y-6">
                                                <div className="h-6 bg-surfaceContainerHigh rounded w-1/2"></div>
                                                <div className="grid grid-cols-3 gap-4">
                                                    {[...Array(3)].map(
                                                        (_, j) => (
                                                            <div
                                                                key={j}
                                                                className="space-y-2"
                                                            >
                                                                <div className="h-4 bg-surfaceContainerHigh rounded w-1/3"></div>
                                                                <div className="h-12 bg-surfaceContainerHigh rounded"></div>
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
                                    <div className="text-center py-12">
                                        <div className="bg-surfaceContainerHigh rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                            <FiSliders className="text-onSurface/50 text-2xl" />
                                        </div>
                                        <h3 className="text-lg font-medium text-onSurface mb-2">
                                            No {activeTab.replace("_", " ")}{" "}
                                            settings available
                                        </h3>
                                        <p className="text-onSurface/70 mb-4">
                                            This vehicle doesn't have any{" "}
                                            {activeTab.replace("_", " ")}{" "}
                                            settings in its blueprint.
                                        </p>
                                        <button
                                            onClick={() =>
                                                setActiveTab("alignment")
                                            }
                                            className="text-primary hover:text-primary-600 text-sm"
                                        >
                                            Check other sections
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Notification */}
            {errors && Object.keys(errors).length > 0 && (
                <div className="fixed bottom-6 right-6 max-w-md bg-red-500/95 text-white p-4 rounded-xl shadow-2xl z-50 border border-red-400">
                    <div className="flex items-start">
                        <FiAlertCircle className="text-xl mr-3 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <div className="font-bold mb-2">
                                Validation Errors
                            </div>
                            <ul className="list-disc pl-5 space-y-1">
                                {Object.entries(errors).map(
                                    ([field, error], i) => (
                                        <li key={i} className="text-sm">
                                            <span className="font-medium">
                                                {field}:
                                            </span>{" "}
                                            {error}
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                        <button
                            onClick={() => clearErrors()}
                            className="ml-4 text-white/80 hover:text-white"
                        >
                            <FiX size={18} />
                        </button>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
