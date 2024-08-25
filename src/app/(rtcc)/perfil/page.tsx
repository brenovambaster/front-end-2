'use client';
import Image from 'next/image';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { TabPanel, TabView } from 'primereact/tabview';
import { use, useEffect, useState } from 'react';
import { UserResponseDTO } from '@/types';
import { UserService } from '@/service/userService';

const tccs = [
    { id: 1, title: "Inteligência Artificial na Medicina", description: "James Thompson Dijkstra", tags: ["IA", "Medicina", "Bioinformática", "Medicina", "Medicina", "Medicina", "Medicina", "Medicina"] },
    { id: 2, title: "Blockchain em Sistemas de Votação", description: "James Thompson Dijkstra", tags: ["Blockchain", "Segurança"] },
    { id: 3, title: "Realidade Aumentada na Educação", description: "James Thompson Dijkstra", tags: ["AR", "Educação"] },
    { id: 4, title: "Análise de Sentimentos em Redes Sociais", description: "James Thompson Dijkstra", tags: ["NLP", "Redes Sociais"] },
    { id: 5, title: "IoT na Agricultura de Precisão", description: "James Thompson Dijkstra", tags: ["IoT", "Agricultura"] },
    { id: 6, title: "Cibersegurança em Sistemas Críticos", description: "James Thompson Dijkstra", tags: ["Cibersegurança"] },
    { id: 7, title: "Computação Quântica: Algoritmos e Aplicações", description: "James Thompson Dijkstra", tags: ["Computação Quântica"] },
    { id: 8, title: "Veículos Autônomos e Ética", description: "James Thompson Dijkstra", tags: ["IA", "Ética"] },
    { id: 9, title: "Big Data na Previsão do Tempo", description: "James Thompson Dijkstra", tags: ["Big Data", "Meteorologia"] },
    { id: 10, title: "Bioinformática e Sequenciamento de DNA", description: "James Thompson Dijkstra", tags: ["Bioinformática", "Genética"] },
]

export default function Component() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4; // 4 TCCs por página
    const totalPages = Math.ceil(tccs.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentTCCs = tccs.slice(startIndex, endIndex);

    const [visible, setVisible] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const [user, setUser] = useState<UserResponseDTO | null>(null);

    // useEffect(() => {
    //     UserService.getUser().then(data => setUser(data));
    // }, []);

    const headerTemplates = (label: string, index: number) => (
        <div
            className="flex items-center gap-2 p-3 cursor-pointer"
            style={{
                borderBottom: index === activeIndex ? '2px solid black' : 'none',
                paddingBottom: '16px', // Remove padding below the header to avoid extra space
            }}
            onClick={() => setActiveIndex(index)}
        >
            <span className="font-bold whitespace-nowrap text-black">{label}</span>
        </div>
    );


    return (
        <div className="mx-auto p-4 text-gray-800 mt-4">
            {/* primeiro container */}
            <div className="flex flex-col lg:flex-row gap-8 ">
                <div className="lg:w-1/3 rounded-lg p-16 pt-6 mt-2">
                    <div className="flex flex-col items-center border border-gray-400 rounded-lg p-8" style={{ boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.25)' }}>
                        <div className="flex justify-center w-full mb-4">
                            <Image
                                alt=""
                                src="/profile.png"
                                width="260"
                                height="260"
                                className="rounded-full border-0"
                                style={{ height: 'auto' }}
                            />
                        </div>
                        <h1 className="text-2xl font-bold mb-1 text-center">Luiz Bolsonaro de Moraes</h1>
                        <p className="text-gray-600 mb-4 text-center">Acadêmico</p>
                        <Button
                            icon="pi pi-pencil"
                            label="Editar Conta"
                            className="mb-4 w-48"
                            style={{
                                backgroundColor: '#2b2d39',
                                borderColor: '#2b2d39',
                                color: 'white',
                                transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#1d1d2c';
                                e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#2b2d39';
                                e.currentTarget.style.color = 'white';
                            }}
                            onClick={() => setVisible(true)}
                        />

                        <div className="flex flex-col items-center mt-6">
                            <div className="flex flex-wrap justify-center items-center gap-4 mb-4">
                                <span className="flex items-center">
                                    <i className="pi pi-heart-fill text-red-500 mr-1"></i>
                                    <span className="font-bold text-red-500">26</span>
                                    <span className="text-gray-600 ml-1">Curtidos</span>
                                </span>
                                <span className="flex items-center">
                                    <i className="pi pi-star-fill text-yellow-500 mr-1"></i>
                                    <span className="font-bold text-yellow-500">62</span>
                                    <span className="text-gray-600 ml-1">Favoritos</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>



                {/* segundo container */}
                <div className="lg:w-2/3 mr-8">
                    <h3 className="text-md font-semibold mb-2">Favoritos</h3>
                    <div className="grid gap-4"> {/* Aumentado o espaçamento entre os cards */}
                        {currentTCCs.map((tcc) => (
                            <Card
                                key={tcc.id}
                                title={<span style={{ fontSize: '16px', fontWeight: 'strong' }}>{tcc.title}</span>}
                                className="text-xs font-light border border-gray-400"
                            >
                                <p className="text-sm font-medium text-gray-600 mb-1">
                                    {tcc.description}
                                </p>
                                <div className="flex flex-wrap gap-0.5">
                                    {tcc.tags.map((tag, index) => (
                                        <Badge
                                            key={index}
                                            value={tag}
                                            className="text-white text-3xs mr-0.5 mt-4"
                                            style={{ backgroundColor: '#2b2d39' }}
                                        />
                                    ))}
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* terceiro container */}
                    <div className="flex gap-8 items-center mt-8 justify-center">
                        <Button
                            icon="pi pi-chevron-left"
                            label=""
                            className="p-button-outlined p-button-sm"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            style={{
                                backgroundColor: '#2b2d39',
                                borderColor: '#2b2d39',
                                color: 'white',
                                transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
                                borderWidth: '1px',
                                borderStyle: 'solid'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#1d1d2c';
                                e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#2b2d39';
                                e.currentTarget.style.color = 'white';
                            }}
                        />

                        <span className="text-md font-medium text-gray-600">
                            Página {currentPage} de {totalPages}
                        </span>
                        <Button
                            icon="pi pi-chevron-right"
                            label=""
                            iconPos="right"
                            className="p-button-outlined p-button-sm p"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            style={{
                                backgroundColor: '#2b2d39',
                                borderColor: '#2b2d39',
                                color: 'white',
                                transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
                                borderWidth: '1px',
                                borderStyle: 'solid'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#1d1d2c';
                                e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#2b2d39';
                                e.currentTarget.style.color = 'white';
                            }}
                        />

                    </div>
                </div>
            </div>
            <Dialog header="Header" visible={visible} style={{ width: '50vw' }} onHide={() => { if (!visible) return; setVisible(false); }}>

                <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                    <TabPanel


                        headerTemplate={headerTemplates('Detalhes da Conta', 0)}
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
                        <div className="mt-6 py-2 rounded-lg">
                            <Button
                                type="button"
                                label="Salvar Alterações"
                                className="w-full text-white font-semibold py-2 rounded-md hover:bg-gray-800 transition duration-300"
                                style={{ backgroundColor: '#2b2d39', borderColor: '#2b2d39', borderWidth: '1px', borderStyle: 'solid' }}
                            />
                        </div>

                    </TabPanel>

                    <TabPanel
                        header={
                            <span
                                className={`text-base px-4 py-2 cursor-pointer ${activeIndex === 1
                                    ? 'text-black'
                                    : 'text-black'
                                    }`}
                            >
                                Alterar Senha
                            </span>
                        }
                        headerTemplate={headerTemplates('Alterar Senha', 1)}
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
                        <div className="mt-6 py-2 rounded-lg">
                            <Button
                                type="button"
                                label="Alterar Senha"
                                className="w-full text-white font-semibold py-2 rounded-md hover:bg-gray-800 transition duration-300"
                                style={{ backgroundColor: '#2b2d39', borderColor: '#2b2d39', borderWidth: '1px', borderStyle: 'solid' }}
                            />
                        </div>
                    </TabPanel>
                </TabView>
            </Dialog>
        </div>
    );
}
