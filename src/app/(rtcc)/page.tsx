"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import graduation_cap_image from "../../../public/rtcc-if-logo.png";
import { api } from "@/service/api";
import { Button } from "primereact/button";

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
        <div className="flex flex-col items-center w-full">
            <header className="py-4 w-full flex justify-center">
                <Image alt="logo" src={graduation_cap_image} height={200} width={200} />
            </header>
            <div className="relative w-full max-w-4xl mx-4 md:mx-0 mt-4">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center text-gray-500">
                    <i className="pi pi-search" style={{ fontSize: "1.25rem" }}></i>
                </div>
                <input
                    className="flex h-10 border-2 border-gray-300 px-3 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-md bg-background pl-12 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Pesquisar monografias..."
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                />
            </div>
            <Button onClick={() => {api.get("/tcc")}}>AAA</Button>
        </div>
    );
};

export default HomePage;
