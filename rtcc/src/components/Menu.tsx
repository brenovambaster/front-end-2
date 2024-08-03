
import React from 'react';
import { Menubar } from 'primereact/menubar';


export default function BasicDemo() {
    const items = [
        {
            label: 'Home',
            icon: 'pi pi-users',
            url: '/'
        },
        {
            label: 'TCC',
            icon: 'pi pi-book',
            url: '/features/features'
        },
        {
            label: 'Cursos',
            icon: 'pi pi-info-circle',
            url: '/courses/courses'
        },
        {
            label: 'Algumas coisa',
            icon: 'pi pi-search',
            items: [
                {
                    label: 'Components',
                    icon: 'pi pi-bolt'
                },
                {
                    label: 'Blocks',
                    icon: 'pi pi-server'
                },
                {
                    label: 'UI Kit',
                    icon: 'pi pi-pencil'
                },
                {
                    label: 'Templates',
                    icon: 'pi pi-palette',
                    items: [
                        {
                            label: 'Apollo',
                            icon: 'pi pi-palette'
                        },
                        {
                            label: 'Ultima',
                            icon: 'pi pi-palette'
                        }
                    ]
                }
            ]
        },
        {
            label: 'Contact',
            icon: 'pi pi-envelope'
        }
    ];

    return (

        <Menubar className='' model={items} />


    )
}
