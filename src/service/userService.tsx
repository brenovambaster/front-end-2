
import { CoordinatorResponseDTO, CoordinatorRequestDTO } from '../types';
import { api } from '../service/api';
import { UserRequestDTO, UserResponseDTO } from '../types';

const BASE_URL = 'http://localhost:8080/academic';

export class UserService {
    static async getUser(): Promise<UserResponseDTO> {
        try {
            const response = await api.get(BASE_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    static async getUsers(): Promise<[]> {
        try {
            const response = await api.get(BASE_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    }

    static async createUser(user: UserRequestDTO): Promise<UserResponseDTO> {
        try {
            const response = await api.post<UserResponseDTO>(BASE_URL, user);
            return response.data;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }
}