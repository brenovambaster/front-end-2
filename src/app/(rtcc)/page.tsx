"use client";

import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { useState } from "react";

const HomePage = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && searchQuery.trim()) {
            const formattedQuery = encodeURIComponent(searchQuery.trim().replace(/\s+/g, "+"));
            router.push(`/search?query=${decodeURIComponent(formattedQuery)}`);
        }
    };

    return (
        <div className="flex flex-col items-center w-full ">
            <div className="text-center mb-6 mt-8">
                <img
                    src="/nova-logo-rtcc-if-logo.png"
                    alt="Logo"
                    className="w-30 mx-auto"
                    width="300"
                    height="300"
                />
            </div>
            <div className="relative w-full max-w-4xl mx-4 md:mx-0 ">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center text-gray-500">
                    <i className="pi pi-search" style={{ fontSize: "1.25rem" }}></i>
                </div>
                <input
                    className="flex h-12 border-2 border-gray-300 px-4 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-full bg-background pl-14 pr-5 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary "
                    placeholder="Pesquisar monografias..."
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                />
            </div>
        </div>
    );
};

export default HomePage;
