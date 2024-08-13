"use client";

import { CursoService } from "@/service/CursoService";
import { ProfessorService } from "@/service/ProfessorService";
import Fuse from "fuse.js";
import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";
import { Chips } from "primereact/chips";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { MultiSelect } from "primereact/multiselect";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import React, { useEffect, useRef, useState } from "react";
import { TCCService } from "../service/TCCService";
import { TCCRequestDTO, TCCResponseDTO } from "../types";

export default function TCCManagement() {
    const emptyTCC: TCCRequestDTO = {
        id: "",
        title: "", // Título
        author: "", // Autor
        course: "", // Curso
        defenseDate: "", // Data da Defesa
        advisor: "", // Orientador
        committeeMembers: [], // Membros da Banca como array de ''s
        summary: "", // Resumo
        abstractText: "", // A  bstract
        keywords: [], // Palavras-chave como array de ''s
        language: "", // Idioma
        tcc: undefined, // Arquivo PDF
    };

    const [TCCs, setTCCs] = useState<TCCRequestDTO[]>([]);
    const [globalFilter, setGlobalFilter] = useState<string | null>(null);
    const [TCCDialog, setTCCDialog] = useState<boolean>(false);
    const [editTCCDialog, setEditTCCDialog] = useState<boolean>(false);
    const [deleteTCCDialog, setDeleteTCCDialog] = useState<boolean>(false);
    const [TCC, setTCC] = useState<TCCRequestDTO>(emptyTCC);
    const [selectedTCCs, setSelectedTCCs] = useState<TCCRequestDTO[] | null>(null);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [deleteSelectedTCCsDialog, setDeleteSelectedTCCsDialog] = useState<boolean>(false);
    const toast = useRef<Toast>(null);
    const [dialogTitle, setDialogTitle] = useState<string>("Novo TCC");
    const [currentKeyword, setCurrentKeyword] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const autoCompleteRef = useRef(null);
    const [courseOptions, setCourseOptions] = useState([]);
    const [professorOptions, setProfessorOptions] = useState([]);

    useEffect(() => {
        TCCService.getTCCs().then((data) => setTCCs(data));
        CursoService.getCursos().then((data) => setCourseOptions(data));
        ProfessorService.getProfessors().then((data) => setProfessorOptions(data));

        if (typeof TCC.keywords === 'string') {
            setTCC({ ...TCC, keywords: TCC.keywords.split(',').map((keyword: string) => keyword.trim()) });
        }
    }, [TCCs, TCC, selectedTCCs]);


    const languageOptions = [
        { label: "Português", value: "Português" },
        { label: "Inglês", value: "Inglês" },
    ];

    const keywordOptions = [
        "Matemática",
        "Computação",
        "Machine Learning",
        "Data Science",
        "Engenharia",
    ];

    const fuse = new Fuse(keywordOptions, {
        includeScore: true,
        threshold: 0.4,
        ignoreLocation: true,
        distance: 100,
        keys: ["keyword"],
    });

    const search = (event) => {
        const result = fuse.search(event.query);
        setSuggestions(result.map((result) => result.item));
    };

    const addKeyword = (keyword) => {
        if (keyword && !TCC.keywords.includes(keyword)) {
            setTCC({ ...TCC, keywords: [...TCC.keywords, keyword] });
        }
        setCurrentKeyword("");
        if (autoCompleteRef.current) {
            autoCompleteRef.current.hide();
        }
    };

    const handleSelect = (e) => {
        addKeyword(e.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && currentKeyword.trim()) {
            addKeyword(currentKeyword);
            e.preventDefault();
        }
    };

    const openNew = () => {
        setTCC(emptyTCC);
        setSubmitted(false);
        setTCCDialog(true);
        setEditTCCDialog(false);
        setDialogTitle("Novo TCC");
    };

    const hideDialog = () => {
        setSubmitted(false);
        setTCCDialog(false);
        setEditTCCDialog(false);
    };

    const validateFields = () => {
        return (
            TCC.title && TCC.title.trim() !== '' &&

            TCC.author && TCC.author.trim() !== '' &&

            TCC.course &&

            TCC.defenseDate && !isNaN(Date.parse(TCC.defenseDate)) &&

            TCC.advisor && TCC.advisor.id && TCC.advisor.id.trim() !== '' &&

            Array.isArray(TCC.committeeMembers) &&
            TCC.committeeMembers.length === 2 &&
            TCC.committeeMembers.every(member => member.id && member.id.trim() !== '') &&

            TCC.summary && TCC.summary.trim() !== '' &&

            TCC.abstractText && TCC.abstractText.trim() !== '' &&

            Array.isArray(TCC.keywords) && TCC.keywords.length > 0 &&

            TCC.language && TCC.language.trim() !== '' &&

            TCC.tcc && TCC.tcc.objectURL && TCC.tcc.objectURL.trim() !== ''
        );
    };


    const saveTCC = async () => {
        if (validateFields()) {
            const formData = new FormData();
            formData.append('tccData', JSON.stringify(TCC));

            if (TCC.tcc) {
                formData.append('file', TCC.tcc);
            }

            try {
                if (TCC.id) {
                    // Atualizar TCC existente
                    await TCCService.updateTCC(formData);
                    setTCCs(TCCs.map((p) => (p.id === TCC.id ? TCC : p)));
                } else {
                    // Criar novo TCC
                    const newTCC = await TCCService.createTCC(formData);
                    setTCCs([...TCCs, newTCC]);
                }
                setTCCDialog(false);
                toast.current.show({
                    severity: "success",
                    summary: "info",
                    detail: "Operação realizada com sucesso",
                    life: 3000,
                });

            } catch (error) {
                console.error("Erro ao salvar TCC:", error);
                toast.current.show({
                    severity: "error",
                    summary: "Erro",
                    detail: "Falha ao realizar a operação",
                    life: 3000,
                });
            }
        }

        setSubmitted(true);
    };

    const editTCC = (TCC: TCCRequestDTO) => {
        setTCC({ ...TCC });
        setTCCDialog(true);
        setEditTCCDialog(true);
        setDialogTitle("Editar TCC");
    };

    const confirmDeleteTCC = (TCC: TCCRequestDTO) => {
        setTCC(TCC);
        setDeleteTCCDialog(true);
    };

    const deleteTCC = async () => {
        try {
            await TCCService.deleteTCC(TCC.id);
            setTCCs(TCCs.filter((val) => val.id !== TCC.id));
            setDeleteTCCDialog(false);
            setTCC(emptyTCC);
            toast.current.show({
                severity: "error",
                summary: "info",
                detail: "TCC inativado com sucesso",
                life: 3000,
            });
        } catch (error) {
            console.error("Erro ao inativar TCC:", error);
        }
    };

    const deleteTCCs = () => {
        if (selectedTCCs && selectedTCCs.length > 0) {
            setDeleteSelectedTCCsDialog(true);
        }
    };

    const confirmDeleteSelectedTCCs = async () => {
        if (selectedTCCs) {
            try {
                await TCCService.deleteTCCs(selectedTCCs.map((p) => p.id));
                setTCCs(TCCs.filter((p) => !selectedTCCs.includes(p)));
                setSelectedTCCs(null);
                toast.current.show({
                    severity: "error",
                    summary: "info",
                    detail: "TCC inativado com sucesso",
                    life: 3000,
                });
            } catch (error) {
                console.error("Erro ao inativar TCCs:", error);
            }
            setDeleteSelectedTCCsDialog(false);
        }
    };

    const onFileSelect = (e) => {
        let selectedFile = e.files[0];
        setTCC((prevTCC) => ({ ...prevTCC, tcc: selectedFile }));
    };

    const onFileUpload = () => {
        toast.current.show({
            severity: "info",
            summary: "Success",
            detail: "Arquivo enviado com sucesso",
        });
    };

    const onFileRemove = (file) => {
        setTCC((prevTCC) => ({ ...prevTCC, tcc: undefined }));
    };

    const onFileClear = () => {
        setTCC((prevTCC) => ({ ...prevTCC, tcc: undefined }));
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                    <i className="pi pi-search" aria-hidden="true" />
                </span>
                <InputText
                    type="search"
                    onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)}
                    placeholder="Search..."
                    aria-label="Search TCCs"
                />
            </div>
        </div>
    );

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button
                    label="Cadastrar TCC"
                    icon="pi pi-plus"
                    severity="success"
                    onClick={openNew}
                    aria-label="New TCC"
                    className="p-button-sm"
                />
                <Button
                    label="Excluir Selecionados"
                    icon="pi pi-trash"
                    severity="danger"
                    disabled={!selectedTCCs || selectedTCCs.length === 0}
                    onClick={deleteTCCs}
                    aria-label="Delete Selected TCCs"
                    className="p-button-sm"
                />
            </div>
        );
    };

    const TCCsDialogFooter = (
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
                onClick={saveTCC}
                aria-label="Salvar"
                className="p-button-sm"
            />
        </React.Fragment>
    );

    const actionBodyTemplate = (rowData: TCCRequestDTO) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-pencil"
                    rounded
                    outlined
                    className="mr-2 p-button-sm"
                    onClick={() => editTCC(rowData)}
                    aria-label={`Edit ${rowData.name}`}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    onClick={() => confirmDeleteTCC(rowData)}
                    aria-label={`Delete ${rowData.name}`}
                    className="p-button-sm"
                />
            </React.Fragment>
        );
    };

    const renderCommitteeMembers = (rowData: TCCResponseDTO) => {
        return (
            <ul>
                {rowData.committeeMembers.map((member, index) => (
                    <li key={index}>{member.name}</li>
                ))}
            </ul>
        );
    };

    return (
        <div>
            <div className="card m-2">
                <Toolbar start={leftToolbarTemplate} className="mb-4" />
                <DataTable
                    value={TCCs}
                    stripedRows
                    sortMode="multiple"
                    showGridlines
                    dataKey="id"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Exibindo {first} - {last} de {totalRecords} TCCs"
                    globalFilter={globalFilter}
                    header={header}
                    selection={selectedTCCs}
                    onSelectionChange={(e) => setSelectedTCCs(e.value as TCCRequestDTO[])}
                    size="small"
                    aria-label="TCCs Table"
                >
                    <Column
                        selectionMode="multiple"
                        exportable={false}
                        aria-label="Select"
                        className=""
                    />
                    <Column
                        field="id"
                        header="ID"
                        aria-label="ID"
                        style={{ width: "10%" }}
                    />
                    <Column field="title" header="Título" aria-label="Título" />
                    <Column field="author" header="Autor" aria-label="Autor" />
                    <Column field="course.name" header="Curso" aria-label="Curso" />
                    <Column
                        field="defenseDate"
                        header="Data da Defesa"
                        aria-label="Data da Defesa"
                    />
                    <Column field="advisor.name" header="Orientador" aria-label="Orientador" />
                    <Column
                        body={renderCommitteeMembers}
                        header="Membros da Banca"
                        aria-label="Membros da Banca"
                    />
                    <Column field="summary" header="Resumo" aria-label="Resumo" />
                    <Column field="abstractText" header="abstractText" aria-label="Summary" />
                    <Column
                        field="keywords"
                        header="Palavras-chave"
                        aria-label="Palavras-chave"
                    />
                    <Column field="language" header="Idioma" aria-label="Idioma" />
                    <Column
                        body={actionBodyTemplate}
                        headerStyle={{ width: "8rem" }}
                        bodyStyle={{ textAlign: "center" }}
                        aria-label="Actions"
                    />
                </DataTable>
            </div>

            <Dialog
                visible={TCCDialog}
                onHide={hideDialog}
                style={{ width: "50rem" }}
                breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                header={dialogTitle}
                modal
                className="p-fluid"
                footer={TCCsDialogFooter}
                aria-labelledby="TCC-details-header"
            >
                <div className="field mb-4">
                    <label htmlFor="title" className="font-bold">
                        Título
                    </label>
                    <InputText
                        id="title"
                        value={TCC.title}
                        onChange={(e) => setTCC({ ...TCC, title: e.target.value })}
                        required
                        autoFocus
                        className="border border-gray-300 p-2 rounded"
                    />
                    {submitted && !TCC.title && (
                        <small className="p-error">
                            Este campo não pode ficar em branco.
                        </small>
                    )}
                </div>
                <div className="field mb-4">
                    <label htmlFor="author" className="font-bold">
                        Autor
                    </label>
                    <InputText
                        id="author"
                        value={TCC.author}
                        onChange={(e) => setTCC({ ...TCC, author: e.target.value })}
                        required
                        className="border border-gray-300 p-2 rounded"
                    />
                    {submitted && !TCC.author && (
                        <small className="p-error">
                            Este campo não pode ficar em branco.
                        </small>
                    )}
                </div>
                <div className="field mb-4">
                    <label htmlFor="course" className="font-bold">
                        Curso
                    </label>
                    <Dropdown
                        id="course"
                        value={editTCCDialog ? TCC.course.id : TCC.course}
                        options={courseOptions.map(course => ({ label: course.name, value: course.id }))}
                        onChange={(e) => setTCC({ ...TCC, course: e.value })}
                        required
                        className="border border-gray-300 rounded p-2 h-10 flex items-center"
                        placeholder="Selecione o curso"
                    />
                    {submitted && !TCC.course && (
                        <small className="p-error">
                            Este campo não pode ficar em branco.
                        </small>
                    )}
                </div>

                <div className="field mb-4">
                    <label htmlFor="defenseDate" className="font-bold">
                        Data da Defesa
                    </label>
                    <input
                        id="defenseDate"
                        type="date"
                        value={TCC.defenseDate || ""}
                        onChange={(e) => setTCC({ ...TCC, defenseDate: e.target.value })}
                        required
                        className="border border-gray-300 p-2 rounded w-full"
                        placeholder="Digite a data da defesa (dd/mm/aa)"
                    />
                    {submitted && !TCC.defenseDate && (
                        <small className="p-error">
                            Este campo não pode ficar em branco.
                        </small>
                    )}
                </div>

                <div className="field mb-4">
                    <label htmlFor="advisor" className="font-bold">
                        Orientador
                    </label>
                    <Dropdown
                        id="advisor"
                        value={editTCCDialog ? TCC.advisor.id : TCC.advisor.id}
                        options={professorOptions.map(professor => ({ label: professor.name, value: professor.id }))}
                        onChange={(e) => {
                            const selectedAdvisor = professorOptions.find(advisor => advisor.id === e.value);
                            setTCC({ ...TCC, advisor: { id: selectedAdvisor.id, name: selectedAdvisor.name } });
                        }}
                        required
                        placeholder="Selecione o orientador"
                        className="border border-gray-300 rounded p-2 h-10 flex items-center"
                    />
                    {submitted && !TCC.advisor && (
                        <small className="p-error">
                            Este campo não pode ficar em branco.
                        </small>
                    )}
                </div>


                <div className="field mb-4">
                    <label htmlFor="committeeMembers" className="font-bold">
                        Membros da Banca
                    </label>
                    <MultiSelect
                        id="committeeMembers"
                        value={TCC.committeeMembers.map(member => member.id)}
                        options={professorOptions.map(professor => ({
                            label: professor.name,
                            value: professor.id
                        }))}
                        onChange={(e) => {

                            setTCC(prevTCC => ({
                                ...prevTCC,
                                committeeMembers: professorOptions
                                    .filter(option => e.value.includes(option.id)) // Filtra os membros selecionados
                                    .map(option => ({
                                        id: option.id,
                                        name: option.label
                                    }))
                            }));
                        }}
                        required
                        className="border border-gray-300 rounded"
                        placeholder="Selecione os membros da banca"
                        display="chip"
                    />

                    {submitted &&
                        (!TCC.committeeMembers || TCC.committeeMembers.length !== 2) && (
                            <small className="p-error">
                                Selecione 2 membros.
                            </small>
                        )
                    }
                </div>

                <div className="field mb-4">
                    <label htmlFor="summary" className="font-bold">
                        Resumo
                    </label>
                    <InputTextarea
                        id="summary"
                        value={TCC.summary}
                        onChange={(e) => setTCC({ ...TCC, summary: e.target.value })}
                        required
                        rows={3}
                        className="border border-gray-300 p-2 rounded"
                    />
                    {submitted && !TCC.summary && (
                        <small className="p-error">
                            Este campo não pode ficar em branco.
                        </small>
                    )}
                </div>
                <div className="field mb-4">
                    <label htmlFor="abstractText" className="font-bold">
                        Abstract
                    </label>
                    <InputTextarea
                        id="abstractText"
                        value={TCC.abstractText}
                        onChange={(e) => setTCC({ ...TCC, abstractText: e.target.value })}
                        required
                        rows={3}
                        className="border border-gray-300 p-2 rounded"
                    />
                    {submitted && !TCC.abstractText && (
                        <small className="p-error">
                            Este campo não pode ficar em branco.
                        </small>
                    )}
                </div>
                <div className="field mb-4">
                    <label htmlFor="keywords" className="font-bold">
                        Palavras-chave
                    </label>
                    <div className="relative">
                        <AutoComplete
                            ref={autoCompleteRef}
                            id="keywords"
                            value={currentKeyword}
                            suggestions={suggestions}
                            completeMethod={search}
                            onChange={(e) => setCurrentKeyword(e.value)}
                            onSelect={handleSelect}
                            onKeyDown={handleKeyDown}
                            placeholder="Digite para adicionar palavras-chave existentes ou pressione Enter para adicionar uma nova"
                            className="p-2 rounded"
                            style={{
                                marginLeft: "-0.5rem",
                                marginRight: "-0.5rem",
                                width: "calc(100% + 1rem)",
                            }}
                        />
                        <Chips
                            value={TCC.keywords}
                            onChange={(e) => setTCC({ ...TCC, keywords: e.value })}
                            required
                            className="p-2 rounded"
                            style={{
                                marginLeft: "-0.5rem",
                                marginRight: "-0.5rem",
                                width: "calc(100% + 1rem)",
                            }}
                        />
                    </div>
                    {submitted && !TCC.keywords.length && (
                        <small className="p-error">
                            Este campo não pode ficar em branco.
                        </small>
                    )}
                </div>

                <div className="field mb-4">
                    <label htmlFor="language" className="font-bold">
                        Idioma
                    </label>
                    <Dropdown
                        id="language"
                        value={TCC.language}
                        options={languageOptions}
                        onChange={(e) => setTCC({ ...TCC, language: e.value })}
                        required
                        className="border border-gray-300 rounded p-2 h-10 flex items-center"
                        placeholder="Selecione o idioma"
                    />
                    {submitted && !TCC.language && (
                        <small className="p-error">
                            Este campo não pode ficar em branco.
                        </small>
                    )}
                </div>

                <div className="card flex flex-col w-full mt-5">
                    <label htmlFor="file-upload" className="font-bold mb-2">
                        Selecione o arquivo
                    </label>
                    <FileUpload
                        name="file-upload"
                        multiple={false} // Apenas um arquivo permitido
                        accept="application/pdf"
                        maxFileSize={100000000}
                        emptyTemplate={
                            <p className="m-0">Arraste e solte o arquivo PDF aqui.</p>
                        }
                        className="w-full"
                        chooseLabel={
                            <span className="text-sm px-3 py-2">Escolher Arquivo</span>
                        }
                        uploadLabel={<span className="text-sm px-3 py-2">Enviar</span>}
                        cancelLabel={<span className="text-sm px-3 py-2">Cancelar</span>}
                        onUpload={onFileUpload}
                        onSelect={onFileSelect}
                        onRemove={onFileRemove}
                        onClear={onFileClear}
                    />
                    {submitted && !TCC.tcc && (
                        <small className="p-error text-red-600">
                            Por favor, realize o upload do arquivo PDF.
                        </small>
                    )}
                </div>
            </Dialog>

            <Dialog
                header="Confirmar Inativação"
                visible={deleteTCCDialog}
                onHide={() => setDeleteTCCDialog(false)}
                footer={
                    <React.Fragment>
                        <Button
                            label="Cancelar"
                            icon="pi pi-times"
                            outlined
                            onClick={() => setDeleteTCCDialog(false)}
                            aria-label="Cancelar"
                            className="p-button-sm"
                        />
                        <Button
                            label="Inativar"
                            icon="pi pi-check"
                            severity="danger"
                            onClick={deleteTCC}
                            aria-label="Inativar"
                            className="p-button-sm"
                        />
                    </React.Fragment>
                }
            >
                <p>
                    Tem certeza de que deseja inativar o TCC <strong>{TCC.title}</strong>?
                </p>
            </Dialog>

            <Dialog
                header="Confirmar Inativação em Massa"
                visible={deleteSelectedTCCsDialog}
                onHide={() => setDeleteSelectedTCCsDialog(false)}
                footer={
                    <React.Fragment>
                        <Button
                            label="Cancelar"
                            outlined
                            onClick={() => setDeleteSelectedTCCsDialog(false)}
                            aria-label="Cancelar"
                            className="p-button-sm"
                        />
                        <Button
                            label="Inativar"
                            severity="danger"
                            onClick={confirmDeleteSelectedTCCs}
                            aria-label="Inativar"
                            className="p-button-sm"
                        />
                    </React.Fragment>
                }
            >
                <p>Tem certeza de que deseja inativar os TCCs selecionados?</p>
            </Dialog>
            <div className="card flex justify-content-center">
                <Toast ref={toast} position="bottom-right" />
            </div>
        </div>
    );
}
