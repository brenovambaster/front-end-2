'use client';
import { AuthContext } from '@/contexts/AuthContext';
import withUserProtection from '@/hoc/withUserProtection';
import { CoordenadorService } from '@/service/coordenadorService';
import { CursoService } from '@/service/cursoService';
import { UserService } from '@/service/userService';
import { CoordinatorRequestDTO, UserRequestDTO, UserResponseDTO, UserUpdatePasswordRequestDTO } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { TabPanel, TabView } from 'primereact/tabview';
import { Toast } from 'primereact/toast';
import { useContext, useEffect, useRef, useState } from 'react';
import { AiOutlineFileSearch } from 'react-icons/ai';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FiTrash2 } from 'react-icons/fi';



function Component() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // 4 TCCs por página
    const [totalPages, setTotalPages] = useState(0);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const [visible, setVisible] = useState(false);
    const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false);
    const [tccIdToDelete, setTccIdToDelete] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);

    const [submitted, setSubmitted] = useState(false);
    const [hoveredTCCId, setHoveredTCCId] = useState('');

    const emptyUser: UserResponseDTO = {
        id: '',
        name: '',
        email: '',
        course: ''
    }

    const [user, setUser] = useState<UserResponseDTO>(emptyUser);
    const [course, setCourse] = useState('');
    const [courses, setCourses] = useState<{ label: string; value: string }[]>([]);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const toast = useRef<Toast>(null);
    const [isReady, setIsReady] = useState(false);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [favoriteTCCs, setFavoriteTCCs] = useState<number[]>([]);
    const [passwordErrors, setPasswordErrors] = useState({
        currentPassword: '',
        password: '',
        confirmPassword: ''
    });

    const [userDetailsErrors, setUserDetailsErrors] = useState({
        name: '',
        course: ''
    });

    const { user: userContext, isAuthenticated } = useContext(AuthContext);
    const router = useRouter();
    const rolesOptions = {
        'ADMIN': 'Administrador',
        'COORDINATOR': 'Coordenador',
        'ACADEMIC': 'Acadêmico'
    }

    useEffect(() => {
        const fetchData = async () => {
            try {

                const cursosData = await CursoService.getCursos();
                if (!cursosData) {
                    router.push('/nao-encontrado');
                    return;
                }

                const transformedCourses = cursosData.map(transformCourse);
                setCourses(transformedCourses);

                let userData = null;
                if (!isAuthenticated) {
                    router.push('/nao-encontrado');
                    return;
                }

                if (getUserRole().trim() == 'Coordenador') {

                    userData = await CoordenadorService.getCoordenador(userContext.id);
                } else if (getUserRole().trim() == 'Acadêmico') {

                    userData = await UserService.getUser(userContext.id);

                    const favorites = await UserService.getFavoritedTCCs(userContext.id);

                    if (favorites) {
                        setFavoriteTCCs(favorites);
                        setTotalPages(Math.ceil(favorites.length / itemsPerPage));
                    }

                } else if (getUserRole().trim() == 'Administrador') {
                    const emptyUser: UserResponseDTO = {
                        id: userContext.id,
                        name: userContext?.name,
                        email: userContext?.email,
                        course: ''
                    }

                    setUser(emptyUser);
                    setName(userContext.name);
                    setCourse('');
                    setIsReady(true);
                    return;
                } else {
                    router.push('/nao-encontrado');
                    return;
                }


                userData.course = userData.course.id;
                setUser(userData);
                setName(userData.name);
                setCourse(userData.course);

                setIsReady(true);

            } catch (error) {
                console.error('Error fetching data:', error);
                router.push('/nao-encontrado');
            }
        };

        fetchData();

    }, [userContext.id, router]);

    useEffect(() => {
        if (!visible) {
            setActiveIndex(0);
        }
    }, [visible]);

    const getUserRole = () => {
        return rolesOptions[userContext?.roles[0]];
    }

    const transformCourse = (course: { id: string; name: string; codeOfCourse: string }) => {
        return { label: course.name, value: course.id };
    };

    const headerTemplates = (label: string, index: number) => (
        <div
            className="flex items-center gap-2 p-3 cursor-pointer"
            style={{
                borderBottom: index === activeIndex ? '2px solid black' : 'none',
                paddingBottom: '16px',
            }}
            onClick={() => setActiveIndex(index)}
        >
            <span className="font-bold whitespace-nowrap text-black">{label}</span>
        </div>
    );

    const handleCurrentPasswordVisibility = () => {
        setCurrentPasswordVisible(!currentPasswordVisible);
    }


    const handlePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const clearFields = () => {
        setCurrentPassword('');
        setPassword('');
        setConfirmPassword('');
        setSubmitted(false);

        setPasswordErrors({
            currentPassword: '',
            password: '',
            confirmPassword: ''
        });

        setUserDetailsErrors({
            name: '',
            course: ''
        });
    }

    const validateChangePassword = () => {
        const newErrors = {
            currentPassword: '',
            password: '',
            confirmPassword: '',
        };

        setPasswordErrors(newErrors);

        if (!currentPassword) newErrors.currentPassword = 'O campo senha atual não pode ficar em branco.';
        if (!password) newErrors.password = 'O campo nova senha não pode ficar em branco.';
        if (!confirmPassword) newErrors.confirmPassword = 'O campo confirmar senha não pode ficar em branco.';
        if (password && confirmPassword && password !== confirmPassword) {
            newErrors.confirmPassword = 'As senhas não conferem.';
        }

        if (password.length > 0 && password.length < 8) newErrors.password = 'A senha deve ter no mínimo 8 caracteres.';

        if ((confirmPassword.length > 0 && confirmPassword.length < 8) && !(password && confirmPassword && password !== confirmPassword)) newErrors.confirmPassword = 'A senha deve ter no mínimo 8 caracteres.';


        setPasswordErrors(newErrors);
        return Object.values(newErrors).every(error => error === '');
    }

    const handlePasswordChange = (e: any) => {

        if (validateChangePassword()) {
            const userRequest: UserUpdatePasswordRequestDTO = {
                oldPassword: currentPassword,
                newPassword: password,
                newPasswordConfirmation: confirmPassword
            };

            try {
                UserService.updatePassword(userRequest, user.id).then((response: UserResponseDTO | null) => {
                    if (response == null) {
                        const newErrors = {
                            currentPassword: 'Senha incorreta.',
                            password: '',
                            confirmPassword: '',
                        };

                        setPasswordErrors(newErrors);
                        return;
                    }

                    toast.current?.show({ severity: 'success', detail: 'Senha alterada com sucesso', life: 5000 });
                    clearFields();
                    setVisible(false);
                });
            } catch (error) {
                toast.current?.show({ severity: 'error', detail: 'Erro ao alterar senha', life: 5000 });
                clearFields();
                setVisible(false);
            }
        }
    }

    const validateChangeUserData = () => {
        const newErrors = {
            name: '',
            course: '',
        };

        if (!user.name) newErrors.name = 'O campo nome não pode ficar em branco.';
        if (!course) newErrors.course = 'O campo curso não pode ficar em branco.';

        setUserDetailsErrors(newErrors);
        return Object.values(newErrors).every(error => error === '');
    }

    const handleUserDataChange = (e: any) => {

        if (getUserRole() == 'Administrador') {
            clearFields();
            setVisible(false);
            setActiveIndex(0);
            return;
        }

        if (validateChangeUserData()) {

            try {
                if (getUserRole() == 'Coordenador') {
                    const coordinatorRequest: CoordinatorRequestDTO = {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        username: '',
                        password: confirmPassword,
                        course: course,
                    };

                    CoordenadorService.updateCoordenador(coordinatorRequest).then((response: UserResponseDTO) => {
                        if (!response) {
                            toast.current?.show({ severity: 'error', detail: 'Erro ao alterar informações', life: 5000 });
                            clearFields();
                            setVisible(false);
                            return;
                        }

                        toast.current?.show({ severity: 'success', detail: 'Informações alteradas com sucesso', life: 5000 });
                        clearFields();
                        setVisible(false);
                        setName(response.name);
                        setActiveIndex(0);
                    });
                }

                if (getUserRole() == 'Acadêmico') {
                    const userRequest: UserRequestDTO = { id: user.id, name: user.name, course: user.course, email: user.email, password: confirmPassword };

                    UserService.updateUser(userRequest).then((response: UserResponseDTO) => {
                        if (!response) {
                            toast.current?.show({ severity: 'error', detail: 'Erro ao alterar informações', life: 5000 });
                            clearFields();
                            setVisible(false);
                            return;
                        }

                        toast.current?.show({ severity: 'success', detail: 'Informações alteradas com sucesso', life: 5000 });
                        clearFields();
                        setVisible(false);
                        setName(response.name);
                        setActiveIndex(0);
                    });
                }
            } catch (error) {
                toast.current?.show({ severity: 'error', detail: 'Erro ao alterar informações', life: 5000 });
                clearFields();
                setVisible(false);
                setActiveIndex(0);
            }
        }
    }

    const handleRemoveFavorite = async (id) => {

        try {
            const response = await UserService.unfavoriteTCCProfile(user.id, id);
            if (response.status !== 200) {
                toast.current?.show({ severity: 'error', detail: 'Erro ao remover favorito', life: 5000 });
                return;
            }

            setFavoriteTCCs((prevTCCs) => prevTCCs.filter((tcc) => tcc.id !== id));
        } catch (error) {
            toast.current?.show({ severity: 'error', detail: 'Erro ao remover favorito', life: 5000 });
            return;
        }

        toast.current?.show({ severity: 'success', detail: 'TCC removido dos favoritos', life: 5000 });
    };

    const handleCardClick = (tccId: string) => {
        const url = `/tcc/${tccId}`;
        window.open(url, '_blank');
    };

    const footerContent = (
        <div>
            <Button
                label="Não"
                icon="pi pi-times"
                onClick={
                    () => {
                        setConfirmDeleteModalVisible(false);
                    }
                }
                className="p-button-text"
                style={{ color: '#2b2d39' }}
            />

            <Button
                label="Sim"
                icon="pi pi-check"
                onClick={
                    () => {
                        setConfirmDeleteModalVisible(false);
                        handleRemoveFavorite(tccIdToDelete);
                    }
                }
                autoFocus
                style={{
                    backgroundColor: '#2b2d39',
                    border: 'none',
                    boxShadow: 'none'
                }} />
        </div>
    );

    return (
        <div className="mx-auto p-4 text-gray-800 mt-4" style={{ visibility: isReady ? 'visible' : 'hidden' }}>
            {/* primeiro container */}
            <div className="flex flex-col lg:flex-row gap-8 ">
                <div className="lg:w-1/3 rounded-lg p-16 pt-6 mt-2">
                    <div className="flex flex-col items-center border border-gray-400 rounded-lg p-8" style={{ boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.25)' }}>
                        <div className="flex justify-center w-full mb-4">
                            <Image
                                alt=""
                                src="/profile.png"
                                width="260"
                                height="260"
                                className="rounded-full border-0"
                                style={{ height: 'auto' }}
                            />
                        </div>
                        <h1 className="text-2xl font-bold mb-1 text-center">{name}</h1>
                        <p className="text-gray-600 mb-4 text-center">{rolesOptions[userContext?.roles[0]]}</p>
                        <Button
                            icon="pi pi-pencil"
                            label="Editar Conta"
                            className="mb-4 w-48"
                            style={{
                                backgroundColor: '#2b2d39',
                                borderColor: '#2b2d39',
                                color: 'white',
                                transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#1d1d2c';
                                e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#2b2d39';
                                e.currentTarget.style.color = 'white';
                            }}
                            onClick={() => {
                                setVisible(true)
                            }}
                        />

                        <div className="flex flex-col items-center mt-2">
                            <div className="flex flex-wrap justify-center items-center gap-4 mb-4">
                                <span className="flex items-center">
                                    <i className="pi pi-star-fill text-yellow-500 mr-1"></i>
                                    <span className="font-bold text-yellow-500 pl-1">{favoriteTCCs.length}</span>
                                    <span className="text-gray-600 ml-1 text-yellow-500 font-bold pl-1">{favoriteTCCs.length == 1 ? 'Favorito' : 'Favoritos'}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:w-2/3 mr-8">
                    {favoriteTCCs?.length > 0 ? <h3 className="text-md font-semibold mb-2">Favoritos</h3> : null}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {favoriteTCCs.map((tcc) => (
                            <div
                                key={tcc.id}
                                className="relative group"
                                onMouseEnter={() => setHoveredTCCId(tcc.id)}
                                // onMouseLeave={() => setHoveredTCCId(null)}
                            >
                                <Link href={''} passHref>
                                    <Card
                                        title={
                                            <span style={{ fontSize: '16px', fontWeight: 'bold', lineHeight: '1.6' }}>
                                                {tcc.title}
                                            </span>
                                        }
                                        className="text-xs font-light border border-gray-400 relative h-full flex flex-col justify-between"
                                        onClick={() => handleCardClick(tcc.id)}
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 mb-1">
                                                {tcc.author}
                                            </p>
                                            <div className="flex flex-wrap gap-0.5">
                                                {tcc.keywords.map((tag, index) => (
                                                    <Badge
                                                        key={index}
                                                        value={tag.name}
                                                        className="text-white text-3xs mr-0.5 mt-4"
                                                        style={{ backgroundColor: '#2b2d39' }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                                <div
                                    className="absolute -top-4 -right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // handleRemoveFavorite(tcc.id);
                                        setTccIdToDelete(tcc.id);
                                        setConfirmDeleteModalVisible(true);
                                    }}
                                >
                                    <div className="bg-red-700 text-white rounded-full p-2">
                                        <FiTrash2 className="text-white text-lg" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {favoriteTCCs?.length <= 0 ? (
                        <div className="flex flex-col items-center justify-center mt-44">
                            <div className="text-gray-400 mb-4">
                                <AiOutlineFileSearch className="text-gray-500 text-6xl" />
                            </div>
                            <p className="text-2xl font-medium text-gray-600">Você ainda não possui TCCs favoritados</p>
                            <p className="text-base text-gray-500">Comece a explorar e adicione favoritos!</p>
                        </div>
                    ) : (
                        <div className="flex gap-8 items-center mt-8 justify-center">
                            <Button
                                icon="pi pi-chevron-left"
                                label=""
                                className="p-button-outlined px-2 py-2 text-xs"
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                style={{
                                    backgroundColor: '#2b2d39',
                                    borderColor: '#2b2d39',
                                    color: 'white',
                                    transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
                                    borderWidth: '1px',
                                    borderStyle: 'solid',
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

                            <span className="text-md font-medium text-gray-600">
                                Página {currentPage} de {totalPages}
                            </span>

                            <Button
                                icon="pi pi-chevron-right"
                                label=""
                                iconPos="right"
                                className="p-button-outlined px-2 py-2 text-xs"
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                style={{
                                    backgroundColor: '#2b2d39',
                                    borderColor: '#2b2d39',
                                    color: 'white',
                                    transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
                                    borderWidth: '1px',
                                    borderStyle: 'solid',
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
                        </div>)}
                </div>

            </div>
            <Dialog header="" visible={visible} style={{ width: '40vw' }} onHide={() => {
                if (!visible) return;
                setVisible(false);
                clearFields();
            }}>

                <TabView activeIndex={activeIndex} onTabChange={(e) => clearFields()}>
                    <TabPanel
                        headerTemplate={headerTemplates('Detalhes da Conta', 0)}
                    >
                        <div className="grid grid-cols-1 gap-6">
                            <div className="relative">
                                <label
                                    htmlFor="email"
                                    className="block text-gray-700 font-medium mb-2"
                                    style={{ color: '#231F20' }}
                                >
                                    Nome
                                </label>
                                <div className="relative w-full">
                                    {userDetailsErrors.name && <p className="absolute right-0 -top-6 text-red-500 text-sm">{userDetailsErrors.name}</p>}
                                    <InputText
                                        id="name"
                                        placeholder="Digite seu nome completo"
                                        className="w-full bg-white border border-gray-300 focus:outline-none focus:ring-0 focus:border-black"
                                        value={user.name}
                                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                handleUserDataChange(e);
                                            }
                                        }}
                                        disabled={getUserRole() == 'Administrador'}
                                    />
                                </div>
                            </div>
                            <div className="relative">
                                <label
                                    htmlFor="email"
                                    className="block text-gray-700 font-medium mb-2"
                                    style={{ color: '#231F20' }}
                                >
                                    E-mail
                                </label>
                                <div className="relative w-full">
                                    <InputText
                                        id="name"
                                        placeholder="@aluno.ifnmg.edu.br ou @ifnmg.edu.br"
                                        className="w-full bg-white border border-gray-300 focus:outline-none focus:ring-0 focus:border-black"
                                        value={user?.email}
                                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                                        disabled={true}
                                    />
                                </div>
                            </div>
                            <div className="relative">
                                {userDetailsErrors.course && (
                                    <p className="absolute top-[-1.5rem] right-0 text-red-500 text-sm mt-2">{userDetailsErrors.course}</p>
                                )}
                                <label htmlFor="course" className="block text-gray-700 font-medium mb-2" style={{ color: '#231F20' }}>Curso</label>
                                <Dropdown
                                    id="course"
                                    value={user.course}
                                    onChange={(e) => setUser({ ...user, course: e.target.value })}
                                    options={courses}
                                    placeholder="Selecione seu curso"
                                    className="w-full bg-white border border-gray-300 focus:outline-none focus:ring-0 focus:border-black"
                                    disabled={getUserRole() == 'Administrador'}
                                />

                            </div>
                        </div>
                        <div className="mt-6 py-2 rounded-lg">
                            <Button
                                type="button"
                                label="Salvar Alterações"
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
                                onClick={handleUserDataChange}
                            />
                        </div>

                    </TabPanel>

                    <TabPanel
                        header={
                            <span
                                className={`text-base px-4 py-2 cursor-pointer ${activeIndex === 1
                                    ? 'text-black'
                                    : 'text-black'
                                    }`}
                            >
                                Alterar Senha
                            </span>
                        }
                        headerTemplate={headerTemplates('Alterar Senha', 1)}
                    >
                        <div className="relative">
                            {passwordErrors.currentPassword && (
                                <p className="absolute top-[-1.5rem] right-0 text-red-500 text-sm mt-2">{passwordErrors.currentPassword}</p>
                            )}
                            <label htmlFor="password" className="block text-gray-700 font-medium mb-2" style={{ color: '#231F20' }}>Senha Atual</label>
                            <div className="relative w-full mb-6">
                                <InputText
                                    id="password"
                                    type={currentPasswordVisible ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Digite a senha atual"
                                    className="w-full pr-12 bg-white border border-gray-300 focus:outline-none focus:ring-0 focus:border-black"
                                />
                                <button
                                    type="button"
                                    onClick={handleCurrentPasswordVisibility}
                                    className="absolute inset-y-0 right-0 flex items-center px-3"
                                    style={{ top: '50%', transform: 'translateY(-50%)' }}
                                >
                                    {currentPasswordVisible ? (
                                        <FaEye className="text-gray-500 text-base" />
                                    ) : (
                                        <FaEyeSlash className="text-gray-500 text-base" />
                                    )}
                                </button>
                            </div>

                        </div>

                        <div className="relative">
                            {passwordErrors.password && (
                                <p className="absolute top-[-1.5rem] right-0 text-red-500 text-sm mt-2">{passwordErrors.password}</p>
                            )}
                            <label htmlFor="password" className="block text-gray-700 font-medium mb-2" style={{ color: '#231F20' }}>Nova Senha</label>
                            <div className="relative w-full mb-6">
                                <InputText
                                    id="newPassword"
                                    type={passwordVisible ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Digite a nova senha"
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
                            {passwordErrors.confirmPassword && (
                                <p className="absolute top-[-1.5rem] right-0 text-red-500 text-sm mt-2">{passwordErrors.confirmPassword}</p>
                            )}
                            <label htmlFor="confirmNewPassword" className="block text-gray-700 font-medium mb-2" style={{ color: '#231F20' }}>Confirmar Nova Senha</label>
                            <div className="relative w-full">
                                <InputText
                                    id="confirmPassword"
                                    type={confirmPasswordVisible ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirme a nova senha"
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
                        <div className="mt-6 py-2 rounded-lg">
                            <Button
                                type="button"
                                label="Alterar Senha"
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
                                onClick={handlePasswordChange}
                            />
                        </div>
                    </TabPanel>
                </TabView>
            </Dialog>
            <Dialog
                header="Remover Favorito"
                visible={confirmDeleteModalVisible}
                position='center'
                style={{ width: '40vw' }}
                onHide={() => {
                    if (!confirmDeleteModalVisible) return; setConfirmDeleteModalVisible(false);
                }}
                footer={footerContent}
                draggable={false}
                resizable={false}>
                <p className="m-0">
                    Deseja realmente remover <strong>{favoriteTCCs.find((tcc) => tcc.id === tccIdToDelete)?.title}</strong> dos favoritos?
                </p>
            </Dialog>
            <div className="card flex justify-content-center">
                <Toast ref={toast}  position="bottom-right"/>
            </div>
        </div>
    );
}


export default withUserProtection(Component);