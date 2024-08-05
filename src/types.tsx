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

export interface  CursoRequestDTO {
    id: string,
    name: string,
    campus: string,
    codeOfCourse: string
}

export interface CursoResponseDTO {
    id: string,
    name: string,
    campus: string,
    codeOfCourse: string
}

export interface CoordinatorRequestDTO {
    id: string,
    name: string,
    email: string,
    username: string,
    password: string,
    course: string
}

export interface CoordinatorResponseDTO {
    id: string,
    name: string,
    email: string,
    username: string,
    password: string,
    course: string
}