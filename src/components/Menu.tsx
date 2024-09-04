"use client";

import { AuthContext } from '@/contexts/AuthContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { destroyCookie } from 'nookies';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Menubar } from 'primereact/menubar';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useContext, useEffect, useRef, useState } from 'react';
import graduation_cap_image from '../../public/navbar-rtcc-if-logo.png';

const style = {
    boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.2)',
    height: '50px'
};

const Logo = () => (
    <div style={{ marginRight: '0.5rem', marginLeft: '0.5rem' }}>
        <a href="/">
            <Image
                alt="logo"
                src={graduation_cap_image}
                height={35}
                width={35}
            />
        </a>
    </div>
);

export default function BasicDemo() {
    const op = useRef<OverlayPanel>(null);
    const { isAuthenticated, user } = useContext(AuthContext);
    const [isReady, setIsReady] = useState(false);
    const router = useRouter();


    useEffect(() => {
        // Garantindo que todos os estilos sejam carregados antes de exibir a navbar
        setTimeout(() => setIsReady(true), 10);
    }, []);

    const itemsAdmin = [
        { label: 'Coordenadores', url: '/gerenciar/coordenador', icon: 'pi pi-user-edit', className: 'text-xs' },
        { label: 'Cursos', url: '/gerenciar/curso', icon: 'pi pi-book', className: 'text-xs' },
        { label: 'Professores', url: '/gerenciar/professor', icon: 'pi pi-users', className: 'text-xs' },
        { label: 'TCCs', url: '/gerenciar/tcc', icon: 'pi pi-file-edit', className: 'text-xs' }
    ];

    const itemsCoordinator = [
        { label: 'Professores', url: '/gerenciar/professor', icon: 'pi pi-users', className: 'text-xs' },
        { label: 'TCCs', url: '/gerenciar/tcc', icon: 'pi pi-file-edit', className: 'text-xs' }
    ];

    const itemsUser = [];

    const handleLogout = () => {
        try {
            for (let i = 0; i < 5; i++) {
                destroyCookie(null, 'rtcc.token');
            }
            window.location.href = '/';
        } catch (error) {
            console.error(error);
        }
    };

    const end = (
        <div className="flex items-center gap-2 pr-3">
            {
                !isAuthenticated ? (
                    <Button
                        label="Fazer login"
                        icon="pi pi-user"
                        className="group border border-[#2b2d39] text-[#2b2d39] font-semibold py-2 px-4 rounded-full flex items-center justify-center space-x-2"
                        style={{
                            backgroundColor: 'white',
                            borderColor: '#2b2d39',
                            color: '#2b2d39',
                            transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
                        }}
                        onClick={() => window.location.href = '/login'}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#2b2d39';
                            e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.color = '#2b2d39';
                        }}
                    />
                ) : (
                    <>
                        <Avatar icon="pi pi-user" shape="circle" onClick={(e) => op.current?.toggle(e)} style={{ cursor: 'pointer' }} />
                        <OverlayPanel ref={op} dismissable className="p-menu-custom" style={{ width: '180px' }}>
                            <div className="flex flex-col ">
                                <Button
                                    label="Perfil"
                                    icon="pi pi-user"
                                    onClick={() => {
                                        window.location.href = '/perfil';
                                    }}
                                    className="p-button-text p-button-plain border border-transparent hover:border-[#2b2d39] focus:border-[#2b2d39] p-2"
                                    style={{
                                        backgroundColor: 'white',
                                        color: '#2b2d39',
                                        transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-color 0.2s ease-in-out',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#2b2d39';
                                        e.currentTarget.style.color = 'white';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'white';
                                        e.currentTarget.style.color = '#2b2d39';
                                    }}
                                />


                                <Button label="Logout" icon="pi pi-sign-out" onClick={handleLogout} className="p-button-text p-button-plain border border-transparent hover:border-[#2b2d39] focus:border-[#2b2d39] p-2 mt-2"
                                    style={{
                                        backgroundColor: 'white',
                                        color: '#2b2d39',
                                        transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-color 0.2s ease-in-out',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#2b2d39';
                                        e.currentTarget.style.color = 'white';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'white';
                                        e.currentTarget.style.color = '#2b2d39';
                                    }}
                                />
                            </div>
                        </OverlayPanel>
                    </>
                )
            }
        </div>
    );


    const renderMenubar = () => {

        if (user?.roles.includes('ADMIN')) {
            return <Menubar className='' model={itemsAdmin} start={<Logo />} style={style} end={end} />;
        } else if (user?.roles.includes('COORDINATOR')) {
            return <Menubar className='' model={itemsCoordinator} start={<Logo />} style={style} end={end} />;
        } else if (user?.roles.includes('USER')) {
            return <Menubar className='' start={<Logo />} style={style} end={end} />;
        }
        return <Menubar className='' model={[]} start={<Logo />} style={style} end={end} />;
    };

    return (
        <div style={{ visibility: isReady ? 'visible' : 'hidden' }}>
            {renderMenubar()}
        </div>
    );
}
