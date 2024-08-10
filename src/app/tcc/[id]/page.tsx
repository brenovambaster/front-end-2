"use client";

import { Button } from "primereact/button";
import Footer from "../../../components/Footer";

const TCC = () => {

    return (
        <div className="flex flex-col min-h-screen  mt-16">
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
                <div className="mt-8">
                    <h3 className="px-4 py-2 text-lg font-semibold bg-gray-400">Arquivos associados a este item:</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="px-4 py-2 text-left">Arquivo</th>
                                    <th className="px-4 py-2 text-left">Descrição</th>
                                    <th className="px-4 py-2 text-left">Tamanho</th>
                                    <th className="px-4 py-2 text-left">Formato</th>
                                    <th className="px-4 py-2 text-center">Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b">
                                    <td className="px-4 py-2">Texto Final Rafael Nicolino 25.02.pdf</td>
                                    <td className="px-4 py-2">Monografia de Especialização</td>
                                    <td className="px-4 py-2">1.07 MB</td>
                                    <td className="px-4 py-2">Adobe PDF</td>
                                    <td className="px-4 py-2 text-center">
                                        <Button className="p-button-sm text-center text-[14 px]"><b>Pré-visualizar</b></Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="flex justify-start mt-4"> 
                    <Button className="p-button-sm"><b>Visualizar estatísticas</b></Button>
                </div>
            </div>
            <Footer margin="16"/>
        </div>
    );
}

export default TCC;
