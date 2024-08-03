// src/types.ts

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
