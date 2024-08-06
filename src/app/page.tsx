"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import graduation_cap_image from "../../public/rtcc-if-logo.png";

const HomePage = () => {
  const router = useRouter();

  const handleClick = (rota: string) => {
    router.push(rota);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <header className="py-4 w-full flex justify-center"> 
        <Image alt="logo" src={graduation_cap_image} height={200} width={200} />
      </header>
      <div className="relative w-full max-w-4xl mx-4 md:mx-0 mt-4">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center text-gray-500">
          <i className="pi pi-search" style={{ fontSize: "1.25rem" }}></i>
        </div>
        <input
          className="flex h-10 border-2 border-gray-300 px-3 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-md bg-background pl-12 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Pesquisar monografias..."
          type="search"
        />
      </div>
      <nav className="flex justify-center gap-4 mt-8 w-full max-w-4xl">
        <a
          className="text-sm font-medium text-muted-foreground hover:text-foreground focus:outline-none focus:ring-1 focus:ring-ring text-gray-600"
          // href="/"
          rel="ugc"
        >
          Autores
        </a>
        <a
          className="text-sm font-medium text-muted-foreground hover:text-foreground focus:outline-none focus:ring-1 focus:ring-ring text-gray-600"
          // href="/"
          rel="ugc"
        >
          Áreas
        </a>
        <a
          className="text-sm font-medium text-muted-foreground hover:text-foreground focus:outline-none focus:ring-1 focus:ring-ring text-gray-600"
          // href="/"
          rel="ugc"
        >
          Orientador
        </a>
        <a
          className="text-sm font-medium text-muted-foreground hover:text-foreground focus:outline-none focus:ring-1 focus:ring-ring text-gray-600"
          // href="/"
          rel="ugc"
        >
          Ano da Defesa
        </a>
      </nav>
    </div>
  );
};
export default HomePage;
