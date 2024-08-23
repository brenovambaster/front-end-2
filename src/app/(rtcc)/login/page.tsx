'use client';

import React, { useContext, useState } from "react";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // Estado para armazenar a mensagem de erro

    const { signIn } = useContext(AuthContext);
    const router = useRouter();

    async function handleSignIn() {
        const success = await signIn({ email, password });

        if (success) {
            console.log("Authenticated");
            router.push("/");
        } else {
            setError("Usuário ou senha incorretos."); // Definir a mensagem de erro
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md p-8 border border-gray-300 rounded-lg bg-white shadow-md">
                <div className="space-y-8">
                    <div className="space-y-4 text-center">
                        <h1 className="text-4xl font-bold">Login</h1>
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label
                                className="text-lg font-medium leading-none"
                                htmlFor="email"
                            >
                                E-mail
                            </label>
                            <InputText
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                id="email"
                                placeholder="mail@ifnmg.edu.br"
                                type="email"
                                className="w-full p-3 text-base border border-gray-300 rounded-md focus:border-black focus:ring-2 focus:ring-black"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <label
                                    className="text-lg font-medium leading-none"
                                    htmlFor="password"
                                >
                                    Senha
                                </label>
                                <a className="ml-auto text-sm underline hover:text-blue-500" href="#">
                                    Esqueceu sua senha?
                                </a>
                            </div>
                            <InputText
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                id="password"
                                placeholder="********"
                                type="password"
                                className="w-full p-3 text-base border border-gray-300 rounded-md focus:border-black focus:ring-2 focus:ring-black"
                            />
                            {error && (
                                <p className="text-red-600 text-sm mt-2">
                                    {error}
                                </p>
                            )}
                        </div>
                        <Button
                            label="Entrar"
                            onClick={handleSignIn}
                            className="w-full py-2 text-lg font-medium bg-black text-white hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
