'use client';
import React, { useState, useContext, useRef, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Toast } from "primereact/toast";
import { UserService } from "@/service/userService";
import { Dialog } from "primereact/dialog";

function Login() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [authError, setAuthError] = useState("");
    const toast = useRef<Toast>(null);
    const [isReady, setIsReady] = useState(false);
    const [visible, setVisible] = useState(false);

    const { signIn, isAuthenticated } = useContext(AuthContext);
    const router = useRouter();

    if (isAuthenticated) {
        router.push("/");
    }

    useEffect(() => {
        setTimeout(() => setIsReady(true), 50);
    }, []);

    const validateEmail = (email: string) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@(aluno\.)?ifnmg\.edu\.br$/;
        return emailRegex.test(email);
    };

    const handleSignIn = async () => {
        setEmailError("");
        setPasswordError("");
        setAuthError("");

        if (!email) {
            if (!email) setEmailError("Campo obrigatório.");
            return;
        }

        if (!validateEmail(email)) {
            setEmailError('São permitidos apenas @aluno.ifnmg.edu.br ou @ifnmg.edu.br');
            return;
        }

        const statusResponse = await UserService.recoverPassword(email.trim())
        
        if(statusResponse == 200) {
            setVisible(true);
        } else if(statusResponse == 400) {
            setEmailError("E-mail não cadastrado.");
        }else if(statusResponse == undefined) {
            toast.current?.show({ severity: "error", summary: "Erro", detail: "Ocorreu um erro durante a operação." });

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

                    <div>
                        <Button
                            type="button"
                            onClick={handleSignIn}
                            label="Enviar Nova Senha"
                            className="w-full text-white font-semibold py-2 rounded-md hover:bg-gray-800 transition duration-300 mt-6"
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
                </div>

                <p className="mt-6 text-center text-gray-500">
                    Lembrou a senha?{" "}
                    <a
                        href="/login"
                        className="text-black hover:underline font-medium"
                        style={{ color: '#cc9747' }}
                    >
                        Fazer Login
                    </a>
                </p>
            </div>
            <Dialog
                visible={visible}
                onHide={
                    () => {
                        setVisible(false);
                        window.location.href = '/login';
                    }
                }
                footer={
                    <button className="">
                    </button>
                }
                className="text-center"
                style={{ width: '350px' }}
            >
                <i className="pi pi-envelope text-4xl text-blue-500 mb-4" style={{ color: '#2b2d39' }}></i>
                <p className="m-0 text-lg mt-4 ">Uma e-mail com a nova senha foi enviado!</p>
            </Dialog>
            <div className="card flex justify-content-center">
                <Toast ref={toast} position="bottom-right" />
            </div>
        </div>
    );
}

export default Login;