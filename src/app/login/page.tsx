'use client';
import React, { useState, useContext } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [authError, setAuthError] = useState(""); // Estado para mensagens de erro de autenticação

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
    // if (validateEmail(email)) {
      setEmailError("");
      const success = await signIn({ email, password });

      if (success) {
        console.log("Authenticated");
        router.push("/");
      } else {
        setAuthError("Usuário ou senha incorretos."); // Definir a mensagem de erro
      }
    // } else {
    //   setEmailError("Por favor, insira um e-mail válido.");
    // }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-white">
      <div className="w-full md:w-1/2 lg:w-1/3 shadow-lg rounded-lg p-8">
        <div className="text-center mb-4">
          <img
            src="/rtcc-if-logo.png"
            alt="Logo"
            className="w-48 mx-auto"
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
              className="w-full"
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
            <InputText
              id="password"
              type={passwordVisible ? "text" : "password"}
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pr-12"
              style={{ width: '100%' }}
            />
            <button
              type="button"
              onClick={handlePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center px-2"
              style={{ top: '50%', transform: 'translateY(-50%)', height: '2.5rem', width: '2.5rem' }}
            >
              {passwordVisible ? (
                <FaEye className="text-gray-500 text-base" />
              ) : (
                <FaEyeSlash className="text-gray-500 text-base" />
              )}
            </button>
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
          {authError && <p className="text-red-500 text-sm mt-2">{authError}</p>}
        </div>

        
        <p className="mt-6 text-center text-gray-500">
          Ainda não tem uma conta?{" "}
          <a
            href="#"
            className="text-black hover:underline font-medium"
          >
            Inscreva-se
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
