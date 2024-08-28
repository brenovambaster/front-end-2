import axios from 'axios';
import { KeywordDTO} from '../types';
import { api } from '../service/api';


const BASE_URL = 'http://localhost:8080/keywords';

export class KeywordService {

    static async getKeywords(): Promise<KeywordDTO[]> {
        try {
            const response = await api.get<KeywordDTO[]>(BASE_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching courses:', error);
            return [];
        }
    }
}
