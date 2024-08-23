import { api } from "@/service/api";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { parseCookies, setCookie } from "nookies";
import { createContext, ReactNode, useEffect, useState } from "react";

const BASE_URL = 'http://localhost:8080/authenticate';

type SignInData = {
    email: string;
    password: string;
};

type User = {
    name: string;
    email: string;
    roles: string[];
};

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    signIn: (data: SignInData) => Promise<boolean>;
};

interface DecodedToken {
    sub: string;
    user_name: string;
    scope: string;
    iss: string;
    exp: number;
    iat: number;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const { 'rtcc.token': token } = parseCookies();

        if (token) {
            try {
                const decodedToken = jwtDecode<DecodedToken>(token);
                const roles = decodedToken.scope.split(' ');

                const userData = {
                    name: decodedToken.user_name,
                    email: decodedToken.sub,
                    roles: roles
                };

                setUser(userData);
                setIsAuthenticated(true);
                api.defaults.headers['Authorization'] = `Bearer ${token}`;
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
                setIsAuthenticated(false);
            }
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

            const token = response.data;
            const decodedToken = jwtDecode<DecodedToken>(token);
            const roles = decodedToken.scope.split(' ');

            const userData = {
                name: decodedToken.user_name,
                email: decodedToken.sub,
                roles: roles
            };

            setUser(userData);
            setCookie(undefined, 'rtcc.token', token, {
                maxAge: 60 * 60 * 1, // 1 hora
            });

            api.defaults.headers['Authorization'] = `Bearer ${token}`;
            setIsAuthenticated(true);

            return true;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                setIsAuthenticated(false);
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
