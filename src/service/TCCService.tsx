import axios from 'axios';
import { FilterTCCRequestDTO, TCCRequestDTO, TCCResponseDTO } from '../types';

const BASE_URL = 'http://localhost:8080/tcc';

export class TCCService {

    static async searchTCCs(query: string): Promise<TCCResponseDTO[]> {
        try {
            const response = await axios.get<TCCResponseDTO[]>(BASE_URL+query);
            return response.data;
        } catch (error) {
            console.error('Error fetching TCCs:', error);
            return [];
        }
    }

    static async filterTCCs(filter: FilterTCCRequestDTO): Promise<TCCResponseDTO[]> {
        try {
            const response = await axios.get<TCCResponseDTO[]>(BASE_URL, {
                params: filter
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching TCCs:', error);
            return [];
        }
    }
    

    static async getTCCs(): Promise<TCCResponseDTO[]> {
        try {
            const response = await axios.get<TCCResponseDTO[]>(BASE_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching TCCs:', error);
            return [];
        }
    }

    static async createTCC(formData: FormData): Promise<TCCResponseDTO> {
        try {
            const response = await axios.post(BASE_URL, formData, {
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

            const tccData = formData.get('tccData'); // Obtém o JSON como string

            const parsedTCCData = JSON.parse(tccData); // Converte a string JSON de volta para um objeto
            console.log("ID:", parsedTCCData.id); // Acessa o ID

            const response = await axios.put<TCCResponseDTO>(`${BASE_URL}/${parsedTCCData.id}`, formData);
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
