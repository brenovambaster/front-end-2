'use client';
import React, { useState, useContext, useRef, useEffect } from "react";
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
    const [isReady, setIsReady] = useState(false);

    const { signIn, isAuthenticated } = useContext(AuthContext);
    const router = useRouter();

    if (isAuthenticated) {
        router.push("/");
    }

    useEffect(() => {
        setTimeout(() => setIsReady(true), 50);
    }, []);

    const handlePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const validateEmail = (email: string) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@(aluno\.)?ifnmg\.edu\.br$/;
        return emailRegex.test(email);
    };

    const handleSignIn = async () => {
        setEmailError("");
        setPasswordError("");
        setAuthError("");

        if (!email || !password) {
            if (!email) setEmailError("Campo obrigatório.");
            if (!password) setPasswordError("Campo obrigatório.");
            return;
        }

        if (!validateEmail(email)) {
            setEmailError('São permitidos apenas @aluno.ifnmg.edu.br ou @ifnmg.edu.br.');
            return;
        }
    
        const [authenticated, serverConexionError] = await signIn({ email, password });

        if (authenticated) {
            console.log("Authenticated");
            router.push("/");
        } else {
            if (!serverConexionError) {
                setAuthError("Credenciais incorretas ou e-mail não verificado.");
            } else {
                toast.current?.show({ severity: 'error', detail: 'Ocorreu um erro ao realizar a operação.', life: 5000 });
            }
        }
    };


    return (

        <div className="flex h-screen justify-center items-center bg-gray-100" style={{ visibility: isReady ? 'visible' : 'hidden' }}>

            <div className="w-full max-w-2xl border border-gray-300 rounded-lg p-8 bg-white" style={{ boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.25)" }}>
                <div className="text-center mb-4">
                    <a href="/">
                        <img
                            src="/nova-logo-rtcc-if-logo.png"
                            alt="Logo"
                            className="w-30 mx-auto"
                            width="250"
                            height="250"
                        />
                    </a>
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        <label
                            htmlFor="email"
                            className="block text-gray-700 font-medium mb-2"
                            style={{ color: '#231F20' }}
                        >
                            E-mail
                        </label>
                        <div className="relative w-full">
                            {emailError && <p className="absolute right-0 -top-6 text-red-500 text-sm">{emailError}</p>}

                            <InputText
                                id="email"
                                type="email"
                                placeholder="Digite seu e-mail"
                                className="w-full bg-white border border-gray-300 focus:outline-none focus:ring-0 focus:border-black"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSignIn();
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="relative">
                        <label
                            htmlFor="password"
                            className="block font-medium mb-2"
                            style={{ color: '#231F20' }}
                        >
                            Senha
                        </label>
                        <div className="relative w-full">
                            {passwordError && <p className="absolute right-0 -top-6 text-red-500 text-sm">{passwordError}</p>}

                            <InputText
                                id="password"
                                type={passwordVisible ? "text" : "password"}
                                placeholder="Digite sua senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pr-12 bg-white border border-gray-300 focus:outline-none focus:ring-0 focus:border-black"
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
                        {authError && <p className="text-red-500 text-sm mt-2">{authError}</p>}
                        <div className="text-right mt-4">
                            <a
                                href="/recuperar-senha"
                                className="hover:underline text-sm font-medium"
                                style={{ color: '#2b2d39' }}
                            >
                                Esqueceu a senha?
                            </a>
                        </div>
                    </div>

                    <Button
                        type="button"
                        onClick={handleSignIn}
                        label="Entrar"
                        className="w-full text-white font-semibold py-2 rounded-md hover:bg-gray-800 transition duration-300"
                        style={{
                            backgroundColor: '#2b2d39',
                            borderColor: '#2b2d39',
                            color: 'white',
                            transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
                            borderWidth: '1px',
                            borderStyle: 'solid'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#1d1d2c';
                            e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#2b2d39';
                            e.currentTarget.style.color = 'white';
                        }}
                    />


                </div>

                <p className="mt-6 text-center text-gray-500">
                    Ainda não possui uma conta?{" "}
                    <a
                        href="/signup"
                        className="text-black hover:underline font-medium"
                        style={{ color: '#cc9747' }}
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
