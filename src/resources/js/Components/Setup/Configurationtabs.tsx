import { SetupSection } from "@/types";
import React from "react";

interface Tab {
    id: SetupSection;
    icon: JSX.Element;
    label: string;
}

interface ConfigurationTabsProps {
    tabs: Tab[];
    activeTab: SetupSection;
    onChangeTab: (tab: SetupSection) => void;
}

export default function Configurationtabs({
    tabs,
    activeTab,
    onChangeTab,
}: ConfigurationTabsProps) {
    return (
        <div className="bg-surfaceContainer rounded-xl border border-surfaceContainerHigh overflow-hidden mb-6">
            <nav className="flex overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onChangeTab(tab.id)}
                        className={`px-6 py-4 font-medium text-sm flex items-center whitespace-nowrap transition-colors duration-200 ${
                            activeTab === tab.id
                                ? "bg-primary text-surfaceContainer"
                                : "text-onSurface hover:bg-surfaceContainerHigh"
                        }`}
                    >
                        <span className="text-lg mr-3">{tab.icon}</span>
                        <span>{tab.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
}
