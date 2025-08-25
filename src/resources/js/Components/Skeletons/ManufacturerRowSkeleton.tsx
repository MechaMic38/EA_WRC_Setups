import React from "react";

export default function ManufacturerRowSkeleton() {
    return (
        <div className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh animate-pulse">
            <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-surfaceContainerHigh rounded-lg"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-5 w-40 bg-surfaceContainerHigh rounded"></div>
                    <div className="h-4 w-32 bg-surfaceContainerHigh rounded"></div>
                </div>
                <div className="flex space-x-2">
                    <div className="h-8 w-8 bg-surfaceContainerHigh rounded"></div>
                    <div className="h-8 w-8 bg-surfaceContainerHigh rounded"></div>
                    <div className="h-8 w-8 bg-surfaceContainerHigh rounded"></div>
                </div>
            </div>
        </div>
    );
}
