import { Menubar } from 'primereact/menubar';
import Image from 'next/image';
import graduation_cap_image from '../../public/menu-rtcc-if-logo.png';
import { Avatar } from 'primereact/avatar';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { useContext, useRef } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

const style = {
    boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.2)',
    height: '50px'
};

const Logo = () => (
    <div style={{ marginRight: '0.5rem' }}>
        <a href="/">
            <Image
                alt="logo"
                src={graduation_cap_image}
                height={50}
                width={50}
            />
        </a>
    </div>
);

export default function BasicDemo() {
    const op = useRef<OverlayPanel>(null);
    const { isAuthenticated, user } = useContext(AuthContext);

    const itemsAdmin = [
        { label: 'Coordenadores', url: '/gerenciar/coordenador', icon: 'pi pi-user-edit', className: 'text-xs' },
        { label: 'Cursos', url: '/gerenciar/curso', icon: 'pi pi-book', className: 'text-xs' },
        { label: 'Professores', url: '/gerenciar/professor', icon: 'pi pi-users', className: 'text-xs' },
        { label: 'TCCs', url: '/gerenciar/tcc', icon: 'pi pi-file-edit', className: 'text-xs' }
    ];

    const itemsCoordinator = [
        { label: 'Cursos', url: '/gerenciar/curso', icon: 'pi pi-book', className: 'text-xs' },
        { label: 'Professores', url: '/gerenciar/professor', icon: 'pi pi-users', className: 'text-xs' },
        { label: 'TCCs', url: '/gerenciar/tcc', icon: 'pi pi-file-edit', className: 'text-xs' }
    ];

    const itemsUser = [

    ];

    const end = (
        <div className="flex items-center gap-2 pr-3">
            <Avatar icon="pi pi-user" shape="circle" onClick={(e) => op.current?.toggle(e)} style={{ cursor: 'pointer' }} />
            <OverlayPanel ref={op} dismissable className="p-menu-custom" style={{ width: '200px' }}>
                <div className="flex flex-col">
                    <Button label="Perfil" icon="pi pi-user" className="p-button-text p-button-plain border border-transparent hover:border-blue-500 focus:border-blue-500 p-2" />
                    <Button label="Configurações" icon="pi pi-cog" className="p-button-text p-button-plain border border-transparent hover:border-blue-500 focus:border-blue-500 p-2 mt-2" />
                    <Button label="Logout" icon="pi pi-sign-out" className="p-button-text p-button-plain border border-transparent hover:border-blue-500 focus:border-blue-500 p-2 mt-2" />
                </div>
            </OverlayPanel>
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

    return renderMenubar();
}
