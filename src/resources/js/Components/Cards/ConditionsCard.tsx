import { SEASONS_MAP, SURFACE_CONDITIONS_MAP, TYRES_MAP } from "@/constants";
import React from "react";
import { FiCalendar, FiCloud, FiSettings } from "react-icons/fi";
import { GiCarWheel } from "react-icons/gi";

interface ConditionsCardProps {
    season: string;
    surfaceCondition: string;
    tyres: string;
}

export default function ConditionsCard({
    season,
    surfaceCondition,
    tyres,
}: ConditionsCardProps) {
    return (
        <div className="bg-surfaceContainer rounded-xl p-6 border border-surfaceContainerHigh">
            <h3 className="text-lg font-bold text-onSurface mb-4 flex items-center">
                <FiSettings className="mr-2 text-primary" />
                Conditions
            </h3>
            <div className="space-y-4">
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center mr-3">
                        <FiCalendar className="text-secondary" />
                    </div>
                    <div>
                        <p className="text-sm text-onSurface/70">Season</p>
                        <p className="text-onSurface font-medium capitalize">
                            {
                                SEASONS_MAP[season as keyof typeof SEASONS_MAP]
                                    .text
                            }
                        </p>
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-tertiary/10 rounded-full flex items-center justify-center mr-3">
                        <FiCloud className="text-tertiary" />
                    </div>
                    <div>
                        <p className="text-sm text-onSurface/70">Surface</p>
                        <p className="text-onSurface font-medium capitalize">
                            {
                                SURFACE_CONDITIONS_MAP[
                                    surfaceCondition as keyof typeof SURFACE_CONDITIONS_MAP
                                ].text
                            }
                        </p>
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                        <GiCarWheel className="text-primary" />
                    </div>
                    <div>
                        <p className="text-sm text-onSurface/70">Tyres</p>
                        <p className="text-onSurface font-medium capitalize">
                            {TYRES_MAP[tyres as keyof typeof TYRES_MAP].text}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
