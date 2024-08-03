import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { Tag } from 'primereact/tag';
import { ProfessorService } from '../service/ProfessorService';
import { ProfessorRequestDTO } from '../types';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { classNames } from 'primereact/utils';

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
    const [deleteProfessorDialog, setDeleteProfessorDialog] = useState<boolean>(false);
    const [professor, setProfessor] = useState<ProfessorRequestDTO>(emptyProfessor);
    const [selectedProfessors, setSelectedProfessors] = useState<ProfessorRequestDTO[] | null>(null);
    const [submitted, setSubmitted] = useState<boolean>(false);

    useEffect(() => {
        ProfessorService.getProfessors().then((data) => setProfessors(data));
    }, []);

    const statusBodyTemplate = (professor: ProfessorRequestDTO) => {
        return <Tag value={professor.title} />;
    };

    const openNew = () => {
        setProfessor(emptyProfessor);
        setSubmitted(false);
        setProfessorDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProfessorDialog(false);
    };

    const saveProfessor = async () => {
        setSubmitted(true);

        if (professor.name.trim()) {
            try {
                if (professor.id) {
                    // Atualizar professor existente
                    await ProfessorService.updateProfessor(professor);
                    setProfessors(professors.map(p => (p.id === professor.id ? professor : p)));
                } else {
                    // Criar novo professor
                    const newProfessor = await ProfessorService.createProfessor(professor);

                }
                setProfessors(await ProfessorService.getProfessors());
                setProfessorDialog(false);
                setProfessor(emptyProfessor);
            } catch (error) {
                console.error("Erro ao salvar professor:", error);
            }
        }
    };

    const editProfessor = (professor: ProfessorRequestDTO) => {
        setProfessor({ ...professor });
        setProfessorDialog(true);
    };

    const confirmDeleteProfessor = (professor: ProfessorRequestDTO) => {
        setProfessor(professor);
        setDeleteProfessorDialog(true);
    };

    const deleteProfessor = async () => {
        if (professor.id) {
            await ProfessorService.deleteProfessor(professor.id);
            setProfessors(professors.filter(val => val.id !== professor.id));
            setDeleteProfessorDialog(false);
            setProfessor(emptyProfessor);
        }
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Professors</h4>
            <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                    <i className="pi pi-search" />
                </span>
                <InputText
                    type="search"
                    onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                    placeholder="Search..."
                />
            </div>
        </div>
    );

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" severity="danger" disabled={!selectedProfessors || !selectedProfessors.length} />
            </div>
        );
    };

    const professorsDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveProfessor} />
        </React.Fragment>
    );

    const actionBodyTemplate = (rowData: ProfessorRequestDTO) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProfessor(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProfessor(rowData)} />
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" />;
    };

    const footer = `In total there are ${professors.length} professors.`;

    return (
        <div>
            <div className="card m-2">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                <DataTable
                    value={professors}
                    stripedRows
                    showGridlines
                    dataKey="id"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} professors"
                    globalFilter={globalFilter}
                    header={header}
                    selection={selectedProfessors}
                    onSelectionChange={(e) => setSelectedProfessors(e.value)}
                >
                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column field="id" header="ID"></Column>
                    <Column field="name" header="Name"></Column>
                    <Column field="researchArea" header="Research Area"></Column>
                    <Column field="email" header="Email"></Column>
                    <Column field="locationOfWork" header="Location of Work" sortable style={{ width: '25%' }}></Column>
                    <Column header="Title" body={statusBodyTemplate} sortable style={{ width: '25%' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={professorDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Professor Details" modal className="p-fluid" footer={professorsDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Name
                    </label>
                    <InputText id="name" value={professor.name} onChange={(e) => setProfessor({ ...professor, name: e.target.value })} required autoFocus className={classNames({ 'p-invalid': submitted && !professor.name })} />
                    {submitted && !professor.name && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="researchArea" className="font-bold">
                        Research Area
                    </label>
                    <InputTextarea id="researchArea" value={professor.researchArea} onChange={(e) => setProfessor({ ...professor, researchArea: e.target.value })} required rows={3} cols={20} />
                </div>
                <div className="field">
                    <label htmlFor="email" className="font-bold">
                        Email
                    </label>
                    <InputText id="email" value={professor.email} onChange={(e) => setProfessor({ ...professor, email: e.target.value })} required />
                </div>
                <div className="field">
                    <label htmlFor="locationOfWork" className="font-bold">
                        Location of Work
                    </label>
                    <InputText id="locationOfWork" value={professor.locationOfWork} onChange={(e) => setProfessor({ ...professor, locationOfWork: e.target.value })} required />
                </div>
                <div className="field">
                    <label htmlFor="title" className="font-bold">
                        Title
                    </label>
                    <InputText id="title" value={professor.title} onChange={(e) => setProfessor({ ...professor, title: e.target.value })} required />
                </div>
            </Dialog>

            <Dialog visible={deleteProfessorDialog} style={{ width: '450px' }} header="Confirm" modal footer={(
                <React.Fragment>
                    <Button label="No" icon="pi pi-times" className="p-button-text" onClick={() => setDeleteProfessorDialog(false)} />
                    <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProfessor} />
                </React.Fragment>
            )} onHide={() => setDeleteProfessorDialog(false)}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                    {professor && <span>Are you sure you want to delete <b>{professor.name}</b>?</span>}
                </div>
            </Dialog>
        </div>
    );
}
