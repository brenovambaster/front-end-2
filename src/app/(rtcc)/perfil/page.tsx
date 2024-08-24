'use client';

import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'tailwindcss/tailwind.css';
import { Button } from 'primereact/button';
import { IoArrowForward, IoHeart, IoStar } from 'react-icons/io5';

const UserProfile = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="relative">
            <div
                className="h-56 bg-cover bg-center"
                style={{
                    backgroundImage: `url('cover.jpg')`,
                    backgroundSize: '100% 100%',
                }}
            >
            </div>

            <div className="absolute top-36 left-1/2 transform -translate-x-1/2 w-11/12 flex justify-center gap-8">

                <div
                    style={{ boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.25)' }}
                    className="w-1/5 bg-white rounded-lg p-4 border border-2 border-gray-400"
                >
                    <div className="text-center">
                        <img
                            src="/profile.png"
                            alt="User Profile"
                            className="rounded-full mx-auto"
                            width="200"
                            height="200"
                        />
                        <h2 className="mt-4 text-xl font-semibold">Cirilo Netflixo da Silva</h2>
                        <p className="text-gray-600">Acadêmico</p>
                    </div>
                    <div className="mt-6 grid gap-4">
                        <Button
                            type="button"
                            className="group border border-red-500 text-red-500 font-semibold py-3 px-4 rounded-md hover:bg-red-500 hover:text-white transition duration-300 flex items-center justify-center space-x-2"
                        >
                            <IoHeart className="text-red-500 group-hover:text-white text-lg transition duration-300" />
                            <span className="text-lg font-bold">32</span>
                            <span>Curtidos</span>
                        </Button>
                        <Button
                            type="button"
                            className="group border border-yellow-300 text-yellow-300 font-semibold py-3 px-4 rounded-md hover:bg-yellow-300 hover:text-white transition duration-300 flex items-center justify-center space-x-2"
                        >
                            <IoStar className="text-yellow-300 group-hover:text-white text-lg transition duration-300" />
                            <span className="text-lg font-bold">62</span>
                            <span>Favoritos</span>
                        </Button>
                    </div>
                </div>

                <div
                    className="w-3/6 bg-white rounded-lg p-6 border border-2 border-gray-400"
                    style={{ boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.25)', height: '470px' }}
                >
                    <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                        <TabPanel
                            header={
                                <span
                                    className={`text-base px-4 py-2 cursor-pointer ${activeIndex === 0
                                        ? 'text-black border-b-2 border-black'
                                        : 'text-black'
                                        }`}
                                >
                                    Detalhes da Conta
                                </span>
                            }
                        >
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block font-medium">Nome</label>
                                    <input
                                        type="text"
                                        value="Cirilo Netflixo da Silva"
                                        className="w-full mt-2 p-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium">E-mail</label>
                                    <input
                                        type="text"
                                        value="mail@aluno.ifnmg.edu.br"
                                        className="w-full mt-2 p-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium">Curso</label>
                                    <input
                                        type="text"
                                        value="+1800-000"
                                        className="w-full mt-2 p-2 border rounded-lg"
                                    />
                                </div>
                            </div>
                            <button className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-lg">
                                Update
                            </button>
                        </TabPanel>

                        <TabPanel
                            header={
                                <span
                                    className={`text-base px-4 py-2 cursor-pointer ${activeIndex === 1
                                        ? 'text-black border-b-2 border-black'
                                        : 'text-black'
                                        }`}
                                >
                                    Alterar Senha
                                </span>
                            }
                        >
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block font-medium">Senha Atual</label>
                                    <input
                                        type="password"
                                        placeholder="Digite a senha atual"
                                        className="w-full mt-2 p-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium">Nova Senha</label>
                                    <input
                                        type="password"
                                        placeholder="Digite a nova senha"
                                        className="w-full mt-2 p-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium">Confirmar Nova Senha</label>
                                    <input
                                        type="password"
                                        placeholder="Confirme a nova senha"
                                        className="w-full mt-2 p-2 border rounded-lg"
                                    />
                                </div>
                            </div>
                            <button className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-lg">
                                Salvar
                            </button>
                        </TabPanel>
                    </TabView>
                </div>


            </div>

        </div>
    );
};

export default UserProfile;
