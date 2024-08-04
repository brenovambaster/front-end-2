'use client';

import React from 'react';
import { useRouter } from 'next/navigation'; 


const HomePage = () => {
  const router = useRouter();

  const handleClick = (rota: string) => {
    router.push(rota);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Bem-vindo à Página Inicial</h1>
      <button 
        onClick={() => handleClick('/gerenciar/professor')} 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Gerenciar Professores
      </button>
      <br/>
      <br/>
      <button 
        onClick={() => handleClick('/gerenciar/curso')} 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Gerenciar Cursos
      </button>
    </div>
  );
};
export default HomePage;
