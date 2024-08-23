"use client";

import { Button } from "primereact/button";

const HomePage = () => {
    return (
        <>
            <div className="text-center mb-4 mt-16">
                <img
                    src="/404.png"
                    alt="Logo"
                    className="w-30 mx-auto"
                    width="800"
                    height="800"
                />

                <Button
                    type="button"
                    label="Página Inicial"
                    className="bg-black text-white font-semibold py-3 px-6 rounded-md hover:bg-gray-800 transition duration-300 w-60 mx-auto mt-8"
                    onClick={() => window.location.href = "/"}
                />
            </div>
        </>
    );
};

export default HomePage;
