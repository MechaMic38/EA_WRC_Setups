import React from "react";

export default function LocationSetupCardSkeleton() {
    return (
        <div className="bg-surfaceContainer rounded-xl border border-surfaceContainerHigh p-4 animate-pulse">
            <div className="h-48 bg-surfaceContainerHigh rounded-lg mb-4"></div>
            <div className="h-6 w-3/4 bg-surfaceContainerHigh rounded mb-3"></div>
            <div className="h-4 w-full bg-surfaceContainerHigh rounded mb-2"></div>
            <div className="h-4 w-2/3 bg-surfaceContainerHigh rounded mb-4"></div>
            <div className="h-10 bg-surfaceContainerHigh rounded-lg"></div>
        </div>
    );
}
