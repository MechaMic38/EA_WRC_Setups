import { PaginatedData, PaginationLinks, PaginationMeta } from "@/types";
import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface PaginationProps {
    meta: PaginationMeta;
    links: PaginationLinks;
    onPageChange: (url: string) => void;
}

export default function Pagination({
    meta,
    links,
    onPageChange,
}: PaginationProps) {
    return (
        <div className="bg-surfaceContainer rounded-xl p-6 mt-6 border border-surfaceContainerHigh">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-onSurface">
                    Showing <span className="font-medium">{meta.from}</span> to{" "}
                    <span className="font-medium">{meta.to}</span> of{" "}
                    <span className="font-medium">{meta.total}</span> results
                </div>
                <nav className="flex items-center space-x-2">
                    {links.prev && (
                        <button
                            onClick={() => onPageChange(links.prev!)}
                            className="p-2 bg-surface rounded-lg border border-surfaceContainerHigh hover:border-primary/30 transition-colors duration-200"
                        >
                            <FiChevronLeft className="h-5 w-5" />
                        </button>
                    )}

                    {meta.links?.slice(1, -1).map((link, index) => (
                        <button
                            key={index}
                            onClick={() => link.url && onPageChange(link.url)}
                            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors duration-200 ${
                                link.active
                                    ? "bg-primary border-primary text-surfaceContainer"
                                    : "bg-surface border-surfaceContainerHigh text-onSurface hover:border-primary/30"
                            }`}
                            dangerouslySetInnerHTML={{
                                __html: link.label,
                            }}
                        />
                    ))}

                    {links.next && (
                        <button
                            onClick={() => onPageChange(links.next!)}
                            className="p-2 bg-surface rounded-lg border border-surfaceContainerHigh hover:border-primary/30 transition-colors duration-200"
                        >
                            <FiChevronRight className="h-5 w-5" />
                        </button>
                    )}
                </nav>
            </div>
        </div>
    );
}
