import axios from 'axios';
import { CursoResponseDTO, CursoRequestDTO } from '../types';
import { api } from '../service/api';


const BASE_URL = 'http://localhost:8080/course';

export class CursoService {
    static async getCursos(): Promise<CursoResponseDTO[]> {
        try {
            const response = await api.get<CursoResponseDTO[]>(BASE_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching courses:', error);
            // throw error;
            return [];
        }
    }

    static async createCurso(curso: CursoRequestDTO): Promise<CursoResponseDTO> {
        try {
            const response = await api.post<CursoResponseDTO>(BASE_URL, curso);
            return response.data;
        } catch (error) {
            console.error('Error creating course:', error);
            throw error;
        }
    }

    static async updateCurso(curso: CursoRequestDTO): Promise<CursoResponseDTO> {
        try {
            const response = await api.put<CursoResponseDTO>(`${BASE_URL}/${curso.id}`, curso);
            return response.data;
        } catch (error) {
            console.error('Error updating course:', error);
            throw error;
        }
    }

    static async deleteCurso(id: string): Promise<void> {
        try {
            await api.delete(`${BASE_URL}/${id}`);
        } catch (error) {
            console.error('Error deleting course:', error);
            throw error;
        }
    }

    static async deleteCursos(ids: string[]): Promise<void> {
        try {
            await Promise.all(ids.map(id => api.delete(`${BASE_URL}/${id}`)));
        } catch (error) {
            console.error('Error deleting courses:', error);
            throw error;
        }
    }
}
