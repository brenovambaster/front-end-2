'use client';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';

import { CoordenadorService } from '@/service/coordenadorService';
import { CursoService } from "@/service/cursoService";
import { CoordenadorRequestDTO } from '../types';


export default function CoordenadorsDemo() {
    const emptyCoordenador: CoordenadorRequestDTO = {
        id: '',
        name: '',
        email: '',
        username: '',
        password: '',
        course: ''
    };

    interface CourseOption {
        label: string;
        value: string;
    }



    const [coordenadors, setCoordenadors] = useState<CoordenadorRequestDTO[]>([]);
    const [globalFilter, setGlobalFilter] = useState<string | null>(null);
    const [coordenadorDialog, setCoordenadorDialog] = useState<boolean>(false);
    const [editCoordenadorDialog, setEditcoordenadorDialog] = useState<boolean>(false);
    const [deleteCoordenadorDialog, setDeleteCoordenadorDialog] = useState<boolean>(false);
    const [coordenador, setCoordenador] = useState<CoordenadorRequestDTO>(emptyCoordenador);
    const [selectedCoordenadors, setSelectedCoordenadors] = useState<CoordenadorRequestDTO[] | null>(null);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [deleteSelectedCoordenadorsDialog, setDeleteSelectedCoordenadorsDialog] = useState<boolean>(false);
    const toastBottomLeft = useRef<Toast>(null);
    const toast = useRef<Toast>(null);
    const [dialogTitle, setDialogTitle] = useState<string>('Novo Coordenador');
    const [courses, setCourses] = useState<CourseOption[]>([]);


    useEffect(() => {
        CoordenadorService.getCoordenadors().then(data => setCoordenadors(data));
        CursoService.getCursos().then(data => {
            const transformedCourses = data.map(transformCourse);
            setCourses(transformedCourses);
        });
    }, []);

    const statusBodyTemplate = (coordenador: CoordenadorRequestDTO) => {
        return <Tag value={coordenador.title} />;
    };

    const transformCourse = (course: { id: string; name: string; codeOfCourse: string }) => {
        return { label: course.name, value: course.id };
    };

    const openNew = () => {
        setCoordenador(emptyCoordenador);
        setSubmitted(false);
        setCoordenadorDialog(true);
        setEditcoordenadorDialog(false);
        setDialogTitle('Novo Coordenador');
    };

    const hideDialog = () => {
        setSubmitted(false);
        setCoordenadorDialog(false);
        setEditcoordenadorDialog(false);
    };

    const validateFields = () => {
        console.log(JSON.stringify(coordenador));
        if(editCoordenadorDialog) {
            return coordenador.name.trim() && coordenador.email.trim() && coordenador.username.trim() && coordenador.course.trim();
        }
        return coordenador.name.trim() && coordenador.email.trim() && coordenador.username.trim() && coordenador.password.trim() && coordenador.course.name.trim();
    };

    const saveCoordenador = async () => {

        if (editCoordenadorDialog) {
            coordenador.course = coordenador.course.id;
        }
        
        if (validateFields()) {
            if (coordenador.name.trim()) {
                try {

                    if (coordenador.id) {
                        // Atualizar coordenador existente
                        await CoordenadorService.updateCoordenador(coordenador);
                        setCoordenadors(coordenadors.map(p => (p.id === coordenador.id ? coordenador : p)));
                    } else {
                        coordenador.course = coordenador.course.id;

                        // Criar novo coordenador
                        const newCoordenador = await CoordenadorService.createCoordenador(coordenador);

                        setCoordenadors([...coordenadors, newCoordenador]);
                    }
                    setCoordenadorDialog(false);
                    window.location.reload();
                    toast.current.show({ severity: 'success', detail: 'Operação realizada com sucesso', life: 5000 });

                } catch (error) {
                    toast.current.show({ severity: 'error', detail: 'Erro ao realizar a operação', life: 5000 });
                    hideDialog();
                }
            }
        }

        setSubmitted(true);
    };

    const editCoordenador = (coordenador: CoordenadorRequestDTO) => {
        setCoordenador({ ...coordenador });
        setCoordenadorDialog(true);
        setEditcoordenadorDialog(true);
        setDialogTitle('Editar Coordenador');
    };

    const confirmDeleteCoordenador = (coordenador: CoordenadorRequestDTO) => {
        setCoordenador(coordenador);
        setDeleteCoordenadorDialog(true);
    };

    const deleteCoordenador = async () => {
        try {
            await CoordenadorService.deleteCoordenador(coordenador.id);
            setCoordenadors(coordenadors.filter(val => val.id !== coordenador.id));
            setDeleteCoordenadorDialog(false);
            setCoordenador(emptyCoordenador);
            toast.current.show({ severity: 'success', detail: 'Operação realizada com sucesso', life: 5000 });
        } catch (error) {
            toast.current.show({ severity: 'error', detail: 'Erro ao realizar a operação', life: 5000 });

            setDeleteCoordenadorDialog(false);
            setCoordenador(emptyCoordenador);
        }
    };

    const deleteCoordenadors = () => {
        if (selectedCoordenadors && selectedCoordenadors.length > 0) {
            setDeleteSelectedCoordenadorsDialog(true);
        }
    };

    const confirmDeleteSelectedCoordenadors = async () => {
        if (selectedCoordenadors) {
            try {
                await CoordenadorService.deleteCoordenadors(selectedCoordenadors.map(p => p.id));
                setCoordenadors(coordenadors.filter(p => !selectedCoordenadors.includes(p)));
                setSelectedCoordenadors(null);
                toast.current.show({ severity: 'success', detail: 'Operação realizada com sucesso', life: 5000 });

            } catch (error) {
                toast.current.show({ severity: 'error', detail: 'Erro ao realizar a operação', life: 5000 });
            }
            setDeleteSelectedCoordenadorsDialog(false);
        }
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                    <i className="pi pi-search" aria-hidden="true" />
                </span>
                <InputText
                    type="search"
                    onInput={(e) => {
                        const value = (e.target as HTMLInputElement).value;
                        setGlobalFilter(value ? value : null);
                    }}
                    placeholder="Pesquisar..."
                    aria-label="Search coordenadors"
                />
            </div>
        </div>
    );

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button
                    label="Cadastrar Coordenador"
                    icon="pi pi-plus"
                    severity="success"
                    onClick={openNew}
                    aria-label="New Coordenador"
                    className="p-button-sm"
                />
                <Button
                    label="Remover Selecionados"
                    icon="pi pi-trash"
                    severity="danger"
                    disabled={!selectedCoordenadors || selectedCoordenadors.length === 0}
                    onClick={deleteCoordenadors}
                    aria-label="Delete Selected Coordenadors"
                    className="p-button-sm"
                />
            </div>
        );
    };

    const coordenadorsDialogFooter = (
        <React.Fragment>
            <Button
                label="Cancelar"
                icon="pi pi-times"
                outlined
                onClick={hideDialog}
                aria-label="Cancelar"
                className="p-button-sm"
            />
            <Button
                label="Salvar"
                icon="pi pi-check"
                onClick={saveCoordenador}
                aria-label="Salvar"
                className="p-button-sm"
            />
        </React.Fragment>
    );

    const actionBodyTemplate = (rowData: CoordenadorRequestDTO) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-pencil"
                    rounded
                    outlined
                    className="mr-2 p-button-sm"
                    onClick={() => editCoordenador(rowData)}
                    aria-label={`Edit ${rowData.name}`}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    onClick={() => confirmDeleteCoordenador(rowData)}
                    aria-label={`Delete ${rowData.name}`}
                    className="p-button-sm"
                />
            </React.Fragment>
        );
    };

    const courseOptions = [
        { label: 'Ciência da Computação', value: 'Ciência da Computação' },
        { label: 'Engenharia Elétrica', value: 'Engenharia Elétrica' },
        { label: 'Engenharia Química', value: 'Engenha Químicaria' }
    ];

    return (
        <div>
            <div className="card m-2">
                <Toolbar
                    start={leftToolbarTemplate}
                    className="mb-4"
                />
                <DataTable
                    value={coordenadors}
                    stripedRows
                    sortMode='multiple'
                    showGridlines
                    dataKey="id"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Exibindo {first} - {last} de {totalRecords} coordenadores"
                    globalFilter={globalFilter}
                    header={header}
                    selection={selectedCoordenadors}
                    onSelectionChange={(e) => setSelectedCoordenadors(e.value as CoordenadorRequestDTO[])}
                    size="small"
                    aria-label="Coordenadors Table"
                >
                    <Column selectionMode="multiple" exportable={false} aria-label="Select" className='' />
                    <Column field="id" header="ID" aria-label="ID" style={{ width: '10%' }} />
                    <Column field="name" header="Nome" aria-label="Name" style={{ width: '20%' }} sortable />
                    <Column field="email" header="E-mail" aria-label="Email" style={{ width: '15%' }} sortable />
                    <Column field="username" header="Nome de Usuário" aria-label="Username" sortable />
                    <Column field="course.name" header="Curso" aria-label="Course" style={{ width: '20%' }} sortable />
                    <Column body={actionBodyTemplate} exportable={false} style={{ width: '10%' }} aria-label="Actions" />
                </DataTable>
            </div>

            <Dialog
                visible={coordenadorDialog}
                style={{ width: '32rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header={dialogTitle}
                modal
                className="p-fluid"
                footer={coordenadorsDialogFooter}
                onHide={hideDialog}
                aria-labelledby="coordenador-details-header"
            >
                <div className="field mb-4">
                    <label htmlFor="name" className="font-bold">
                        Nome
                    </label>
                    <InputText
                        id="name"
                        value={coordenador.name}
                        onChange={(e) => setCoordenador({ ...coordenador, name: e.target.value })}
                        required
                        autoFocus
                        className={`border border-gray-300 p-2 rounded ${classNames({ 'p-invalid': submitted && !coordenador.name })}`}
                        aria-describedby="name-help"
                    />
                    {submitted && !coordenador.name && <small id="name-help" className="p-error">Este campo não pode ficar em branco.</small>}
                </div>
                <div className="field mb-4">
                    <label htmlFor="email" className="font-bold">
                        E-mail
                    </label>
                    <InputText
                        id="email"
                        value={coordenador.email}
                        onChange={(e) => setCoordenador({ ...coordenador, email: e.target.value })}
                        required
                        className="border border-gray-300 p-2 rounded"
                        aria-describedby="research-area-help"
                    />
                    {submitted && !coordenador.email && <small id="name-help" className="p-error">Este campo não pode ficar em branco.</small>}
                </div>
                <div className="field mb-4">
                    <label htmlFor="course" className="font-bold">
                        Curso
                    </label>
                    {/* <Dropdown
                        id="course"
                        value={editCoordenadorDialog ? coordenador.course.id : coordenador.course}
                        options={courses}
                        onChange={(e) => setCoordenador({ ...coordenador, course: e.value })}
                        required
                        className="border border-gray-300 rounded p-2 h-10 flex items-center"
                        aria-describedby="location-of-work-help"
                    /> */}

                    <Dropdown
                        id="course"
                        value={coordenador.course.id} // Garanta que o valor seja o id do curso
                        options={courses}
                        onChange={(e) =>
                            setCoordenador({
                                ...coordenador,
                                course: { id: e.value, name: courses.find(course => course.value === e.value)?.label }
                            })
                        }
                        required
                        className="border border-gray-300 rounded p-2 h-10 flex items-center"
                        aria-describedby="location-of-work-help"
                    />

                    {submitted && !coordenador.course && <small id="name-help" className="p-error">Este campo não pode ficar em branco.</small>}
                </div>
                <div className="field mb-4">
                    <label htmlFor="username" className="font-bold">
                        Nome de Usuário
                    </label>
                    <InputText
                        id="username"
                        value={coordenador.username}
                        onChange={(e) => setCoordenador({ ...coordenador, username: e.target.value })}
                        required
                        className="border border-gray-300 p-2 rounded"
                        aria-describedby="username-help"
                    />
                    {submitted && !coordenador.username && <small id="name-help" className="p-error">Este campo não pode ficar em branco.</small>}
                </div>
                <div className="field mb-4">
                    <label htmlFor="password" className="font-bold">
                        Senha
                    </label>
                    <InputText
                        id="password"
                        onChange={(e) => setCoordenador({ ...coordenador, password: e.target.value })}
                        required
                        className="border border-gray-300 p-2 rounded"
                        aria-describedby="password-help"
                    />
                    {submitted && !coordenador.password && <small id="name-help" className="p-error">Este campo não pode ficar em branco.</small>}
                </div>
            </Dialog>

            <Dialog
                header="Confirmar Remoção"
                visible={deleteCoordenadorDialog}
                onHide={() => setDeleteCoordenadorDialog(false)}
                footer={
                    <React.Fragment>
                        <Button
                            label="Cancelar"
                            icon="pi pi-times"
                            outlined
                            onClick={() => setDeleteCoordenadorDialog(false)}
                            aria-label="Cancelar"
                            className="p-button-sm"
                        />
                        <Button
                            label="Remover"
                            icon="pi pi-check"
                            severity="danger"
                            onClick={deleteCoordenador}
                            aria-label="Remover"
                            className="p-button-sm"
                        />
                    </React.Fragment>
                }
            >
                <p>Tem certeza de que deseja remover o coordenador <strong>{coordenador.name}</strong>?</p>
            </Dialog>

            <Dialog
                header="Confirmar Remoção em Massa"
                visible={deleteSelectedCoordenadorsDialog}
                onHide={() => setDeleteSelectedCoordenadorsDialog(false)}
                footer={
                    <React.Fragment>
                        <Button
                            label="Cancelar"
                            outlined
                            onClick={() => setDeleteSelectedCoordenadorsDialog(false)}
                            aria-label="Cancelar"
                            className="p-button-sm"
                        />
                        <Button
                            label="Remover"
                            severity="danger"
                            onClick={confirmDeleteSelectedCoordenadors}
                            aria-label="Remover"
                            className="p-button-sm"
                        />
                    </React.Fragment>
                }
            >
                <p>Tem certeza de que deseja remover os coordenadores selecionados?</p>
            </Dialog>
            <div className="card flex justify-content-center">
                <Toast ref={toast} position="bottom-right" />
            </div>
        </div>
    );
}
