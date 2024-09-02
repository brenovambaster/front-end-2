
import { api } from '../service/api';
import { UserRequestDTO, UserResponseDTO, UserUpdatePasswordRequestDTO } from '../types';

const BASE_URL = 'http://localhost:8080/academic';
const PASSWORD_BASE_URL = 'http://localhost:8080/user/change-password/';
const RECOVER_PASSWORD_BASE_URL = 'http://localhost:8080/user/reset-password';
const TCC_BASE_URL = 'http://localhost:8080/tcc';

export class UserService {
    static async getUser(id: string): Promise<UserResponseDTO> {
        try {
            const response = await api.get(BASE_URL + `/${id}`);
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
            const response = await api.put<UserResponseDTO>(BASE_URL + `/${user.id}`, user);
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

    static async recoverPassword(email: string) {
        try {
            const url = `${RECOVER_PASSWORD_BASE_URL}?email=${encodeURIComponent(email)}`;
            const response = await api.put<UserResponseDTO>(url);
            return response.status;

        } catch (error) {
            console.error('Error recovering password:', error);
            return error.response?.status;
        }
    }

    static async likeTCC(academicId: string, tccId: string) {
        try {
            const response = await api.post(`${TCC_BASE_URL}/like/add`, { academicId, tccId });
            
            return response;
        } catch (error) {
            console.error('Error liking TCC:', error);
            return error.response?.status;
        }
    }

    static async unlikeTCC(academicId: string, tccId: string) {
        try {
            const response = await api.post(`${TCC_BASE_URL}/like/remove`, { academicId, tccId });
            return response.data;
        } catch (error) {
            console.error('Error unliking TCC:', error);
            return error.response?.status;
        }
    }

    static async favoriteTCC(academicId: string, tccId: string) {
        try {
            const response = await api.post(`${TCC_BASE_URL}/favorites/add`, { academicId, tccId });
            return response.data;
        } catch (error) {
            console.error('Error favoriting TCC:', error);
            return error.response?.status;
        }
    }

    static async unfavoriteTCC(academicId: string, tccId: string) {
        try {
            const response = await api.post(`${TCC_BASE_URL}/favorites/remove`, { academicId, tccId });
            return response.data;
        } catch (error) {
            console.error('Error unfavoriting TCC:', error);
            return error.response?.status;
        }
    }

    static async getLikedTCCs(academicId: string) {
        try {
            const response = await api.get(`${TCC_BASE_URL}/like/by-academic?academicId=${academicId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching liked TCCs:', error);
            return [];
        }
    }

    static async getFavoritedTCCs(academicId: string) {
        try {
            const response = await api.get(`${TCC_BASE_URL}/favorites/by-academic?academicId=${academicId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching favorited TCCs:', error);
            return [];
        }
    }
}