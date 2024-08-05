import axios from 'axios';
import { ProfessorResponseDTO, ProfessorRequestDTO } from '../types';

const BASE_URL = 'http://localhost:8080/professor';

export class ProfessorService {
    static async getProfessors(): Promise<ProfessorResponseDTO[]> {
        try {
            const response = await axios.get<ProfessorResponseDTO[]>(BASE_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching professors:', error);
            // throw error;
            return [];
        }
    }

    static async createProfessor(professor: ProfessorRequestDTO): Promise<ProfessorResponseDTO> {
        try {
            const response = await axios.post<ProfessorResponseDTO>(BASE_URL, professor);
            return response.data;
        } catch (error) {
            console.error('Error creating professor:', error);
            throw error;
        }
    }

    static async updateProfessor(professor: ProfessorRequestDTO): Promise<ProfessorResponseDTO> {
        try {
            const response = await axios.put<ProfessorResponseDTO>(`${BASE_URL}/${professor.id}`, professor);
            return response.data;
        } catch (error) {
            console.error('Error updating professor:', error);
            throw error;
        }
    }

    static async deleteProfessor(id: string): Promise<void> {
        try {
            await axios.delete(`${BASE_URL}/${id}`);
        } catch (error) {
            console.error('Error deleting professor:', error);
            throw error;
        }
    }

    static async deleteProfessors(ids: string[]): Promise<void> {
        try {
            await Promise.all(ids.map(id => axios.delete(`${BASE_URL}/${id}`)));
        } catch (error) {
            console.error('Error deleting professors:', error);
            throw error;
        }
    }
}
