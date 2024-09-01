"use client";

import { AuthContext } from "@/contexts/AuthContext";
import { TCCService } from "@/service/tccService";
import { UserService } from "@/service/userService";
import { TCCResponseDTO } from "@/types";
import axios from 'axios';
import { usePathname, useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useContext, useEffect, useState } from "react";
import { FaHeart, FaRegHeart, FaRegStar, FaStar } from 'react-icons/fa';
import { FiDownload } from "react-icons/fi";


const TCC = () => {
    const pathname = usePathname();
    const segments = pathname.split('/');
    const fileName = segments[segments.length - 1];

    const [tcc, setTCC] = useState<TCCResponseDTO | null>(null);
    const [fetchingTCC, setFetchingTCC] = useState<boolean>(true);

    const [fetchingLikedTCCs, setFetchingLikedTCCs] = useState<boolean>(true);
    const [fetchingFavoritedTCCs, setFetchingFavoritedTCCs] = useState<boolean>(true);

    const [liked, setLiked] = useState(false);
    const [favorited, setFavorited] = useState(false);
    const [animateLike, setAnimateLike] = useState(false);
    const [animateFavorite, setAnimateFavorite] = useState(false);
    const { user, isAuthenticated } = useContext(AuthContext);
    const [visible, setVisible] = useState(false);

    let tryingToLike = false;
    let tryingToFavorite = false;

    const handleLikeClick = () => {

        if (user != null) {
            if (!liked) {
                UserService.likeTCC(user.id, tcc.id);
            } else {
                UserService.unlikeTCC(user.id, tcc.id);
            }

            setLiked(prevLiked => {
                const newLikedState = !prevLiked;
                setAnimateLike(true);
                setTimeout(() => setAnimateLike(false), 300);
                return newLikedState;
            });
        } else {
            tryingToLike = true;
            setVisible(true);
        }
    }

    const handleFavoriteClick = () => {

        if (user != null) {
            if (!favorited) {
                UserService.favoriteTCC(user.id, tcc.id);
            } else {
                UserService.unfavoriteTCC(user.id, tcc.id);
            }

            setFavorited(prevFavorited => {
                const newFavoritedState = !prevFavorited;
                setAnimateFavorite(true);
                setTimeout(() => setAnimateFavorite(false), 300);
                return newFavoritedState;
            });
        } else {
            tryingToFavorite = true;
            setVisible(true);
        }
    };


    useEffect(() => {

        const getTCC = async () => {
            try {
                const response = await TCCService.getTCC(fileName);
                setTCC(response);
            } catch (error) {
                console.error("Error fetching TCC:", error);
            } finally {
                setFetchingTCC(false);
            }
        };


        const getLikedTCCs = async () => {
            try {
                const likedTCCs = await UserService.getLikedTCCs(user.id);
                setLiked(likedTCCs.some((tcc) => tcc.id === tcc.id));
            } catch (error) {
                console.error("Error fetching liked TCCs:", error);
            } finally {
                setFetchingLikedTCCs(false);
            }
        }

        const getFavoritedTCCs = async () => {
            try {
                const favoritedTCCs = await UserService.getFavoritedTCCs(user.id);
                setFavorited(favoritedTCCs.some((tcc) => tcc.id === tcc.id));
            } catch (error) {
                console.error("Error fetching favorited TCCs:", error);
            } finally {
                setFetchingFavoritedTCCs(false);
            }
        }
        getTCC();
        getLikedTCCs(); 
        getFavoritedTCCs();
        
    }, [fileName]);

    if (fetchingTCC || fetchingLikedTCCs || fetchingFavoritedTCCs) {
        return null;
    }

    if (!tcc) {
        const router = useRouter();
        router.push('/nao-encontrado');
        return null;
    }

    function formatDateToBrazilian(dateString: string): string {
        const dateParts = dateString.split('-');
        const [year, month, day] = dateParts;
        return `${day}/${month}/${year}`;
    }

    const downloadTCC = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/tcc/view/${tcc.pathFile.split('\\').pop()}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${tcc.title}.pdf`.trim().replace('_', ''));
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Erro ao baixar o arquivo:', error);
        }
    };

    const footerContent = (
        <div>
            <Button label="Não" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" style={{ color: '#2b2d39' }} />
            <Button label="Sim" icon="pi pi-check" onClick={() => setVisible(false)} autoFocus style={{
                backgroundColor: '#2b2d39',
                border: 'none',
                boxShadow: 'none'
            }} />
        </div>
    );

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
                                    <td className="px-4 py-2">{`${tcc.title}.pdf`.trim().replace('_', '')}</td>
                                    <td className="px-4 py-2">Monografia</td>
                                    <td className="px-4 py-2">PDF</td>
                                    <td className="px-4 py-2 text-center">
                                        <div className="flex items-center justify-center space-x-2">
                                            <button
                                                onClick={handleLikeClick}
                                                className={`p-2 ${animateLike ? 'animate-shake' : ''}`}
                                                style={{
                                                    fontSize: '24px',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: liked ? 'red' : 'gray',
                                                    transition: 'color 0.2s ease-in-out',

                                                }}
                                            >
                                                {liked ? <FaHeart /> : <FaRegHeart />}
                                            </button>

                                            <button
                                                onClick={handleFavoriteClick}
                                                className={`p-2 ${animateFavorite ? 'animate-shake' : ''}`}
                                                style={{
                                                    fontSize: '24px',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: favorited ? 'yellow' : 'gray',
                                                    transition: 'color 0.2s ease-in-out',
                                                }}
                                            >
                                                {favorited ? <FaStar /> : <FaRegStar />}
                                            </button>

                                            <a
                                                href={`http://localhost:8080/tcc/view/${tcc.pathFile.split('\\').pop()}`}
                                                download="arquivo.pdf"
                                                className="p-button font-semibold rounded-full"
                                                target="_blank"
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
                                                }}
                                            >
                                                Visualizar
                                            </a>
                                            <div
                                                onClick={downloadTCC}
                                                className="p-button font-semibold"
                                                style={{
                                                    backgroundColor: '#2b2d39',
                                                    borderColor: '#2b2d39',
                                                    color: 'white',
                                                    transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
                                                    padding: '8px 12px',
                                                    fontSize: '14px',
                                                    fontWeight: '500',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    borderRadius: '50%',
                                                    width: '40px',
                                                    height: '40px',
                                                    lineHeight: '40px',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = '#1d1d2c';
                                                    e.currentTarget.style.color = 'white';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = '#2b2d39';
                                                    e.currentTarget.style.color = 'white';
                                                }}
                                            >
                                                <FiDownload />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Dialog
                header="Realizar login"
                visible={visible}
                position='bottom-right'
                style={{ width: '30vw' }}
                onHide={() => {
                    if (!visible) return; setVisible(false);
                }}
                footer={footerContent}
                draggable={false}
                resizable={false}>
                <p className="m-0">
                    {tryingToLike ? 'Deseja realizar o login para curtir este TCC?' : 'Deseja realizar o login para favoritar este TCC?'}
                </p>
            </Dialog>
        </div>
    );
}

export default TCC;