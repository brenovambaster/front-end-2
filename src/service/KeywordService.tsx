import axios from 'axios';
import { KeywordDTO} from '../types';

const BASE_URL = 'http://localhost:8080/keywords';

export class KeywordService {

    static async getKeywords(): Promise<KeywordDTO[]> {
        try {
            const response = await axios.get<KeywordDTO[]>(BASE_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching courses:', error);
            return [];
        }
    }
}
