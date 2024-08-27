
import { api } from '../service/api';
import { UserRequestDTO, UserResponseDTO, UserUpdatePasswordRequestDTO } from '../types';

const BASE_URL = 'http://localhost:8080/academic/';
const PASSWORD_BASE_URL = 'http://localhost:8080/user/change-password/';


export class UserService {
    static async getUser(id: string): Promise<UserResponseDTO> {
        try {
            alert(BASE_URL + `${id}`);
            const response = await api.get(BASE_URL + `${id}`);
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

    static async updateUser(user: UserRequestDTO): Promise<UserResponseDTO> {
        try {
            const response = await api.put<UserResponseDTO>(BASE_URL + `${user.id}`, user);
            return response.data;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    static async updatePassword(user: UserUpdatePasswordRequestDTO, id: string): Promise<UserResponseDTO | null> {
        try {
            const response = await api.put<UserResponseDTO>(PASSWORD_BASE_URL + `${id}`, user);
            return response.data;
        } catch (error) {
            console.error('Error updating user:', error);
            return null;
        }
    }
}