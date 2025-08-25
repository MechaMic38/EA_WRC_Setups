import React from "react";

export default function LocationCardSkeleton() {
    return (
        <div className="bg-surfaceContainer rounded-xl border border-surfaceContainerHigh overflow-hidden animate-pulse">
            <div className="h-32 bg-surfaceContainerHigh"></div>
            <div className="p-4">
                <div className="flex items-center mb-3">
                    <div className="h-10 w-10 bg-surfaceContainerHigh rounded-full mr-3"></div>
                    <div className="h-5 w-3/4 bg-surfaceContainerHigh rounded"></div>
                </div>
                <div className="h-4 w-full bg-surfaceContainerHigh rounded mb-2"></div>
                <div className="h-4 w-2/3 bg-surfaceContainerHigh rounded"></div>
            </div>
        </div>
    );
}
