"use client";

import { AuthContext } from '@/contexts/AuthContext';
import { CursoService } from '@/service/cursoService';
import { UserService } from '@/service/userService';
import { UserRequestDTO } from '@/types';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useContext, useEffect, useRef, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Register() {
    const [name, setName] = useState('');
    const [course, setCourse] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [courses, setCourses] = useState<{ label: string; value: string; }[]>([]);
    const [isReady, setIsReady] = useState(false);
    const toast = useRef<Toast>(null);
    const [errors, setErrors] = useState({
        name: '',
        course: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [visible, setVisible] = useState(false);

    const { signIn, isAuthenticated } = useContext(AuthContext);
    const router = useRouter();

    if (isAuthenticated) {
        router.push("/");
    }


    useEffect(() => {
        CursoService.getCursos().then(data => {
            const transformedCourses = data.map(transformCourse);
            setCourses(transformedCourses);
        });

        setTimeout(() => setIsReady(true), 50);
    }, []);

    const transformCourse = (course: { id: string; name: string; codeOfCourse: string }) => {
        return { label: course.name, value: course.id };
    };

    const handlePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const validateForm = () => {
        const newErrors = {
            name: '',
            course: '',
            email: '',
            password: '',
            confirmPassword: '',
        };

        const emailRegex = /^[a-zA-Z0-9._%+-]+@(aluno\.)ifnmg\.edu\.br$/;

        if (!name) newErrors.name = 'O campo nome não pode ficar em branco.';
        if (!course) newErrors.course = 'O campo curso não pode ficar em branco.';
        if (!email) {
            newErrors.email = 'O campo e-mail não pode ficar em branco.';
        } else if (!emailRegex.test(email)) {
            newErrors.email = 'São permitidos apenas @aluno.ifnmg.edu.br.';
        }
        if (!password) newErrors.password = 'O campo senha não pode ficar em branco.';
        if (!confirmPassword) newErrors.confirmPassword = 'O campo confirmar senha não pode ficar em branco.';
        if (password && confirmPassword && password !== confirmPassword) {
            newErrors.confirmPassword = 'As senhas não conferem.';
        }

        if(password.length > 0 && password.length < 8) newErrors.password = 'A senha deve ter no mínimo 8 caracteres.';

        if(confirmPassword.length > 0 && confirmPassword.length < 8) newErrors.confirmPassword = 'A senha deve ter no mínimo 8 caracteres.';

        setErrors(newErrors);
        return Object.values(newErrors).every(error => error === '');
    };

    const handleRegister = async () => {
        if (validateForm()) {
            const userRequest: UserRequestDTO = { id: '', name, course, email, password };

            try {
                const response = await UserService.createUser(userRequest);
                setVisible(true);
            } catch (error) {
                toast.current?.show({ severity: 'error', detail: 'E-mail já cadastrado.', life: 5000 });
            }
        }
    };

    return (
        <div className="flex h-screen justify-center items-center bg-gray-100" style={{ visibility: isReady ? 'visible' : 'hidden' }}>
            <div className="w-full max-w-2xl border border-gray-300 shadow-xl rounded-lg p-8 bg-white" style={{ boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.25)" }} >
                <div className="text-center mb-4">
                    <a href="/">
                        <img
                            src="/nova-logo-rtcc-if-logo.png"
                            alt="Logo"
                            className="w-30 mx-auto"
                            width="200"
                            height="200"
                        />
                    </a>
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        {errors.name && (
                            <p className="absolute top-[-1.5rem] right-0 text-red-500 text-sm mt-2">{errors.name}</p>
                        )}
                        <label htmlFor="name" className="block text-gray-700 font-medium mb-2" style={{ color: '#231F20' }}>Nome</label>
                        <InputText
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Seu nome completo"
                            className="w-full bg-white border border-gray-300 focus:outline-none focus:ring-0 focus:border-black"
                        />
                    </div>

                    <div className="relative">
                        {errors.course && (
                            <p className="absolute top-[-1.5rem] right-0 text-red-500 text-sm mt-2">{errors.course}</p>
                        )}
                        <label htmlFor="course" className="block text-gray-700 font-medium mb-2" style={{ color: '#231F20' }}>Curso</label>
                        <Dropdown
                            id="course"
                            value={course}
                            onChange={(e) => setCourse(e.value)}
                            options={courses}
                            placeholder="Selecione seu curso"
                            className="w-full bg-white border border-gray-300 focus:outline-none focus:ring-0 focus:border-black"
                        />

                    </div>

                    <div className="relative">
                        {errors.email && (
                            <p className="absolute top-[-1.5rem] right-0 text-red-500 text-sm mt-2">{errors.email}</p>
                        )}
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2" style={{ color: '#231F20' }}>E-mail</label>
                        <InputText
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Seu email"
                            className="w-full bg-white border border-gray-300 focus:outline-none focus:ring-0 focus:border-black"
                        />

                    </div>

                    <div className="relative">
                        {errors.password && (
                            <p className="absolute top-[-1.5rem] right-0 text-red-500 text-sm mt-2">{errors.password}</p>
                        )}
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-2" style={{ color: '#231F20' }}>Senha</label>
                        <div className="relative w-full">
                            <InputText
                                id="password"
                                type={passwordVisible ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Sua senha"
                                className="w-full pr-12 bg-white border border-gray-300 focus:outline-none focus:ring-0 focus:border-black"
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

                    </div>

                    <div className="relative">
                        {errors.confirmPassword && (
                            <p className="absolute top-[-1.5rem] right-0 text-red-500 text-sm mt-2">{errors.confirmPassword}</p>
                        )}
                        <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2" style={{ color: '#231F20' }}>Confirmar Senha</label>
                        <div className="relative w-full">
                            <InputText
                                id="confirmPassword"
                                type={confirmPasswordVisible ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirme sua senha"
                                className="w-full pr-12 bg-white border border-gray-300 focus:outline-none focus:ring-0 focus:border-black"
                            />
                            <button
                                type="button"
                                onClick={handleConfirmPasswordVisibility}
                                className="absolute inset-y-0 right-0 flex items-center px-3"
                                style={{ top: '50%', transform: 'translateY(-50%)' }}
                            >
                                {confirmPasswordVisible ? (
                                    <FaEye className="text-gray-500 text-base" />
                                ) : (
                                    <FaEyeSlash className="text-gray-500 text-base" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <Button
                    label="Cadastrar"
                    onClick={handleRegister}
                    className="w-full bg-black text-white font-semibold py-2 rounded-md hover:bg-gray-800 transition duration-300 mt-8 border-black"
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

                <p className="mt-6 text-center text-gray-500">
                    Já tem uma conta?{" "}
                    <a href="/login" className="hover:underline font-medium" style={{ color: '#cc9747' }}>
                        Faça login
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
                <p className="m-0 text-lg mt-4 ">Um e-mail para a ativação da conta foi enviado!</p>
            </Dialog>
            <div className="card flex justify-content-center">
                <Toast ref={toast} position="bottom-right" />
            </div>
        </div>
    );
}
