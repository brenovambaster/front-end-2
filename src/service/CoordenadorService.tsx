
import { CoordinatorResponseDTO, CoordinatorRequestDTO } from '../types';
import { api } from '../service/api';
import { json } from 'stream/consumers';

const BASE_URL = 'http://localhost:8080/coordinator';

export class CoordenadorService {
    static async getCoordenador(id: string): Promise<CoordinatorResponseDTO> {
        try {
            const response = await api.get<CoordinatorResponseDTO>(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching coordenador:', error);
            throw error;
        }
    }

    static async getCoordenadors(): Promise<CoordinatorResponseDTO[]> {
        try {
            const response = await api.get(BASE_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching coordenadors:', error);
            return [];
        }
    }

    static async createCoordenador(coordenador: CoordinatorRequestDTO): Promise<CoordinatorResponseDTO> {
        coordenador.course = coordenador.course.id;
        console.log("response");

        try {

            const response = await api.post<CoordinatorResponseDTO>(BASE_URL, coordenador);
            return response.data;
        } catch (error) {
            console.error('Error creating coordenador:', error);
            throw error;
        }
    }

    static async updateCoordenador(coordenador: CoordinatorRequestDTO): Promise<CoordinatorResponseDTO> {
        console.log(JSON.stringify(coordenador));
        try {
            const response = await api.put<CoordinatorResponseDTO>(`${BASE_URL}/${coordenador.id}`, coordenador);
            return response.data;
        } catch (error) {
            console.error('Error updating coordenador:', error);
            throw error;
        }
    }

    static async deleteCoordenador(id: string): Promise<void> {
        try {
            await api.delete(`${BASE_URL}/${id}`);
        } catch (error) {
            console.error('Error deleting coordenador:', error);
            throw error;
        }
    }

    static async deleteCoordenadors(ids: string[]): Promise<void> {
        try {
            await Promise.all(ids.map(id => api.delete(`${BASE_URL}/${id}`)));
        } catch (error) {
            console.error('Error deleting coordenadors:', error);
            throw error;
        }
    }
}
