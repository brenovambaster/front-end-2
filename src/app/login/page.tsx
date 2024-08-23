'use client';
import React, { useState, useContext, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Toast } from "primereact/toast";

function Login() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [authError, setAuthError] = useState("");
    const toast = useRef<Toast>(null);

    const { signIn } = useContext(AuthContext);
    const router = useRouter();

    const handlePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSignIn = async () => {
        setEmailError("");
        setPasswordError("");
        setAuthError("");

        const [authenticated, serverConexionError] = await signIn({ email, password });

        if (!email || !password) {
            if (!email) setEmailError("Campo obrigatório.");
            if (!password) setPasswordError("Campo obrigatório.");
            return;
        }

        if (authenticated) {
            console.log("Authenticated");
            router.push("/");
        } else {
            if (!serverConexionError) {
                setAuthError("Usuário ou senha incorretos.");
            } else {
                toast.current?.show({ severity: 'error', detail: 'Ocorreu um erro ao realizar a operação.', life: 5000 });
            }
        }
    };

    return (
        <div className="flex h-screen justify-center items-center bg-white">
            <div className="w-full md:w-1/2 lg:w-1/3 shadow-lg rounded-lg p-8">
                <div className="text-center mb-4">
                    <img
                        src="/nova-logo-rtcc-if-logo.png"
                        alt="Logo"
                        className="w-30 mx-auto"
                        width="250"
                        height="250"
                    />
                </div>

                <div className="space-y-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            E-mail
                        </label>
                        <InputText
                            id="email"
                            type="email"
                            placeholder="Digite seu e-mail"
                            className="w-full bg-white border border-gray-300 focus:outline-none focus:ring-0 focus:border-black"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%' }}
                        />
                        {emailError && <p className="text-red-500 text-sm mt-2">{emailError}</p>}
                    </div>

                    <div className="relative">
                        <label
                            htmlFor="password"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            Senha
                        </label>
                        <div className="relative w-full">
                            <InputText
                                id="password"
                                type={passwordVisible ? "text" : "password"}
                                placeholder="Digite sua senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pr-12 bg-white border border-gray-300 focus:outline-none focus:ring-0 focus:border-black"
                                style={{ width: '100%' }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSignIn();
                                    }
                                }}
                            />
                            <button
                                type="button"
                                onClick={handlePasswordVisibility}
                                className="absolute inset-y-0 right-0 flex items-center px-3"
                                style={{ top: '50%', transform: 'translateY(-50%)' }}
                            >
                                {passwordVisible ? (
                                    <FaEye className="text-gray-500 text-base" />
                                ) : (
                                    <FaEyeSlash className="text-gray-500 text-base" />
                                )}
                            </button>
                        </div>
                        {passwordError && <p className="text-red-500 text-sm mt-2">{passwordError}</p>}
                        {authError && <p className="text-red-500 text-sm mt-2">{authError}</p>}

                        <div className="text-right mt-2">
                            <a
                                href="#"
                                className="text-black hover:underline text-sm font-medium"
                            >
                                Esqueceu a senha?
                            </a>
                        </div>
                    </div>

                    <Button
                        type="button"
                        onClick={handleSignIn}
                        label="Entrar"
                        className="w-full bg-black text-white font-semibold py-2 rounded-md hover:bg-gray-800 transition duration-300"
                        style={{ width: '100%' }}
                    />
                </div>

                <p className="mt-6 text-center text-gray-500">
                    Ainda não tem uma conta?{" "}
                    <a
                        href="#"
                        className="text-black hover:underline font-medium"
                    >
                        Cadastre-se
                    </a>
                </p>
            </div>
            <div className="card flex justify-content-center">
                <Toast ref={toast} position="bottom-right" />
            </div>
        </div>
    );
}

export default Login;

