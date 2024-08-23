import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { setCookie, parseCookies } from "nookies";
import { ReactNode } from "react";
import { api } from "@/service/api";

const BASE_URL = 'http://localhost:8080/authenticate';

type SignInData = {
    email: string;
    password: string;
}

type User = {
    name: string;
    email: string;
}

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    signIn: (data: SignInData) => Promise<boolean>;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {

    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const { 'rtcc.token': token } = parseCookies();

        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    async function signIn({ email, password }: SignInData) {

        try {
            const credentials = btoa(`${email}:${password}`);
            const response = await axios.post<any>(BASE_URL, {}, {
                headers: {
                    'Authorization': `Basic ${credentials}`
                }
            });

            setCookie(undefined, 'rtcc.token', response.data, {
                maxAge: 60 * 60 * 1, // 1 hora
            });
            console.log(response);
            api.defaults.headers['Authorization'] = `Bearer ${response.data}`;

            setUser({
                name: response.data.name,
                email: email,
            });

            setIsAuthenticated(true);
            return true;

        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                setIsAuthenticated(false);
                alert("Credenciais incorretas, tente novamente.");
            } else {
                console.error("Erro ao autenticar:", error);
            }

            return false;
        }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
            {children}
        </AuthContext.Provider>
    );
}
