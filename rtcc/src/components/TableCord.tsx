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
        ProfessorService.getProfessors().then(data => setProfessors(data));
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
                    setProfessors([...professors, newProfessor]);
                }
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
        try {
            await ProfessorService.deleteProfessor(professor.id);
            setProfessors(professors.filter(val => val.id !== professor.id));
            setDeleteProfessorDialog(false);
            setProfessor(emptyProfessor);
        } catch (error) {
            console.error("Erro ao excluir professor:", error);
        }
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Professors</h4>
            <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                    <i className="pi pi-search" aria-hidden="true" />
                </span>
                <InputText
                    type="search"
                    onInput={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search..."
                    aria-label="Search professors"
                />
            </div>
        </div>
    );

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button
                    label="New"
                    icon="pi pi-plus"
                    severity="success"
                    onClick={openNew}
                    aria-label="New Professor"
                />
                <Button
                    label="Delete"
                    icon="pi pi-trash"
                    severity="danger"
                    disabled={!selectedProfessors}
                    aria-label="Delete Selected Professors"
                />
            </div>
        );
    };

    const professorsDialogFooter = (
        <React.Fragment>
            <Button
                label="Cancel"
                icon="pi pi-times"
                outlined
                onClick={hideDialog}
                aria-label="Cancel"
            />
            <Button
                label="Save"
                icon="pi pi-check"
                onClick={saveProfessor}
                aria-label="Save"
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
                    className="mr-2"
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
                />
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" aria-label="Export Data" />;
    };

    const footer = `In total there are ${professors.length} professors.`;

    return (
        <div>
            <div className="card m-2">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
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
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} professors"
                    globalFilter={globalFilter}
                    header={header}
                    selection={selectedProfessors}
                    onSelectionChange={(e) => setSelectedProfessors(e.value)}
                    size="small"
                    aria-label="Professors Table"
                >
                    <Column selectionMode="multiple" exportable={false} aria-label="Select" className='' />
                    <Column field="id" header="ID" aria-label="ID" />
                    <Column field="name" header="Name" aria-label="Name" />
                    <Column field="researchArea" header="Research Area" aria-label="Research Area" />
                    <Column field="email" header="Email" aria-label="Email" />
                    <Column field="locationOfWork" header="Location of Work" sortable style={{ width: '25%' }} aria-label="Location of Work" />
                    <Column header="Title" body={statusBodyTemplate} sortable style={{ width: '25%' }} aria-label="Title" />
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }} aria-label="Actions" />
                </DataTable>
            </div>

            <Dialog
                visible={professorDialog}
                style={{ width: '32rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header="Professor Details"
                modal
                className="p-fluid"
                footer={professorsDialogFooter}
                onHide={hideDialog}
                aria-labelledby="professor-details-header"
            >
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Name
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
                    {submitted && !professor.name && <small id="name-help" className="p-error">Name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="researchArea" className="font-bold">
                        Research Area
                    </label>
                    <InputTextarea
                        id="researchArea"
                        value={professor.researchArea}
                        onChange={(e) => setProfessor({ ...professor, researchArea: e.target.value })}
                        required
                        rows={3}
                        cols={20}
                        className="border border-gray-300 p-2 rounded"
                        aria-describedby="research-area-help"
                    />
                </div>
                <div className="field">
                    <label htmlFor="email" className="font-bold">
                        Email
                    </label>
                    <InputText
                        id="email"
                        value={professor.email}
                        onChange={(e) => setProfessor({ ...professor, email: e.target.value })}
                        required
                        className="border border-gray-300 p-2 rounded"
                        aria-describedby="email-help"
                    />
                </div>
                <div className="field">
                    <label htmlFor="locationOfWork" className="font-bold">
                        Location of Work
                    </label>
                    <InputText
                        id="locationOfWork"
                        value={professor.locationOfWork}
                        onChange={(e) => setProfessor({ ...professor, locationOfWork: e.target.value })}
                        required
                        className="border border-gray-300 p-2 rounded"
                        aria-describedby="location-of-work-help"
                    />
                </div>
                <div className="field">
                    <label htmlFor="title" className="font-bold">
                        Title
                    </label>
                    <InputText
                        id="title"
                        value={professor.title}
                        onChange={(e) => setProfessor({ ...professor, title: e.target.value })}
                        required
                        className="border border-gray-300 p-2 rounded"
                        aria-describedby="title-help"
                    />
                </div>
            </Dialog>

            <Dialog
                visible={deleteProfessorDialog}
                style={{ width: '450px' }}
                header="Confirm"
                modal
                footer={
                    <React.Fragment>
                        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={() => setDeleteProfessorDialog(false)} aria-label="No" />
                        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProfessor} aria-label="Yes" />
                    </React.Fragment>
                }
                onHide={() => setDeleteProfessorDialog(false)}
                aria-labelledby="confirm-delete-header"
            >
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                    {professor && <span>Are you sure you want to delete <b>{professor.name}</b>?</span>}
                </div>
            </Dialog>
        </div>
    );
}
