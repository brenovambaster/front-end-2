import axios from 'axios';
import { ProfessorResponseDTO, ProfessorRequestDTO } from '../types';
import { api } from '../service/api';


const BASE_URL = 'http://localhost:8080/professor';

export class ProfessorService {
    static async getProfessors(): Promise<ProfessorResponseDTO[]> {
        try {
            const response = await api.get<ProfessorResponseDTO[]>(BASE_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching professors:', error);
            return [];
        }
    }

    static async createProfessor(professor: ProfessorRequestDTO): Promise<ProfessorResponseDTO> {
        try {
            const response = await api.post<ProfessorResponseDTO>(BASE_URL, professor);
            return response.data;
        } catch (error) {
            console.error('Error creating professor:', error);
            throw error;
        }
    }

    static async updateProfessor(professor: ProfessorRequestDTO): Promise<ProfessorResponseDTO> {
        try {
            const response = await api.put<ProfessorResponseDTO>(`${BASE_URL}/${professor.id}`, professor);
            return response.data;
        } catch (error) {
            console.error('Error updating professor:', error);
            throw error;
        }
    }

    static async deleteProfessor(id: string): Promise<void> {
        try {
            await api.delete(`${BASE_URL}/${id}`);
        } catch (error) {
            console.error('Error deleting professor:', error);
            throw error;
        }
    }

    static async deleteProfessors(ids: string[]): Promise<void> {
        try {
            await Promise.all(ids.map(id => api.delete(`${BASE_URL}/${id}`)));
        } catch (error) {
            console.error('Error deleting professors:', error);
            throw error;
        }
    }
}
