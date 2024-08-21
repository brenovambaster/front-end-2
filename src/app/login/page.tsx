import React from "react";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

function Login() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md p-8 border border-gray-300 rounded-lg bg-white shadow-md">
                <div className="space-y-8">
                    <div className="space-y-4 text-center">
                        <h1 className="text-4xl font-bold">Login</h1>
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <label
                                className="text-lg font-medium leading-none"
                                htmlFor="email"
                            >
                                Email
                            </label>
                            <InputText
                                id="email"
                                placeholder="m@exemplo.com"
                                type="email"
                                className="w-full p-3 text-base border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-4">
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
                                id="password"
                                placeholder="********"
                                type="password"
                                className="w-full p-3 text-base border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <Button
                            label="Entrar"
                            type="submit"
                            className="w-full py-2 text-lg font-medium bg-black text-white hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        />

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
