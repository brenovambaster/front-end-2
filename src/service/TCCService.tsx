import axios from 'axios';
import { FilterTCCRequestDTO, TCCRequestDTO, TCCResponseDTO } from '../types';
import { api } from '../service/api';
import { get } from 'http';


const BASE_URL = 'http://localhost:8080/tcc';

export class TCCService {
    

    static async searchTCCs(query: string): Promise<TCCResponseDTO[]> {
        try {
            const response = await api.get<TCCResponseDTO[]>(BASE_URL + query);
            return response.data;
        } catch (error) {
            console.error('Error fetching TCCs:', error);
            throw new Error('Erro ao buscar TCCs: ' + error.message);
        }
    }

    static async filterTCCs(filter: { filter: string, value: string }): Promise<TCCResponseDTO[]> {
        try {
            const response = await api.post<TCCResponseDTO[]>('http://localhost:8080/tcc/filter', filter);
            return response.data;
        } catch (error) {
            throw new Error('Erro ao buscar TCCs: ' + error.message);
        }
    }

    static async getTCC(id: string): Promise<TCCResponseDTO> {
        try {
            const response = await api.get<TCCResponseDTO>(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching TCC:', error);
            throw new Error('Erro ao buscar TCC: ' + error.message);
        }
    }

    static async getTCCs(): Promise<TCCResponseDTO[]> {
        try {
            const response = await api.get<TCCResponseDTO[]>(BASE_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching TCCs:', error);
            return [];
        }
    }

    static async getMostLikedTCCs(): Promise<TCCResponseDTO[]> {
        try {
            const response = await api.get<TCCResponseDTO[]>(BASE_URL + '/like/most-liked');
            return response.data;
        } catch (error) {
            console.error('Error fetching TCCs:', error);
            return [];
        }
    }

    static async getMostFavoritedTCCs(): Promise<TCCResponseDTO[]> {
        try {
            const response = await api.get<TCCResponseDTO[]>(BASE_URL + '/favorite/most-favorited');
            return response.data;
        } catch (error) {
            console.error('Error fetching TCCs:', error);
            return [];
        }
    }

    static async createTCC(formData: FormData): Promise<TCCResponseDTO> {
        try {
            const response = await api.post(BASE_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;

        } catch (error) {
            console.error('Error creating TCC:', error);
            throw error;
        }
    }

    static async updateTCC(formData: any): Promise<TCCResponseDTO> {
        try {
            const tccData = formData.get('tccData');

            const parsedTCCData = JSON.parse(tccData);

            const response = await api.put<TCCResponseDTO>(`${BASE_URL}/${parsedTCCData.id}`, formData);
            return response.data;
        } catch (error) {
            console.error('Error updating TCC:', error);
            throw error;
        }
    }

    static async deleteTCC(id: string): Promise<void> {
        try {
            await api.delete(`${BASE_URL}/${id}`);
        } catch (error) {
            console.error('Error deleting TCC:', error);
            throw error;
        }
    }

    static async deleteTCCs(ids: string[]): Promise<void> {
        try {
            await Promise.all(ids.map(id => api.delete(`${BASE_URL}/${id}`)));
        } catch (error) {
            console.error('Error deleting TCCs:', error);
            throw error;
        }
    }
}
