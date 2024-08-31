"use client";

import { TCCService } from "@/service/tccService";
import { TCCResponseDTO } from "@/types";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const TCC = () => {
    const pathname = usePathname();
    const segments = pathname.split('/');
    const fileName = segments[segments.length - 1];

    const [tcc, setTCC] = useState<TCCResponseDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getTCC = async () => {
            try {
                const response = await TCCService.getTCC(fileName);
                setTCC(response);
            } catch (error) {
                console.error("Error fetching TCC:", error);
            } finally {
                setLoading(false);
            }
        };

        getTCC();
    }, [fileName]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!tcc) {
        return <div>No TCC data available</div>;
    }

    function formatDateToBrazilian(dateString: string): string {
        const dateParts = dateString.split('-');
        const [year, month, day] = dateParts;
        return `${day}/${month}/${year}`;
    }

    return (
        <div className="flex flex-col min-h-screen mt-8">
            <div className="flex-grow max-w-7xl mx-auto" style={{ width: '80%' }}>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 table-fixed">
                        <tbody>
                            <tr className="border-b">
                                <td className="px-4 py-4 font-semibold bg-gray-100 w-1/4">Título</td>
                                <td className="px-4 py-2 w-3/4">{tcc.title}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-4 py-4 font-semibold bg-gray-100 w-1/4">Autor</td>
                                <td className="px-4 py-2 w-3/4">{tcc.author}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-4 py-4 font-semibold bg-gray-100 w-1/4">Curso</td>
                                <td className="px-4 py-2 w-3/4">{tcc.course.name}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-4 py-4 font-semibold bg-gray-100 w-1/4">Data da Defesa</td>
                                <td className="px-4 py-2 w-3/4">{formatDateToBrazilian(tcc.defenseDate)}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-4 py-4 font-semibold bg-gray-100 w-1/4">Orientador</td>
                                <td className="px-4 py-2 w-3/4">{tcc.advisor.name}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-4 py-4 font-semibold bg-gray-100 w-1/4">Membros da banca</td>
                                <td className="px-4 py-2 w-3/4">{tcc.committeeMembers.map((prof) => prof.name).join(', ')}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-4 py-4 font-semibold bg-gray-100 w-1/4">Resumo</td>
                                <td className="px-4 py-2 w-3/4">
                                    {tcc.summary}
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-4 py-4 font-semibold bg-gray-100 w-1/4">Abstract</td>
                                <td className="px-4 py-2 w-3/4">
                                    {tcc.abstractText}
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-4 py-4 font-semibold bg-gray-100 w-1/4">Palavras-Chave</td>
                                <td className="px-4 py-2 w-3/4">
                                    {tcc.keywords?.map((keyword) => keyword.name).join(', ')}
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-4 py-4 font-semibold bg-gray-100 w-1/4">Idioma</td>
                                <td className="px-4 py-2 w-3/4">{tcc.language}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="mt-8 border">
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white table-fixed">
                            <thead>
                                <tr className="bg-gray-400">
                                    <th className="px-4 py-2 text-left w-1/4">Arquivo</th>
                                    <th className="px-4 py-2 text-left w-1/4">Descrição</th>
                                    <th className="px-4 py-2 text-left w-1/4">Formato</th>
                                    <th className="px-4 py-2 text-center w-1/4">Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b">
                                    <td className="px-4 py-2">827da598-d292-4c19-814f-5fa7358696a4</td>
                                    <td className="px-4 py-2">Monografia</td>
                                    <td className="px-4 py-2">PDF</td>
                                    <td className="px-4 py-2 text-center ">
                                        <a href={`http://localhost:8080/tcc/view/${tcc.pathFile.split('\\').pop()}`} download="arquivo.pdf" className="p-button font-semibold" target="_blank"
                                            style={{
                                                backgroundColor: '#2b2d39',
                                                borderColor: '#2b2d39',
                                                color: 'white',
                                                transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
                                                padding: '8px 12px',
                                                fontSize: '14px',
                                                fontWeight: '500',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = '#1d1d2c';
                                                e.currentTarget.style.color = 'white';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = '#2b2d39';
                                                e.currentTarget.style.color = 'white';
                                            }}>
                                            Acessar
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );


}

export default TCC;