export interface ProfessorResponseDTO {
    id: string;
    name: string;
    researchArea: string;
    title: string;
    email: string;
    locationOfWork: string;
}

export interface ProfessorRequestDTO {
    id: string;
    name: string;
    researchArea: string;
    title: string;
    email: string;
    locationOfWork: string;
}

export interface CursoRequestDTO {
    id: string,
    name: string,
    codeOfCourse: string
}

export interface CursoResponseDTO {
    id: string,
    name: string,
    codeOfCourse: string
}

export interface CoordinatorRequestDTO {
    id: string;
    name: string;
    email: string;
    username: string;
    password: string;
    course: {
        id: string;
        name: string;
        codeOfCourse: string;
    };
}

export interface CoordinatorResponseDTO {
    id: string,
    name: string,
    email: string,
    username: string,
    password: string,
    course: {
        id: string;
        name: string;
        codeOfCourse: string;
    };
}

export interface TCCRequestDTO {
    id: string;
    title: string; // Título
    author: string; // Autor
    course: string; // Curso
    defenseDate: string; // Data da Defesa no formato ISO 8601 ou similar
    advisor: string; // Orientador
    committeeMembers: string[]; // Membros da Banca como array de strings
    summary?: string; // Resumo (opcional, pois pode ser null no banco)
    abstractText?: string; // Abstract (alterado para corresponder ao nome da coluna)
    keywords: {
        name: string;
    }[]; // Palavras-chave como array de objetos
    language: string; // Idioma
    tcc: undefined; // Arquivo PDF, inicialmente undefined
}


export interface TCCResponseDTO {
    id: string;
    title: string; // Título
    author: string; // Autor
    course: string; // Curso
    defenseDate: string; // Data da Defesa no formato ISO 8601 ou similar
    advisor: ProfessorResponseDTO; // Orientador
    committeeMembers: ProfessorResponseDTO[]; // Membros da Banca como array de objetos
    summary?: string; // Resumo (opcional, pois pode ser null no banco)
    abstractText?: string; // Abstract (alterado para corresponder ao nome da coluna)
    keywords?: {
        name: string;
    }[]; // Palavras-chave como array de objetos (opcional, pois pode ser null no banco)
    language: string; // Idioma
    tcc?: File; // Arquivo PDF
    pathFile: string;
}

export interface FilterTCCRequestDTO {
    filter: string;
    value: string;
}

export interface KeywordDTO {
    name: string;
}

export type Login = {
    username: string;
    password: string;
}


export interface UserRequestDTO {
    id: string;
    name: string;
    email: string;
    course: string;
    password: string;
}

export interface UserResponseDTO {
    id: string;
    name: string;
    email: string;
    course: string;
}