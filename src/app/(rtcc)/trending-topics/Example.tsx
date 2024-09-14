import React, { useState } from 'react';
import { Text } from '@visx/text';
import { scaleLog } from '@visx/scale';
import Wordcloud from '@visx/wordcloud/lib/Wordcloud';
import { totoAfricaLyrics } from './text.fixture';

interface ExampleProps {
    width: number;
    height: number;
    showControls?: boolean;
    fontSizeSetter: (datum: WordData) => number;
    words: WordData[];
}

export interface WordData {
    text: string;
    value: number;
}

const colors = ['#20222c', '#474b5f', '#646985', '#ffbd59'];

function wordFreq(text: string): WordData[] {
    const words: string[] = text.replace(/\./g, '').split(/\s+/);
    const freqMap: Record<string, number> = {};

    for (const w of words) {
        if (!freqMap[w]) freqMap[w] = 0;
        freqMap[w] += 1;
    }
    return Object.keys(freqMap).map((word) => ({ text: word, value: freqMap[word] }));
}

function getRotationDegree() {
    const rand = Math.random();
    const degree = rand > 0.5 ? 60 : -60;
    return rand * degree;
}

// const words = wordFreq(totoAfricaLyrics);

// Ajuste o intervalo de escala da fonte para aumentar o tamanho da fonte
// const fontScale = scaleLog({
//     domain: [Math.min(...words.map((w) => w.value)), Math.max(...words.map((w) => w.value))],
//     range: [20, 150], // Aumente o valor máximo para um tamanho maior
// });
// const fontSizeSetter = (datum: WordData) => fontScale(datum.value);

const fixedValueGenerator = () => 0.5;

type SpiralType = 'archimedean' | 'rectangular';

export default function Example({ width, height, showControls, fontSizeSetter, words }: ExampleProps) {
    const [spiralType, setSpiralType] = useState<SpiralType>('archimedean');
    const [withRotation, setWithRotation] = useState(false);

    return (
        <div className="container">
            <div className="wordcloud">
                {/* Botão para dar um alert nos tccs fetcheds
            <button
                onClick={() => {
                    console.log(JSON.stringify(words));
                }}
            >ZZZZZZZZZZZZ</button> */}
                <Wordcloud
                    words={words}
                    width={width}
                    height={height}
                    fontSize={fontSizeSetter}
                    font={'Impact'}
                    padding={2}
                    spiral={spiralType}
                    rotate={function () { return (~~(Math.random() * 6) - 3) * 30; }}
                    random={fixedValueGenerator}
                >
                    {(cloudWords) =>
                        cloudWords.map((w, i) => (
                            <Text
                                key={w.text}
                                fill={colors[i % colors.length]}
                                textAnchor={'middle'}
                                transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
                                fontSize={w.size}
                                fontFamily={w.font}
                            >
                                {w.text}
                            </Text>
                        ))
                    }
                </Wordcloud>
            </div>
            <style jsx>{`
        .container {
          display: flex;
          justify-content: center; /* Centraliza horizontalmente */
          width: 100%;
        }
        .wordcloud {
          display: flex;
          flex-direction: column;
          user-select: none;
          width: 100%;
          max-width: ${width}px; /* Define a largura máxima */
          height: ${height}px; /* Define a altura do componente */
        }
        .wordcloud svg {
          width: 100%;
          height: 100%;
          margin: 0;
          cursor: pointer;
        }
        .controls {
          margin-top: 1rem;
        }
        .controls label {
          display: inline-flex;
          align-items: center;
          font-size: 14px;
          margin-right: 8px;
        }
      `}</style>
        </div>
    );
}
