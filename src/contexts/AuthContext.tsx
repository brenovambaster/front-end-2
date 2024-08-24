import { api } from "@/service/api";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { parseCookies, setCookie } from "nookies";
import { ProgressSpinner } from "primereact/progressspinner";
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
    signIn: (data: SignInData) => Promise<boolean[]>;
    serverConexionError: boolean;
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
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        const { 'rtcc.token': token } = parseCookies();
        if (!token) {
            return false;
        }
        try {
            const decodedToken: { exp: number } = jwtDecode(token);
            const currentTime = Date.now() / 1000; // em segundos
            return decodedToken.exp > currentTime;
        } catch (error) {
            return false;
        }
    });
    const [loading, setLoading] = useState(true); 

    let serverConexionError = false;
    let authenticated = false;

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
            } finally {
                setLoading(false); 
            }
        } else {
            setLoading(false);
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

            authenticated = true;
            serverConexionError = false;
            return [authenticated, serverConexionError];

        } catch (error) {
            setIsAuthenticated(false);

            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    authenticated = false;
                    serverConexionError = false;
                } else {
                    authenticated = false;
                    serverConexionError = true;
                }
            } else {
                authenticated = false;
                serverConexionError = true;
            }

            console.error("Erro ao autenticar:", error)

            return [authenticated, serverConexionError];
        }
    }

    const LoadingComponent = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <ProgressSpinner style={{ width: '50px', height: '50px', color: 'black' }} />
            </div>
        );
    };
    
    if (loading) {
        return <LoadingComponent />;
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, serverConexionError }}>
            {children}
        </AuthContext.Provider>
    );
}
