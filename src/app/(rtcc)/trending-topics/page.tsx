"use client";
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import Example from './Example';
import { FaHeart, FaStar } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { TCCService } from '@/service/tccService';
import Link from 'next/link';


export default function Component() {
    const [loading, setLoading] = useState(true);
    const [mostLikedTCCs, setMostLikedTCCs] = useState<any[]>([]);
    const [mostFavoritedTCCs, setMostFavoritedTCCs] = useState<any[]>([]);
    const [allTCCs, setAllTCCs] = useState<any[]>([]);
    const [fetchingTCCs, setFetchingTCCs] = useState(true);
    const [keywordsText, setKeywordsText] = useState<string>('');

    const handleCardClick = (tccId: string) => {
        const url = `/tcc/${tccId}`;
        window.open(url, '_blank');
    };

    useEffect(() => {

        const getTCC = async () => {
            try {
                const mostLikedTCCsResponse = await TCCService.getTCCs();
                const mostFavoritedTCCsResponse = await TCCService.getTCCs();
                const allTCCsResponse = await TCCService.getTCCs();

                setKeywordsText(allTCCsResponse.map((tcc) => tcc.keywords.map((keyword) => keyword.name).join('|')).join('|'));
                
                setMostLikedTCCs(mostLikedTCCsResponse);
                setMostFavoritedTCCs(mostFavoritedTCCsResponse);
                setAllTCCs(allTCCsResponse);

            } catch (error) {
                console.error("Error fetching TCCs:", error);
            } finally {
                setFetchingTCCs(false);
                setLoading(false);
            }
        };

        getTCC();
    }, []);

    return (
        <div className="w-full px-4 py-8">
            {loading && (
                <div className="absolute top-0 left-0 w-full h-full bg-white flex flex-col justify-center items-center z-10">
                    <AiOutlineLoading className="text-black text-5xl animate-spin" />
                    <p className="mt-5 text-black text-lg">Carregando, por favor, aguarde...</p>
                </div>
            )}
            <div className={`mt-4 flex justify-center`}>
                <Example width={800} height={600} keywordsText={keywordsText} />
            </div>

            <div className="mb-4 mt-8 ml-8">
                <h1 className="text-4xl font-extrabold mb-2 bg-clip-text">
                    Populares
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 ml-8 mr-8">

                <Card
                    title={
                        <span className="font-semibold text-lg flex items-center">
                            <FaHeart className="mr-2" style={{ color: '#ff3040' }} />
                            Top 10 Mais Curtidos
                        </span>
                    }
                    className="text-2xl border border-gray-300 shadow-none"
                >
                    {mostLikedTCCs.sort((a, b) => b.likes - a.likes).map(tcc => (
                        <Link href="" onClick={(e) => {
                            e.preventDefault();
                            handleCardClick(tcc.id);
                        }}>
                            <div key={tcc.id} className="mb-2 p-4 bg-gray-100 rounded-lg border border-gray-400">
                                <h3 className="font-semibold h-16 overflow-hidden break-words">{tcc.title}</h3>
                                <p className="text-sm text-gray-600 mt-2">{tcc.author}</p>
                                <Tag
                                    value={tcc.numLikes}
                                    icon={<FaHeart style={{ color: '#ff3040', marginRight: '4px' }} />}
                                    className="mt-2 bg-transparent border-none text-gray-800 text-sm"
                                />
                            </div>
                        </Link>
                    ))}
                </Card>


                <Card
                    title={
                        <span className="font-semibold text-lg flex items-center">
                            <FaStar className="mr-2" style={{ color: '#f59e0b' }} />
                            Top 10 Mais Favoritados
                        </span>
                    }
                    className="text-2xl border border-gray-300 shadow-none"
                >
                    {mostFavoritedTCCs.sort((a, b) => b.favorites - a.favorites).map(tcc => (
                        <Link href="" onClick={(e) => {
                            e.preventDefault();
                            handleCardClick(tcc.id);
                        }}>
                            <div
                                key={tcc.id}
                                className="mb-2 p-4 bg-gray-100 rounded-lg border border-gray-400 cursor-pointer"
                            >
                                <h3 className="font-semibold h-16 overflow-hidden">{tcc.title}</h3>
                                <p className="text-sm text-gray-600 mt-2">{tcc.author}</p>
                                <Tag
                                    value={tcc.numFavorites}
                                    icon={<FaStar style={{ color: '#f59e0b', marginRight: '4px' }} />}
                                    className="mt-2 bg-transparent border-none text-gray-800 text-sm"
                                />
                            </div>
                        </Link>
                    ))}
                </Card>

            </div>
        </div>
    );
}