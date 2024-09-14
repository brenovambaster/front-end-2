"use client";
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import Example from './Example';
import { FaHeart, FaStar } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { TCCService } from '@/service/tccService';
import { scaleLog } from '@visx/scale';


type Keyword = {
    name: string;
};

type DataObject = {
    id: string;
    title: string;
    keywords: Keyword[];
};

type WordData = {
    text: string;
    value: number;
};




export default function Component() {
    const [loading, setLoading] = useState(true);
    const [mostLikedTCCs, setMostLikedTCCs] = useState<any[]>([]);
    const [mostFavoritedTCCs, setMostFavoritedTCCs] = useState<any[]>([]);
    const [allTCCs, setAllTCCs] = useState<any[]>([]);
    const [fetchingTCCs, setFetchingTCCs] = useState(true);

    useEffect(() => {
        setLoading(false);

        const getTCC = async () => {
            try {
                const mostLikedTCCsResponse = await TCCService.getTCCs();
                const mostFavoritedTCCsResponse = await TCCService.getTCCs();
                const allTCCsResponse = await TCCService.getTCCs();
                setMostLikedTCCs(mostLikedTCCsResponse);
                setMostFavoritedTCCs(mostFavoritedTCCsResponse);
                setAllTCCs(allTCCsResponse);

            } catch (error) {
                console.error("Error fetching TCCs:", error);
            } finally {
                setFetchingTCCs(false);
            }
        };

        getTCC();
    }, []);


    function wordFreq(dataArray: DataObject[]): WordData[] {
        const freqMap: Record<string, number> = {};

        
        for (const data of dataArray) {
            
            for (const keyword of data.keywords) {
                const word = keyword.name.trim(); 

                if (word) { 
                    if (!freqMap[word]) freqMap[word] = 0;
                    freqMap[word] += 1;
                }
            }
        }

        return Object.keys(freqMap).map((word) => ({ text: word, value: freqMap[word] }));
    }


    const words = wordFreq(mostLikedTCCs);

    
    const fontScale = scaleLog({
        domain: [Math.min(...words.map((w) => w.value)), Math.max(...words.map((w) => w.value))],
        range: [1, 50], 
    });
    const fontSizeSetter = (datum: WordData) => fontScale(datum.value);

    return (
        <div className="w-full px-4 py-8">

            {/* <button
                onClick={() => {
                    alert(JSON.stringify(words));
                }}
            >ZZZZZZZZZZZZ</button> */}
            {loading && (
                <div className="absolute top-0 left-0 w-full h-full bg-white flex flex-col justify-center items-center z-10">
                    <AiOutlineLoading className="text-black text-5xl animate-spin" />
                    <p className="mt-5 text-black text-lg">Carregando, por favor, aguarde...</p>
                </div>
            )}
            <div className={`mt-4 flex justify-center`}>
                <Example width={800} height={600} fontSizeSetter={fontSizeSetter} words={words} />
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
                        <div key={tcc.id} className="mb-2 p-4 bg-gray-100 rounded-lg border border-gray-400">
                            <h3 className="font-semibold h-16 overflow-hidden break-words">{tcc.title}</h3>
                            <p className="text-sm text-gray-600 mt-2">{tcc.author}</p>
                            <Tag
                                value={tcc.numLikes}
                                icon={<FaHeart style={{ color: '#ff3040', marginRight: '4px' }} />}
                                className="mt-2 bg-transparent border-none text-gray-800 text-sm"
                            />
                        </div>
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
                        <div key={tcc.id} className="mb-2 p-4 bg-gray-100 rounded-lg border border-gray-400">
                            <h3 className="font-semibold h-16 overflow-hidden">{tcc.title}</h3>
                            <p className="text-sm text-gray-600 mt-2">{tcc.author}</p>
                            <Tag
                                value={tcc.numFavorites}
                                icon={<FaStar style={{ color: '#f59e0b', marginRight: '4px' }} />}
                                className="mt-2 bg-transparent border-none text-gray-800 text-sm"
                            />
                        </div>
                    ))}
                </Card>
            </div>
        </div>
    );
}