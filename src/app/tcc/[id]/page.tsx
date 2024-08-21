"use client";

import { Button } from "primereact/button";
import Footer from "../../../components/Footer";

const TCC = () => {

    return (
        <div className="flex flex-col min-h-screen mt-16">
            <div className="flex-grow max-w-7xl mx-auto" style={{ maxWidth: '80%' }}>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <tbody>
                            <tr className="border-b">
                                <td className="px-4 py-4 font-semibold bg-gray-100">Título</td>
                                <td className="px-4 py-2">Aplicações de Redes Neurais Convolucionais em Diagnóstico Médico</td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-4 py-4 font-semibold bg-gray-100">Autor</td>
                                <td className="px-4 py-2">Ana Clara Mendes</td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-4 py-4 font-semibold bg-gray-100">Curso</td>
                                <td className="px-4 py-2">Ciência da Computação</td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-4 py-4 font-semibold bg-gray-100">Data da Defesa</td>
                                <td className="px-4 py-2">15/06/2023</td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-4 py-4 font-semibold bg-gray-100">Orientador</td>
                                <td className="px-4 py-2">Prof. Dr. Lucas Almeida</td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-4 py-4 font-semibold bg-gray-100">Membros da banca</td>
                                <td className="px-4 py-2">Prof. Dr. Carolina Lima, Prof. Dr. Rafael Costa</td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-4 py-4 font-semibold bg-gray-100">Resumo</td>
                                <td className="px-4 py-2">
                                    Este trabalho explora a aplicação de redes neurais convolucionais (CNNs) em diagnóstico
                                    médico, com foco em imagens médicas. São discutidas as principais arquiteturas de CNNs
                                    e sua eficácia na detecção de patologias em exames de imagem, como radiografias e
                                    ressonâncias magnéticas. A pesquisa inclui uma análise de desempenho de diferentes
                                    modelos e a proposta de uma nova abordagem para melhorar a acurácia do diagnóstico.
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-4 py-4 font-semibold bg-gray-100">Abstract</td>
                                <td className="px-4 py-2">
                                    This thesis explores the application of convolutional neural networks (CNNs) in medical
                                    diagnosis, focusing on medical imaging. It discusses the main CNN architectures and their
                                    effectiveness in detecting pathologies in imaging exams, such as X-rays and MRIs.
                                    The research includes a performance analysis of different models and proposes a
                                    new approach to improve diagnostic accuracy.
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-4 py-4 font-semibold bg-gray-100">Palavras-Chave</td>
                                <td className="px-4 py-2">
                                    Redes Neurais Convolucionais, Diagnóstico Médico, Imagens Médicas, Aprendizado Profundo
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-4 py-4 font-semibold bg-gray-100">Idioma</td>
                                <td className="px-4 py-2">Português</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="mt-8 border">
                    {/* <h3 className="px-4 py-2 text-lg font-semibold bg-gray-400 rounded-sm">Arquivos associados a este item:</h3> */}
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
                                    <td className="px-4 py-2 text-center">
                                        <Button className="p-button-sm text-center text-[14px] font-bold">
                                            <a href="http://localhost:8080/tcc/view/827da598-d292-4c19-814f-5fa7358696a4.pdf" download="arquivo.pdf" target="_blank">
                                                Visualizar
                                            </a>
                                        </Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
            {/* <Footer margin="16" /> */}
        </div>
    );
}

export default TCC;