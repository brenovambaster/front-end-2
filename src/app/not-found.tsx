"use client";

import { Button } from "primereact/button";
import { IoArrowForward } from "react-icons/io5"; // Importa um ícone de seta estilizada

const HomePage = () => {
    return (
        <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/404-background.png')" }}>
            <div className="text-center">
                <img
                    src="/404.png"
                    alt="Logo"
                    className="mx-auto mb-4"
                    width="800"
                    height="800"
                />

                <Button
                    type="button"
                    // label="Página Inicial"
                    className="bg-black text-white font-semibold py-3 px-8 rounded-md hover:bg-gray-800 transition duration-300 mx-auto w-80 flex items-center justify-center space-x-2" // Ajuste o padding e a largura
                    onClick={() => window.location.href = "/"}
                >
                    <span>Retornar à Página Inicial</span>
                    <IoArrowForward className="text-white text-lg" /> {/* Ajuste o tamanho do ícone */}
                </Button>
            </div>
        </div>
    );
};

export default HomePage;
