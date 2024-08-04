import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useState } from 'react';
import { CursoService } from '../service/CursoService';
import { CursoRequestDTO } from '../types';


export default function CursosDemo() {
    const emptyCurso: CursoRequestDTO = {
        id: '',
        name: '',
        campus: '',
        codeOfCourse: ''
    };

    const campusOptions = [
        { label: 'Montes Claros', value: 'Montes Claros' },
    ];    

    const [cursos, setCursos] = useState<CursoRequestDTO[]>([]);
    const [globalFilter, setGlobalFilter] = useState<string | null>(null);
    const [cursoDialog, setCursoDialog] = useState<boolean>(false);
    const [deleteCursoDialog, setDeleteCursoDialog] = useState<boolean>(false);
    const [curso, setCurso] = useState<CursoRequestDTO>(emptyCurso);
    const [selectedCursos, setSelectedCursos] = useState<CursoRequestDTO[] | null>(null);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [deleteSelectedCursosDialog, setDeleteSelectedCursosDialog] = useState<boolean>(false);

    useEffect(() => {
        CursoService.getCursos().then(data => setCursos(data));
    }, []);

    const openNew = () => {
        setCurso(emptyCurso);
        setSubmitted(false);
        setCursoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setCursoDialog(false);
    };

    const validateFields = () => {
        return curso.name && curso.campus && curso.codeOfCourse;
    };

    const saveCurso = async () => {
        if (validateFields()) {
            if (curso.name.trim()) {
                try {
                    if (curso.id) {
                        // Atualizar curso existente
                        await CursoService.updateCurso(curso);
                        setCursos(cursos.map(c => (c.id === curso.id ? curso : c)));
                    } else {
                        // Criar novo curso
                        const newCurso = await CursoService.createCurso(curso);
                        setCursos([...cursos, newCurso]);
                    }

                    setCursoDialog(false);
                    setCurso(emptyCurso);
                    window.location.reload();
                } catch (error) {
                    console.error("Erro ao salvar curso:", error);
                }
            }
        }
        setSubmitted(true);
    };

    const editCurso = (curso: CursoRequestDTO) => {
        setCurso({ ...curso });
        setCursoDialog(true);
    };

    const confirmDeleteCurso = (curso: CursoRequestDTO) => {
        setCurso(curso);
        setDeleteCursoDialog(true);
    };

    const deleteCurso = async () => {
        try {
            await CursoService.deleteCurso(curso.id);
            setCursos(cursos.filter(val => val.id !== curso.id));
            setDeleteCursoDialog(false);
            setCurso(emptyCurso);
        } catch (error) {
            console.error("Erro ao inativar curso:", error);
        }
        window.location.reload();
    };

    const deleteCursos = () => {
        if (selectedCursos && selectedCursos.length > 0) {
            setDeleteSelectedCursosDialog(true);
        }
    };

    const confirmDeleteSelectedCursos = async () => {
        if (selectedCursos) {
            try {
                await CursoService.deleteCursos(selectedCursos.map(c => c.id));
                setCursos(cursos.filter(c => !selectedCursos.includes(c)));
                setSelectedCursos(null);
            } catch (error) {
                console.error("Erro ao inativar cursos:", error);
            }
            setDeleteSelectedCursosDialog(false);
        }
        window.location.reload();
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                    <i className="pi pi-search" aria-hidden="true" />
                </span>
                <InputText
                    type="search"
                    onInput={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search..."
                    aria-label="Search courses"
                />
            </div>
        </div>
    );

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button
                    label="Cadastrar Curso"
                    icon="pi pi-plus"
                    severity="success"
                    onClick={openNew}
                    aria-label="New Course"
                    className="p-button-sm" 
                />
                <Button
                    label="Inativar Selecionados"
                    icon="pi pi-trash"
                    severity="danger"
                    disabled={!selectedCursos || selectedCursos.length === 0}
                    onClick={deleteCursos}
                    aria-label="Delete Selected Courses"
                    className="p-button-sm" 
                />
            </div>
        );
    };

    const cursosDialogFooter = (
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
                onClick={saveCurso}
                aria-label="Salvar"
                className="p-button-sm" 
            />
        </React.Fragment>
    );

    const actionBodyTemplate = (rowData: CursoRequestDTO) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-pencil"
                    rounded
                    outlined
                    className="mr-2"
                    onClick={() => editCurso(rowData)}
                    aria-label={`Edit ${rowData.name}`}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    onClick={() => confirmDeleteCurso(rowData)}
                    aria-label={`Delete ${rowData.name}`}
                />
            </React.Fragment>
        );
    };

    return (
        <div>
            <div className="card m-2">
                <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                <DataTable
                    value={cursos}
                    stripedRows
                    sortMode='multiple'
                    showGridlines
                    dataKey="id"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Exibindo {first} - {last} de {totalRecords} cursos"
                    globalFilter={globalFilter}
                    header={header}
                    selection={selectedCursos}
                    onSelectionChange={(e) => setSelectedCursos(e.value)}
                    size="small"
                    aria-label="Courses Table"
                >
                    <Column selectionMode="multiple" exportable={false} aria-label="Select" className='' />
                    <Column field="id" header="ID" aria-label="ID" />
                    <Column field="name" header="Nome" aria-label="Name" />
                    <Column field="campus" header="Campus" aria-label="Campus" />
                    <Column field="codeOfCourse" header="Código" aria-label="Code" />
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }} aria-label="Actions" />
                </DataTable>
            </div>

            <Dialog
                visible={cursoDialog}
                style={{ width: '32rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header="Editar Curso"
                modal
                className="p-fluid"
                footer={cursosDialogFooter}
                onHide={hideDialog}
                aria-labelledby="curso-details-header"
            >
                <div className="field mb-4">
                    <label htmlFor="name" className="font-bold">
                        Nome
                    </label>
                    <InputText
                        id="name"
                        value={curso.name}
                        onChange={(e) => setCurso({ ...curso, name: e.target.value })}
                        required
                        autoFocus
                        className={`border border-gray-300 p-2 rounded ${classNames({ 'p-invalid': submitted && !curso.name })}`}
                        aria-describedby="name-help"
                    />
                    {submitted && !curso.name && <small id="name-help" className="p-error">Este campo não pode ficar em branco.</small>}
                </div>
                <div className="field mb-4">
                    <label htmlFor="campus" className="font-bold">
                        Campus
                    </label>
                    <Dropdown
                        id="campus"
                        value={curso.campus}
                        options={campusOptions}
                        onChange={(e) => setCurso({ ...curso, campus: e.value })}
                        placeholder="Selecione o Campus"
                        className="border border-gray-300 rounded p-2 h-10 flex items-center"
                        aria-describedby="campus-help"
                    />
                    {submitted && !curso.campus && <small id="campus-help" className="p-error">Este campo não pode ficar em branco.</small>}
                </div>
                <div className="field mb-4">
                    <label htmlFor="code" className="font-bold">
                        Código
                    </label>
                    <InputText
                        id="code"
                        value={curso.codeOfCourse}
                        onChange={(e) => setCurso({ ...curso, codeOfCourse: e.target.value })}
                        required
                        className="border border-gray-300 p-2 rounded"
                        aria-describedby="code-help"
                    />
                    {submitted && !curso.codeOfCourse && <small id="code-help" className="p-error">Este campo não pode ficar em branco.</small>}
                </div>
            </Dialog>

            <Dialog
                visible={deleteCursoDialog}
                style={{ width: '40rem' }}
                header="Confirmar Inativação"
                modal
                footer={
                    <React.Fragment>
                        <Button
                            label="Cancelar"
                            icon="pi pi-times"
                            outlined
                            onClick={() => setDeleteCursoDialog(false)}
                            aria-label="Cancelar"
                            className="p-button-sm" 
                        />
                        <Button
                            label="Excluir"
                            icon="pi pi-check"
                            severity="danger"
                            onClick={deleteCurso}
                            aria-label="Excluir"
                            className="p-button-sm" 
                        />
                    </React.Fragment>
                }
                onHide={() => setDeleteCursoDialog(false)}
                aria-labelledby="confirm-delete-header"
            >
                <div className="flex items-center">
                    <span>Você tem certeza que deseja inativar o curso <b>{curso.name}</b>?</span>
                </div>
            </Dialog>

            <Dialog
                visible={deleteSelectedCursosDialog}
                style={{ width: '40rem' }}
                header="Confirmar Inativação"
                modal
                footer={
                    <React.Fragment>
                        <Button
                            label="Cancelar"
                            icon="pi pi-times"
                            outlined
                            onClick={() => setDeleteSelectedCursosDialog(false)}
                            aria-label="Cancelar"
                            className="p-button-sm" 
                        />
                        <Button
                            label="Excluir"
                            icon="pi pi-check"
                            severity="danger"
                            onClick={confirmDeleteSelectedCursos}
                            aria-label="Excluir"
                            className="p-button-sm" 
                        />
                    </React.Fragment>
                }
                onHide={() => setDeleteSelectedCursosDialog(false)}
                aria-labelledby="confirm-delete-selected-header"
            >
                <div className="flex align-items-center">
                    <span>Você tem certeza que deseja inativar os cursos selecionados?</span>
                </div>
            </Dialog>
        </div>
    );
}
