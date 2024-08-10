import axios from 'axios';
import { TCCRequestDTO, TCCResponseDTO } from '../types';

const BASE_URL = 'http://localhost:8080/TCC';

export class TCCService {
    static async getTCCs(): Promise<TCCResponseDTO[]> {
        try {
            const response = await axios.get<TCCResponseDTO[]>(BASE_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching TCCs:', error);
            return [];
        }
    }

    static async createTCC(tcc: TCCRequestDTO): Promise<TCCResponseDTO> {
        try {
            const response = await axios.post<TCCResponseDTO>("http://localhost:8080/TCC/upload", tcc);
            return response.data;
        } catch (error) {
            console.error('Error creating TCC:', error);
            throw error;
        }
    }

    static async updateTCC(tcc: TCCRequestDTO): Promise<TCCResponseDTO> {
        try {
            const response = await axios.put<TCCResponseDTO>(`${BASE_URL}/${tcc.id}`, tcc);
            return response.data;
        } catch (error) {
            console.error('Error updating TCC:', error);
            throw error;
        }
    }

    static async deleteTCC(id: string): Promise<void> {
        try {
            await axios.delete(`${BASE_URL}/${id}`);
        } catch (error) {
            console.error('Error deleting TCC:', error);
            throw error;
        }
    }

    static async deleteTCCs(ids: string[]): Promise<void> {
        try {
            await Promise.all(ids.map(id => axios.delete(`${BASE_URL}/${id}`)));
        } catch (error) {
            console.error('Error deleting TCCs:', error);
            throw error;
        }
    }
}
