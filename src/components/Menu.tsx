import { Menubar } from 'primereact/menubar';
import Image from 'next/image';
import graduation_cap_image from '../../public/menu-rtcc-if-logo.png';
import { InputText } from 'primereact/inputtext';
import { Avatar } from 'primereact/avatar';

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

const end = (
    <div className="flex align-items-center gap-2 pr-3">
        <Avatar icon='pi pi-user' shape="circle" />
    </div>
);

export default function BasicDemo() {
    const items = [
        {
            label: 'Coordenadores',
            url: '/gerenciar/coordenador',
            icon: 'pi pi-user-edit',
            className: 'text-xs'
        },
        {
            label: 'Cursos',
            url: '/gerenciar/curso',
            icon: 'pi pi-book',
            className: 'text-xs' 

        },
        {
            label: 'Professores',
            url: '/gerenciar/professor',
            icon: 'pi pi-users',
            className: 'text-xs'
        }
    ];

    return (
        <Menubar className='' model={items} start={<Logo />} style={style} end={end}/>
    );
}
