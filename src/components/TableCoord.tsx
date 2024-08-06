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
import { CoordenadorService } from '../service/CoordenadorService.tsx';
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


    const [coordenadors, setCoordenadors] = useState<CoordenadorRequestDTO[]>([]);
    const [globalFilter, setGlobalFilter] = useState<string | null>(null);
    const [coordenadorDialog, setCoordenadorDialog] = useState<boolean>(false);
    const [editcoordenadorDialog, setEditcoordenadorDialog] = useState<boolean>(false);
    const [deleteCoordenadorDialog, setDeleteCoordenadorDialog] = useState<boolean>(false);
    const [coordenador, setCoordenador] = useState<CoordenadorRequestDTO>(emptyCoordenador);
    const [selectedCoordenadors, setSelectedCoordenadors] = useState<CoordenadorRequestDTO[] | null>(null);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [deleteSelectedCoordenadorsDialog, setDeleteSelectedCoordenadorsDialog] = useState<boolean>(false);
    const toastBottomLeft = useRef<Toast>(null);
    const toast = useRef<Toast>(null);
    const [dialogTitle, setDialogTitle] = useState<string>('Novo Coordenador');


    useEffect(() => {
        CoordenadorService.getCoordenadors().then(data => setCoordenadors(data));
    }, [coordenadors, coordenador, selectedCoordenadors]);

    const statusBodyTemplate = (coordenador: CoordenadorRequestDTO) => {
        return <Tag value={coordenador.title} />;
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
        return coordenador.name.trim() && coordenador.email.trim() && coordenador.username.trim() && coordenador.password.trim() && coordenador.course.trim();
    };

    const saveCoordenador = async () => {
        if (validateFields()) {
            if (coordenador.name.trim()) {
                try {
                    if (coordenador.id) {
                        // Atualizar coordenador existente
                        await CoordenadorService.updateCoordenador(coordenador);
                        setCoordenadors(coordenadors.map(p => (p.id === coordenador.id ? coordenador : p)));
                    } else {
                        // Criar novo coordenador
                        const newCoordenador = await CoordenadorService.createCoordenador(coordenador);
                        setCoordenadors([...coordenadors, newCoordenador]);
                    }
                    setCoordenadorDialog(false);
                    toast.current.show({ severity: 'success', summary: 'info', detail: 'Operação realizada com sucesso', life: 3000 });
                    // setCoordenador(emptyCoordenador);
                    // window.location.reload();
                } catch (error) {
                    console.error("Erro ao salvar coordenador:", error);
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
            toast.current.show({ severity: 'error', summary: 'info', detail: 'Coordenador inativado com sucesso', life: 3000 });
        } catch (error) {
            console.error("Erro ao inativar coordenador:", error);
        }

        // window.location.reload();
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
                toast.current.show({ severity: 'error', summary: 'info', detail: 'Coordenador inativado com sucesso', life: 3000 });
            } catch (error) {
                console.error("Erro ao inativar coordenadores:", error);
            }
            setDeleteSelectedCoordenadorsDialog(false);
        }

        // window.location.reload();
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            {/* <h4 className="m-0">Gerenciar Coordenadores</h4> */}
            <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                    <i className="pi pi-search" aria-hidden="true" />
                </span>
                <InputText
                    type="search"
                    onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)}
                    placeholder="Search..."
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
                    label="Inativar Selecionados"
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

    const rightToolbarTemplate = () => {
        // return <Button label="Export" icon="pi pi-upload" className="p-button-help" aria-label="Export Data" />;
    };

    const footer = `In total there are ${coordenadors.length} coordenadors.`;
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
                    <Column field="id" header="ID" aria-label="ID" style={{ width: '10%' }}/>
                    <Column field="name" header="Nome" aria-label="Name" style={{ width: '20%' }}/>
                    <Column field="email" header="E-mail" aria-label="Email" style={{ width: '15%' }}/>
                    <Column field="username" header="Nome de Usuário" aria-label="Username" />
                    <Column field="course" header="Curso" aria-label="Course" style={{ width: '20%' }}/>
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
                    <Dropdown
                        id="course"
                        value={coordenador.course}
                        options={courseOptions}
                        onChange={(e) => setCoordenador({ ...coordenador, course: e.value })}
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
                {/* <div className="field mb-4">
                    <label htmlFor="password" className="font-bold">
                        Senha
                    </label>
                    <InputText
                        id="password"
                        value={coordenador.password}
                        onChange={(e) => setCoordenador({ ...coordenador, password: e.target.value })}
                        required
                        className="border border-gray-300 p-2 rounded"
                        aria-describedby="password-help"
                    />
                    {submitted && !coordenador.password && <small id="name-help" className="p-error">Este campo não pode ficar em branco.</small>}
                </div> */}
            </Dialog>

            <Dialog
                header="Confirmar Inativação"
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
                            label="Inativar"
                            icon="pi pi-check"
                            severity="danger"
                            onClick={deleteCoordenador}
                            aria-label="Inativar"
                            className="p-button-sm"
                        />
                    </React.Fragment>
                }
            >
                <p>Tem certeza de que deseja inativar o coordenador <strong>{coordenador.name}</strong>?</p>
            </Dialog>

            <Dialog
                header="Confirmar Inativação em Massa"
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
                            label="Inativar"
                            severity="danger"
                            onClick={confirmDeleteSelectedCoordenadors}
                            aria-label="Inativar"
                            className="p-button-sm"
                        />
                    </React.Fragment>
                }
            >
                <p>Tem certeza de que deseja inativar os coordenadores selecionados?</p>
            </Dialog>
            <div className="card flex justify-content-center">
                <Toast ref={toast} position="bottom-right" />
            </div>
        </div>
    );
}
