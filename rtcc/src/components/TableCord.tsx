import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useState } from 'react';
import { ProfessorService } from '../service/ProfessorService';
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
    const [deleteProfessorDialog, setDeleteProfessorDialog] = useState<boolean>(false);
    const [professor, setProfessor] = useState<ProfessorRequestDTO>(emptyProfessor);
    const [selectedProfessors, setSelectedProfessors] = useState<ProfessorRequestDTO[] | null>(null);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [deleteSelectedProfessorsDialog, setDeleteSelectedProfessorsDialog] = useState<boolean>(false);


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

    const validateFields = () => {
        return professor.name && professor.researchArea && professor.email && professor.locationOfWork && professor.title;
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
                    setProfessor(emptyProfessor);

                    window.location.reload();
                } catch (error) {
                    console.error("Erro ao salvar professor:", error);
                }
            }
        }
        setSubmitted(true);
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

        window.location.reload();
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
            } catch (error) {
                console.error("Erro ao excluir professores:", error);
            }
            setDeleteSelectedProfessorsDialog(false);
        }

        window.location.reload();
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            {/* <h4 className="m-0">Gerenciar Professores</h4> */}
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
                    label="Cadastrar Professor"
                    icon="pi pi-plus"
                    severity="success"
                    onClick={openNew}
                    aria-label="New Professor"
                />
                <Button
                    label="Inativar Selecionados"
                    icon="pi pi-trash"
                    severity="danger"
                    disabled={!selectedProfessors || selectedProfessors.length === 0}
                    onClick={deleteProfessors}
                    aria-label="Delete Selected Professors"
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
            />
            <Button
                label="Salvar"
                icon="pi pi-check"
                onClick={saveProfessor}
                aria-label="Salvar"
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
        // return <Button label="Export" icon="pi pi-upload" className="p-button-help" aria-label="Export Data" />;
    };

    const footer = `In total there are ${professors.length} professors.`;
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
                    currentPageReportTemplate="Exibindo {first} - {last} de {totalRecords} professores"
                    globalFilter={globalFilter}
                    header={header}
                    selection={selectedProfessors}
                    onSelectionChange={(e) => setSelectedProfessors(e.value)}
                    size="small"
                    aria-label="Professors Table"
                >
                    <Column selectionMode="multiple" exportable={false} aria-label="Select" className='' />
                    <Column field="id" header="ID" aria-label="ID" />
                    <Column field="name" header="Nome" aria-label="Name" />
                    <Column field="researchArea" header="Área de Pesquisa" aria-label="Research Area" />
                    <Column field="email" header="E-mail" aria-label="Email" />
                    <Column field="locationOfWork" header="Local de Atuação" sortable style={{ width: '25%' }} aria-label="Location of Work" />
                    <Column header="Titulação" body={statusBodyTemplate} sortable style={{ width: '25%' }} aria-label="Title" />
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }} aria-label="Actions" />
                </DataTable>
            </div>

            <Dialog
                visible={professorDialog}
                style={{ width: '32rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header="Editar Professor"
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
                    {submitted && !professor.email && <small id="name-help" className="p-error">Este campo não pode ficar em branco.</small>}

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
                header="Confirmar Inativação"
                visible={deleteProfessorDialog}
                onHide={() => setDeleteProfessorDialog(false)}
                footer={
                    <React.Fragment>
                        <Button
                            label="Cancelar"
                            icon="pi pi-times"
                            outlined
                            onClick={() => setDeleteProfessorDialog(false)}
                            aria-label="Cancelar"
                        />
                        <Button
                            label="Inativar"
                            icon="pi pi-check"
                            severity="danger"
                            onClick={deleteProfessor}
                            aria-label="Inativar"
                        />
                    </React.Fragment>
                }
            >
                <p>Tem certeza de que deseja excluir o professor <strong>{professor.name}</strong>?</p>
            </Dialog>

            <Dialog
                header="Confirmar Inativação em Massa"
                visible={deleteSelectedProfessorsDialog}
                onHide={() => setDeleteSelectedProfessorsDialog(false)}
                footer={
                    <React.Fragment>
                        <Button
                            label="Cancelar"
                            outlined
                            onClick={() => setDeleteSelectedProfessorsDialog(false)}
                            aria-label="Cancelar"
                        />
                        <Button
                            label="Inativar"
                            severity="danger"
                            onClick={confirmDeleteSelectedProfessors}
                            aria-label="Inativar"
                        />
                    </React.Fragment>
                }
            >
                <p>Tem certeza de que deseja excluir os professores selecionados?</p>
            </Dialog>
        </div>
    );
}
