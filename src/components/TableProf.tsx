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
import { ProfessorService } from '../service/professorService';
import { ProfessorRequestDTO } from '../types';


export default function ProfessorsDemo() {
    const emptyProfessor: ProfessorRequestDTO = {
        id: '',
        name: '',
        researchArea: '',
        title: '',
        email: '',
        locationOfWork: ''
    };

    const [professors, setProfessors] = useState<ProfessorRequestDTO[]>([]);
    const [globalFilter, setGlobalFilter] = useState<string | null>(null);
    const [professorDialog, setProfessorDialog] = useState<boolean>(false);
    const [editprofessorDialog, setEditprofessorDialog] = useState<boolean>(false);
    const [deleteProfessorDialog, setDeleteProfessorDialog] = useState<boolean>(false);
    const [professor, setProfessor] = useState<ProfessorRequestDTO>(emptyProfessor);
    const [selectedProfessors, setSelectedProfessors] = useState<ProfessorRequestDTO[] | null>(null);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [deleteSelectedProfessorsDialog, setDeleteSelectedProfessorsDialog] = useState<boolean>(false);
    const toastBottomLeft = useRef<Toast>(null);
    const toast = useRef<Toast>(null);
    const [dialogTitle, setDialogTitle] = useState<string>('Novo Professor');
    const [isReady, setIsReady] = useState(false);


    useEffect(() => {
        ProfessorService.getProfessors().then(data => setProfessors(data));

        setTimeout(() => setIsReady(true), 50);
    }, []);

    const statusBodyTemplate = (professor: ProfessorRequestDTO) => {
        return <Tag value={professor.title} />;
    };

    const openNew = () => {
        setProfessor(emptyProfessor);
        setSubmitted(false);
        setProfessorDialog(true);
        setEditprofessorDialog(false);
        setDialogTitle('Novo Professor');
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProfessorDialog(false);
        setEditprofessorDialog(false);
    };

    const validateFields = () => {
        return professor.name && professor.researchArea && validateEmail(professor.email.trim()) && professor.locationOfWork && professor.title;
    };

    const saveProfessor = async () => {
        if (validateFields()) {
            if (professor.name.trim()) {
                try {
                    if (professor.id) {
                        // Atualizar professor existente
                        await ProfessorService.updateProfessor(professor);
                        setProfessors(professors.map(p => (p.id === professor.id ? professor : p)));
                    } else {
                        // Criar novo professor
                        const newProfessor = await ProfessorService.createProfessor(professor);
                        setProfessors([...professors, newProfessor]);
                    }
                    setProfessorDialog(false);

                    window.location.reload();
                    toast.current.show({ severity: 'success', detail: 'Operação realizada com sucesso', life: 5000 });

                } catch (error) {
                    console.error("Erro ao salvar professor:", error);
                    toast.current.show({ severity: 'error', detail: 'Erro ao realizar a operação', life: 5000 });
                    setProfessorDialog(false);
                    hideDialog();
                }
            }
        }

        setSubmitted(true);
    };

    const editProfessor = (professor: ProfessorRequestDTO) => {
        setProfessor({ ...professor });
        setProfessorDialog(true);
        setEditprofessorDialog(true);
        setDialogTitle('Editar Professor');
    };

    const confirmDeleteProfessor = (professor: ProfessorRequestDTO) => {
        setProfessor(professor);
        setDeleteProfessorDialog(true);
    };

    const deleteProfessor = async () => {
        try {
            await ProfessorService.deleteProfessor(professor.id);
            setProfessors(professors.filter(val => val.id !== professor.id));
            setDeleteProfessorDialog(false);
            setProfessor(emptyProfessor);
            toast.current.show({ severity: 'success', detail: 'Operação realizada com sucesso', life: 5000 });

        } catch (error) {

            if (error.isAxiosError && error.response && error.response.data.statusCode === 409) {

                toast.current.show({ severity: 'warn', detail: error.response.data.message, life: 5000 });

            } else {
                toast.current.show({ severity: 'error', detail: 'Erro ao realizar a operação', life: 5000 });
            }

            setDeleteProfessorDialog(false);
            setProfessor(emptyProfessor);
        }
    };

    const deleteProfessors = () => {
        if (selectedProfessors && selectedProfessors.length > 0) {
            setDeleteSelectedProfessorsDialog(true);
        }
    };

    const confirmDeleteSelectedProfessors = async () => {
        if (selectedProfessors) {
            try {
                await ProfessorService.deleteProfessors(selectedProfessors.map(p => p.id));
                setProfessors(professors.filter(p => !selectedProfessors.includes(p)));
                setSelectedProfessors(null);
                toast.current.show({ severity: 'success', detail: 'Operação realizada com sucesso', life: 5000 });

            } catch (error) {
                if (error.isAxiosError && error.response && error.response.data.statusCode === 409) {

                    toast.current.show({ severity: 'warn', detail: error.response.data.message, life: 5000 });

                } else {
                    toast.current.show({ severity: 'error', detail: 'Erro ao realizar a operação', life: 5000 });
                }
                setSelectedProfessors(null);
            }
            setDeleteSelectedProfessorsDialog(false);
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
                    aria-label="Search professors"
                />
            </div>
        </div>
    );

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button
                    label="Cadastrar Professor"
                    icon="pi pi-plus"
                    severity="success"
                    onClick={openNew}
                    aria-label="New Professor"
                    className="p-button-sm"
                />
                <Button
                    label="remover Selecionados"
                    icon="pi pi-trash"
                    severity="danger"
                    disabled={!selectedProfessors || selectedProfessors.length === 0}
                    onClick={deleteProfessors}
                    aria-label="Delete Selected Professors"
                    className="p-button-sm"
                />
            </div>
        );
    };

    const professorsDialogFooter = (
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
                onClick={saveProfessor}
                aria-label="Salvar"
                className="p-button-sm"
            />
        </React.Fragment>
    );

    const actionBodyTemplate = (rowData: ProfessorRequestDTO) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-pencil"
                    rounded
                    outlined
                    className="mr-2 p-button-sm"
                    onClick={() => editProfessor(rowData)}
                    aria-label={`Edit ${rowData.name}`}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    onClick={() => confirmDeleteProfessor(rowData)}
                    aria-label={`Delete ${rowData.name}`}
                    className="p-button-sm"
                />
            </React.Fragment>
        );
    };

    const locationOptions = [
        { label: 'Interno', value: 'Interno' },
        { label: 'Externo', value: 'Externo' }
    ];

    const titleOptions = [
        { label: 'Licenciatura', value: 'Licenciatura' },
        { label: 'Bacharelado', value: 'Bacharelado' },
        { label: 'Mestre', value: 'Mestre' },
        { label: 'Doutor', value: 'Doutor' },
        { label: 'Pós Doutor', value: 'Pós Doutor' }
    ];

    const validateEmail = (email: string) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@ifnmg\.edu\.br$/;
        return emailRegex.test(email);
    }

    return (
        <div style={{ visibility: isReady ? 'visible' : 'hidden' }}>
            <div className="card m-2">
                <Toolbar
                    start={leftToolbarTemplate}
                    className="mb-4"
                />
                <DataTable
                    value={professors}
                    stripedRows
                    sortMode='multiple'
                    showGridlines
                    dataKey="id"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Exibindo {first} - {last} de {totalRecords} professores"
                    globalFilter={globalFilter}
                    header={header}
                    selection={selectedProfessors}
                    onSelectionChange={(e) => setSelectedProfessors(e.value as ProfessorRequestDTO[])}
                    size="small"
                    aria-label="Professors Table"
                >
                    <Column selectionMode="multiple" exportable={false} aria-label="Select" className='' />
                    <Column field="id" header="ID" aria-label="ID" />
                    <Column field="name" header="Nome" aria-label="Name" style={{ width: '20%' }} sortable
                        body={(rowData) => (
                            <div style={{ maxWidth: '40rem', whiteSpace: 'normal', wordWrap: 'break-word' }}>
                                {rowData.name}
                            </div>
                        )} />
                    <Column field="researchArea" header="Área de Pesquisa" aria-label="Research Area" style={{ width: '15%' }} sortable />
                    <Column field="email" header="E-mail" aria-label="Email" style={{ width: '15%' }} sortable />
                    <Column field="locationOfWork" header="Local de Atuação" sortable style={{ width: '10%' }} aria-label="Location of Work" sortable />
                    <Column header="Titulação" field="title" style={{ width: '10%' }} aria-label="Title" sortable />
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }} aria-label="Actions" />
                </DataTable>
            </div>

            <Dialog
                visible={professorDialog}
                style={{ width: '32rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header={dialogTitle}
                modal
                className="p-fluid"
                footer={professorsDialogFooter}
                onHide={hideDialog}
                aria-labelledby="professor-details-header"
            >
                <div className="field mb-4">
                    <label htmlFor="name" className="font-bold">
                        Nome
                    </label>
                    <InputText
                        id="name"
                        value={professor.name}
                        onChange={(e) => setProfessor({ ...professor, name: e.target.value })}
                        required
                        autoFocus
                        className={`border border-gray-300 p-2 rounded ${classNames({ 'p-invalid': submitted && !professor.name })}`}
                        aria-describedby="name-help"
                    />
                    {submitted && !professor.name && <small id="name-help" className="p-error">Este campo não pode ficar em branco.</small>}
                </div>
                <div className="field mb-4">
                    <label htmlFor="researchArea" className="font-bold">
                        Área de Pesquisa
                    </label>
                    <InputText
                        id="researchArea"
                        value={professor.researchArea}
                        onChange={(e) => setProfessor({ ...professor, researchArea: e.target.value })}
                        required
                        className="border border-gray-300 p-2 rounded"
                        aria-describedby="research-area-help"
                    />
                    {submitted && !professor.researchArea && <small id="name-help" className="p-error">Este campo não pode ficar em branco.</small>}
                </div>
                <div className="field mb-4">
                    <label htmlFor="email" className="font-bold">
                        E-mail
                    </label>
                    <InputText
                        id="email"
                        value={professor.email}
                        onChange={(e) => setProfessor({ ...professor, email: e.target.value })}
                        required
                        className="border border-gray-300 p-2 rounded"
                        aria-describedby="email-help"
                    />
                    {submitted && !(validateEmail(professor.email)) && <small id="name-help" className="p-error">O e-mail deve ser no formato @ifnmg.edu.br</small>}
                </div>
                <div className="field mb-4">
                    <label htmlFor="locationOfWork" className="font-bold">
                        Local de Atuação
                    </label>
                    <Dropdown
                        id="locationOfWork"
                        value={professor.locationOfWork}
                        options={locationOptions}
                        onChange={(e) => setProfessor({ ...professor, locationOfWork: e.value })}
                        required
                        className="border border-gray-300 rounded p-2 h-10 flex items-center"
                        aria-describedby="location-of-work-help"
                    />
                    {submitted && !professor.locationOfWork && <small id="name-help" className="p-error">Este campo não pode ficar em branco.</small>}
                </div>
                <div className="field mb-4">
                    <label htmlFor="title" className="font-bold">
                        Título
                    </label>
                    <Dropdown
                        id="title"
                        value={professor.title}
                        options={titleOptions}
                        onChange={(e) => setProfessor({ ...professor, title: e.value })}
                        required
                        className="border border-gray-300 rounded p-2 h-10 flex items-center"
                        aria-describedby="title-help"
                    />
                    {submitted && !professor.title && <small id="name-help" className="p-error">Este campo não pode ficar em branco.</small>}
                </div>
            </Dialog>

            <Dialog
                header="Confirmar remoção"
                visible={deleteProfessorDialog}
                onHide={() => setDeleteProfessorDialog(false)}
                style={{ width: '30rem' }}
                footer={
                    <React.Fragment>
                        <Button
                            label="Cancelar"
                            icon="pi pi-times"
                            outlined
                            onClick={() => setDeleteProfessorDialog(false)}
                            aria-label="Cancelar"
                            className="p-button-sm"
                        />
                        <Button
                            label="remover"
                            icon="pi pi-check"
                            severity="danger"
                            onClick={deleteProfessor}
                            aria-label="remover"
                            className="p-button-sm"
                        />
                    </React.Fragment>
                }
            >
                <p>Tem certeza de que deseja remover o professor <strong>{professor.name}</strong>?</p>
            </Dialog>

            <Dialog
                header="Confirmar remoção em Massa"
                visible={deleteSelectedProfessorsDialog}
                onHide={() => setDeleteSelectedProfessorsDialog(false)}
                style={{ width: '40rem' }}
                footer={
                    <React.Fragment>
                        <Button
                            label="Cancelar"
                            outlined
                            onClick={() => setDeleteSelectedProfessorsDialog(false)}
                            aria-label="Cancelar"
                            className="p-button-sm"
                        />
                        <Button
                            label="remover"
                            severity="danger"
                            onClick={confirmDeleteSelectedProfessors}
                            aria-label="remover"
                            className="p-button-sm"
                        />
                    </React.Fragment>
                }
            >
                <p>Tem certeza de que deseja remover os professores selecionados?</p>
            </Dialog>
            <div className="card flex justify-content-center">
                <Toast ref={toast} position="bottom-right" />
            </div>
        </div>
    );
}
