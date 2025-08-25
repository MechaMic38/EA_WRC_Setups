import React from "react";

export default function VehicleSetupCardSkeleton() {
    return (
        <div className="bg-surfaceContainer rounded-xl border border-surfaceContainerHigh overflow-hidden animate-pulse">
            <div className="h-48 bg-surfaceContainerHigh"></div>
            <div className="p-6">
                <div className="flex items-center mb-4">
                    <div className="h-10 w-10 bg-surfaceContainerHigh rounded-full mr-3"></div>
                    <div className="flex-1">
                        <div className="h-5 w-3/4 bg-surfaceContainerHigh rounded mb-2"></div>
                        <div className="h-4 w-1/2 bg-surfaceContainerHigh rounded"></div>
                    </div>
                </div>
                <div className="h-10 bg-surfaceContainerHigh rounded-lg"></div>
            </div>
        </div>
    );
}
