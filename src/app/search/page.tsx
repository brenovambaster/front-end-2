'use client';

import { CursoService } from '@/service/CursoService';
import { ProfessorService } from '@/service/ProfessorService';
import { TCCService } from '@/service/TCCService';
import { FilterTCCRequestDTO } from '@/types';
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, DataTableStateEvent } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState } from 'react';
import InputMask from 'react-input-mask';
import TCC from '../tcc/[id]/page';


export default function Component() {
    const [TCCs, setTCCs] = useState<any[]>([]);
    const [first, setFirst] = useState<number>(0);
    const [rows, setRows] = useState<number>(10);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterQuery, setFilterQuery] = useState('');
    const [courses, setCourses] = useState<any[]>([]);
    const [professors, setProfessors] = useState<any[]>([]);
    const [filter, setFilter] = useState<FilterTCCRequestDTO | null>(null);


    // const professors = [{ label: 'Dr. João', value: 'Dr. João' }, { label: 'Dra. Maria', value: 'Dra. Maria' }];
    const authors = [{ label: 'Carlos Alberto', value: 'Carlos Alberto' }, { label: 'Maria Silva', value: 'Maria Silva' }];
    // const courses = [{ label: 'Administração', value: 'Administração' }, { label: 'Engenharia de Computação', value: 'Engenharia de Computação' }];


    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {

        CursoService.getCursos().then((data) => setCourses(data));
        ProfessorService.getProfessors().then((data) => setProfessors(data));

        const search = searchParams.get('query');

        if (search) {
            TCCService.searchTCCs(`/search?query=${search}`).then((data) => setTCCs(data));
        } else {
            TCCService.getTCCs().then((data) => setTCCs(data));
        }

        console.log(JSON.stringify(courses));

    }, [first, rows, location.search]);

    const onPageChange = (event: DataTableStateEvent) => {
        setFirst(event.first || 0);
        setRows(event.rows || 10);
    };

    const [selectedFilter, setSelectedFilter] = useState(null);
    const [searchValue, setSearchValue] = useState('');

    const filterOptions = [
        { name: 'Data da Defesa', value: 'date' },
        { name: 'Título', value: 'title' },
        { name: 'Orientador', value: 'advisor' },
        { name: 'Autor', value: 'author' },
        { name: 'Curso', value: 'course' },
        { name: 'Palavra-chave', value: 'keyword' }
    ];

    const getPlaceholder = () => {
        switch (selectedFilter) {
            case 'date': return 'Digite a data (DD/MM/AAAA)';
            case 'title': return 'Digite o título...';
            case 'advisor': return 'Selecione o orientador';
            case 'author': return 'Selecione o autor...';
            case 'course': return 'Selecione o curso';
            case 'keyword': return 'Digite a palavra-chave...';
            default: return '';
        }
    };

    const handleFilterChange = (e) => {
        setSelectedFilter(e.value);
        setSearchValue('');
    };

    const handleSearchChange = (e) => {
        // setSearchQuery(e.target.value);
        // setFilterQuery(e.target.value);
        setSearchValue(e.target.value);
    };

    const formatDate = (rowData: any) => {
        if (!rowData || !rowData.defenseDate) {
            return '';
        }

        const [year, month, day] = rowData.defenseDate.split('-');
        return `${day}/${month}/${year}`;
    };


    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
        if (
            (e.type === "keydown" && (e as React.KeyboardEvent).key === "Enter") ||
            e.type === "click"
        ) {
            const search = searchParams.get('query');

            if ((searchQuery.trim() != "")) {
                TCCService.searchTCCs(`/search?query=${searchQuery}`).then((data) => setTCCs(data));
                router.push(`/search?query=${decodeURIComponent(searchQuery)}`);
            }
        }
    };

    const handleFilter = (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
        if (
            (e.type === "keydown" && (e as React.KeyboardEvent).key === "Enter") ||
            e.type === "click"
        ) {
            if (selectedFilter && searchValue) {
                const filter = { filter: selectedFilter, value: searchValue };
                
                setFilter(filter);

                alert(JSON.stringify(filter));
                
                TCCService.filterTCCs(filter).then((data) => setTCCs(data));
            }
        }
    }
    
            

    const renderInputField = () => {
        switch (selectedFilter) {
            case 'date':
                return (
                    <InputMask
                        mask="99/99/9999"
                        id='dateInput'
                        value={searchValue}
                        onChange={handleSearchChange}
                        placeholder={getPlaceholder()}
                        className="w-[300px] h-10 pl-3 pr-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                            style={{ display: 'flex', alignItems: 'center' }}

                    />
                );
            case 'advisor':
                return (
                    <Dropdown
                        value={searchValue}
                        options={professors.map(professor => professor.name)}
                        onChange={handleSearchChange}
                        placeholder={getPlaceholder()}
                        className="w-[300px] h-10 pl-3 pr-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                            style={{ display: 'flex', alignItems: 'center' }}

                    />
                );
            case 'author':
                return (
                    <Dropdown
                        value={searchValue}
                        options={authors}
                        onChange={handleSearchChange}
                        placeholder={getPlaceholder()}
                        className="w-[300px] h-10 pl-3 pr-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                            style={{ display: 'flex', alignItems: 'center' }}

                    />
                );
            case 'course':
                return (
                    <Dropdown
                        value={searchValue}
                        options={courses.map(course => course.name)}
                        onChange={handleSearchChange}
                        placeholder={getPlaceholder()}
                        className="w-[300px] h-10 pl-3 pr-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                            style={{ display: 'flex', alignItems: 'center' }}

                    />
                );
            default:
                return (
                    <InputText
                        value={searchValue}
                        onChange={handleSearchChange}
                        placeholder={getPlaceholder()}
                        className="w-[300px] h-10 pl-3 pr-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                );
        }
    };

    return (
        <div className="flex flex-col items-center gap-8 px-8 py-10">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Página de Busca</h1>
            </div>

            <div className="w-full max-w-7xl mt-4 border border-gray-300 rounded-md shadow-sm p-4 bg-gray-100">
                <div className="flex justify-between items-center gap-4 mb-4">
                    <div className="relative flex-grow">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center text-gray-500">
                            <i className="pi pi-search" style={{ fontSize: "1.25rem" }}></i>
                        </div>

                        <input
                            className="flex h-10 border-2 border-gray-300 px-3 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-md bg-background pl-12 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Pesquisar..."
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                    </div>
                    <div className="flex-shrink-0">
                        <Button className="p-button-sm h-10 flex items-center" onClick={handleSearch}>
                            <i className="pi pi-search"></i>
                            <span className="ml-2 text-sm"><b>Pesquisar</b></span>
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row items-center">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium"><b>Filtrar por:</b></label>
                        <Dropdown
                            value={selectedFilter}
                            onChange={handleFilterChange}
                            options={filterOptions}
                            optionLabel="name"
                            placeholder="Selecione um filtro"
                            className="min-w-[220px] h-10 border-2 border-gray-300 rounded-md flex items-center"
                            style={{ display: 'flex', alignItems: 'center' }}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        {renderInputField()}
                    </div>
                    <div className="flex-shrink-0">
                        <Button className="p-button-sm h-10 flex items-center" onClick={handleFilter}>
                            <span className="text-sm"><b>Aplicar</b></span>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-7xl">
                <label className="text-base font-medium"><b>Resultados Encontrados:</b></label>
                <div className="overflow-x-auto pt-3">
                    <DataTable
                        value={TCCs}
                        paginator
                        rows={rows}
                        first={first}
                        onPage={onPageChange}
                        globalFilter={globalFilter}
                        className="w-full text-sm border border-gray-200 rounded-sm"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Exibindo {first} - {last} de {totalRecords} TCCs"
                        rowsPerPageOptions={[10, 20, 30]}
                        size="small"
                        paginatorClassName="text-xs" /* Ajuste o tamanho da fonte do paginator */
                        emptyMessage="Nenhum TCC correspondente foi encontrado."
                    >
                        <Column
                            field="defenseDate" header="Data de defesa"
                            className="px-4 py-4"
                            headerClassName="font-semibold bg-gray-200 text-left"
                            style={{ minWidth: '150px', textAlign: 'left', paddingLeft: '8px', paddingRight: '8px' }}
                            body={formatDate}
                            sortable
                        />
                        <Column
                            field="title"
                            header="Título"
                            sortable
                            className="px-4 py-4"
                            headerClassName="font-semibold bg-gray-200 text-left"
                            style={{ minWidth: '200px', textAlign: 'left', paddingLeft: '8px', paddingRight: '8px' }}
                        />
                        <Column
                            field="author"
                            header="Autor"
                            sortable
                            className="px-4 py-4"
                            headerClassName="font-semibold bg-gray-200 text-left"
                            style={{ minWidth: '200px', textAlign: 'left', paddingLeft: '8px', paddingRight: '8px' }}
                        />
                        <Column
                            field="advisor"
                            header="Orientador"
                            sortable
                            className="px-4 py-4"
                            headerClassName="font-semibold bg-gray-200 text-left"
                            style={{ minWidth: '200px', textAlign: 'left', paddingLeft: '8px', paddingRight: '8px' }}
                            body={(rowData) => rowData.advisor?.name}
                        />
                        <Column
                            field="course"
                            header="Curso"
                            sortable
                            className="px-4 py-4"
                            headerClassName="font-semibold bg-gray-200 text-left"
                            style={{ minWidth: '150px', textAlign: 'left', paddingLeft: '8px', paddingRight: '8px' }}
                            body={(rowData) => rowData.course?.name}
                        />
                        <Column
                            field="keywords"
                            header="Palavras-Chave"
                            sortable
                            className="px-4 py-4"
                            headerClassName="font-semibold bg-gray-200 text-left"
                            style={{ minWidth: '150px', textAlign: 'left', paddingLeft: '8px', paddingRight: '8px' }}
                            body={(rowData) => rowData.keywords}
                        />
                    </DataTable>
                </div>
            </div>
        </div>
    );
}
