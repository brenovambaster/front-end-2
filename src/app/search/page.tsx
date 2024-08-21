'use client';

import { CursoService } from '@/service/CursoService';
import { ProfessorService } from '@/service/ProfessorService';
import { TCCService } from '@/service/TCCService';
import { TCCResponseDTO } from '@/types';
import { AxiosResponse } from 'axios';
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, DataTableStateEvent } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useEffect, useRef, useState } from 'react';
import InputMask from 'react-input-mask';

export default function Component() {
    const [TCCs, setTCCs] = useState<any[]>([]);
    const [allTCCs, setAllTCCs] = useState<any[]>([]);
    const [first, setFirst] = useState<number>(0);
    const [rows, setRows] = useState<number>(10);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [courses, setCourses] = useState<any[]>([]);
    const [professors, setProfessors] = useState<any[]>([]);
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [dateFilterOption, setDateFilterOption] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState('');
    const [filterSearchValue, setFilterSearchValue] = useState('');
    const toast = useRef<Toast>(null);

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        CursoService.getCursos().then((data) => setCourses(data));
        ProfessorService.getProfessors().then((data) => setProfessors(data));

        const fetchTCCs = async () => {
            try {
                const search = searchParams.get('query');
                if (search) {
                    const data = await TCCService.searchTCCs(`/search?query=${search}`);
                    setTCCs(data);
                    setAllTCCs(data);
                } else {
                    const data = await TCCService.getTCCs();
                    setTCCs(data);
                    setAllTCCs(data);
                }
            } catch (error) {
                console.error('Error fetching TCCs:', error);
                toast.current?.show({ severity: 'error', detail: 'Ocorreu um erro ao buscar os TCCs.', life: 5000 });
            }
        };

        fetchTCCs();
    }, [first, rows, location.search]);

    useEffect(() => {
        if (selectedFilter !== null) {
            setDateFilterOption(null);
            setSelectedMonth(null);
            setSelectedYear(null);
            setSearchValue('');
        }
    }, [selectedFilter]);


    const onPageChange = (event: DataTableStateEvent) => {
        setFirst(event.first || 0);
        setRows(event.rows || 10);
    };

    function isAxiosResponseOfTCCResponseDTOArray(response: any): response is AxiosResponse<TCCResponseDTO[], any> {
        return response && response.data && Array.isArray(response.data);
    }

    const filterOptions = [
        { name: 'Data da Defesa', value: 'defense_date' },
        { name: 'Título', value: 'title' },
        { name: 'Orientador', value: 'advisor' },
        { name: 'Autor', value: 'author' },
        { name: 'Curso', value: 'course' },
        { name: 'Palavra-chave', value: 'keywords' }
    ];

    const dateFilterOptions = [
        { label: 'Mês e Ano', value: 'month_year' },
        { label: 'Ano', value: 'year' },
        { label: 'Data Completa', value: 'defense_date' }
    ];

    const months = [
        { label: 'Janeiro', value: '01' }, { label: 'Fevereiro', value: '02' }, { label: 'Março', value: '03' },
        { label: 'Abril', value: '04' }, { label: 'Maio', value: '05' }, { label: 'Junho', value: '06' },
        { label: 'Julho', value: '07' }, { label: 'Agosto', value: '08' }, { label: 'Setembro', value: '09' },
        { label: 'Outubro', value: '10' }, { label: 'Novembro', value: '11' }, { label: 'Dezembro', value: '12' }
    ];

    const years = Array.from({ length: 30 }, (_, index) => ({
        label: `${new Date().getFullYear() - index}`,
        value: `${new Date().getFullYear() - index}`
    }));

    const getPlaceholder = () => {
        switch (selectedFilter) {
            case 'defense_date':
                if (dateFilterOption === 'month_year') return 'Selecione o mês e ano';
                if (dateFilterOption === 'year') return 'Selecione o ano';
                return 'Digite a data (DD/MM/AAAA)';
            case 'title': return 'Digite o título...';
            case 'advisor': return 'Selecione o orientador';
            case 'author': return 'Digite o nome do autor...';
            case 'course': return 'Selecione o curso';
            case 'keywords': return 'Digite a palavra-chave...';
            default: return '';
        }
    };

    const handleFilterChange = (e) => {
        setSelectedFilter(e.value);
        setSearchValue('');
        setDateFilterOption(null);
        setFilterSearchValue('');
    };

    const handleFilterSearchChange = (e) => {
        setFilterSearchValue(e.target.value);
    }

    const handleDateFilterOptionChange = (e) => {
        setDateFilterOption(e.value);
        setSearchValue('');
        setFilterSearchValue('');
    };

    const formatDate = (rowData: any) => {
        if (!rowData || !rowData.defenseDate) {
            return '';
        }
        const [year, month, day] = rowData.defenseDate.split('-');
        return `${day}/${month}/${year}`;
    };

    const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
        if (
            (e.type === "keydown" && (e as React.KeyboardEvent).key === "Enter") ||
            e.type === "click"
        ) {
            if (searchQuery.trim() !== "") {
                try {
                    searchQuery.replace(/[^a-zA-Z0-9áéíóúãõçÁÉÍÓÚÃÕÀàÈèÌìÒòÙù\s]/g, '');
                    const data = await TCCService.searchTCCs(`/search?query=${searchQuery}`);
                    setTCCs(data);
                    router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
                } catch (error) {
                    toast.current?.show({ severity: 'error', detail: 'Ocorreu um erro ao buscar os TCCs.', life: 5000 });
                }
            }
        }
    };

    const handleFilter = async (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {

        if (
            (e.type === "keydown" && (e as React.KeyboardEvent).key === "Enter") ||
            e.type === "click"
        ) {

            if (selectedFilter && filterSearchValue.trim() !== '' && selectedFilter != 'defense_date') {

                let filterValue = filterSearchValue;

                if (selectedFilter === 'advisor') {

                    const professor = professors.find(prof => prof.name.toLowerCase() === filterSearchValue.toLowerCase());
                    if (professor) {
                        filterValue = professor.id;
                    }
                }

                if (selectedFilter === 'course') {
                    const course = courses.find(course => course.name.toLowerCase() === filterSearchValue.toLowerCase());
                    if (course) {
                        filterValue = course.id;
                    }
                }
                const filter = { filter: selectedFilter, value: filterValue };

                try {
                    const data = await TCCService.filterTCCs(filter);
                    setTCCs(data);
                } catch (error) {
                    console.error('Error fetching TCCs:', error);
                    toast.current?.show({ severity: 'error', detail: 'Ocorreu um erro ao buscar os TCCs.', life: 5000 });
                }
            }

            if (selectedFilter === 'defense_date' && dateFilterOption) {

                let filterValue = filterSearchValue;

                if (dateFilterOption === 'month_year' && selectedMonth !== null && selectedYear !== null) {

                    filterValue = `${selectedYear}_${selectedMonth}`;
                    const filter = { filter: dateFilterOption, value: filterValue };

                    try {
                        const data = await TCCService.filterTCCs(filter);
                        setTCCs(data);
                    } catch (error) {
                        console.error('Error fetching TCCs:', error);
                        toast.current?.show({ severity: 'error', detail: 'Ocorreu um erro ao buscar os TCCs.', life: 5000 });
                    }

                } else if (dateFilterOption === 'year' && selectedYear !== null) {

                    filterValue = selectedYear;
                    const filter = { filter: dateFilterOption, value: filterValue };

                    try {
                        const data = await TCCService.filterTCCs(filter);
                        setTCCs(data);
                    } catch (error) {
                        console.error('Error fetching TCCs:', error);
                        toast.current?.show({ severity: 'error', detail: 'Ocorreu um erro ao buscar os TCCs.', life: 5000 });
                    }

                } else if (dateFilterOption === 'defense_date' && filterSearchValue) {
                    const [day, month, year] = filterSearchValue.split('/');
                    filterValue = `${year}-${month}-${day}`;

                    if (!(day.includes('_') || month.includes('_') || year.includes('_'))) {

                        const filter = { filter: selectedFilter, value: filterValue };

                        try {
                            const data = await TCCService.filterTCCs(filter);
                            setTCCs(data);
                        } catch (error) {
                            console.error('Error fetching TCCs:', error);
                            toast.current?.show({ severity: 'error', detail: 'Ocorreu um erro ao buscar os TCCs.', life: 5000 });
                        }
                    }
                }
            }
        }
    };

    const renderInputField = () => {
        if (selectedFilter === 'defense_date') {
            return (
                <div className="flex gap-4 items-center">
                    <Dropdown
                        value={dateFilterOption}
                        options={dateFilterOptions}
                        onChange={handleDateFilterOptionChange}
                        placeholder="Filtrar data por..."
                        className="h-10 border-2 border-gray-300 rounded-md"
                        style={{ width: '200px', display: 'flex', alignItems: 'center' }}
                    />

                    {dateFilterOption === 'month_year' && (
                        <>
                            <Dropdown
                                value={selectedMonth}
                                options={months}
                                onChange={(e) => setSelectedMonth(e.value)}
                                placeholder="Selecione o mês"
                                className="w-[150px] h-10 border-2 border-gray-300 rounded-md"
                                style={{ display: 'flex', alignItems: 'center', width: '200px' }}
                            />
                            <Dropdown
                                value={selectedYear}
                                options={allTCCs.map(tcc => tcc.defenseDate.split('-')[0])
                                    .filter((value, index, self) => self.indexOf(value) === index)
                                    .map(year => ({ label: year, value: year }))
                                }
                                onChange={(e) => setSelectedYear(e.value)}
                                placeholder="Selecione o ano"
                                className="w-[150px] h-10 border-2 border-gray-300 rounded-md"
                                style={{ display: 'flex', alignItems: 'center', width: '200px' }}
                            />
                        </>
                    )}

                    {dateFilterOption === 'year' && (
                        <Dropdown
                            value={selectedYear}
                            options={
                                allTCCs.map(tcc => tcc.defenseDate.split('-')[0])
                                    .filter((value, index, self) => self.indexOf(value) === index)
                                    .map(year => ({ label: year, value: year }))
                            }
                            onChange={(e) => setSelectedYear(e.value)}
                            placeholder="Selecione o ano"
                            className="w-[150px] h-10 border-2 border-gray-300 rounded-md"
                            style={{ display: 'flex', alignItems: 'center', width: '200px' }}
                        />
                    )}

                    {dateFilterOption === 'defense_date' && (
                        <InputMask
                            mask="99/99/9999"
                            value={filterSearchValue}
                            onChange={handleFilterSearchChange}
                            placeholder={getPlaceholder()}
                            className="w-[300px] h-10 pl-3 pr-4 border-2 border-gray-300 rounded-md"
                        />
                    )}
                </div>
            );
        }

        switch (selectedFilter) {
            case 'advisor':
                return (
                    <Dropdown
                        value={filterSearchValue}
                        options={professors.map(prof => ({ label: prof.name, value: prof.name }))}
                        onChange={(e) => setFilterSearchValue(e.value)}
                        placeholder={getPlaceholder()}
                        className="w-[300px] h-10 border-2 border-gray-300 rounded-md"
                        style={{ display: 'flex', alignItems: 'center' }}
                    />
                );
            case 'author':
                return (
                    <InputText
                        value={filterSearchValue}
                        onChange={handleFilterSearchChange}
                        placeholder={getPlaceholder()}
                        className="w-[300px] h-10 pl-3 pr-4 border-2 border-gray-300 rounded-md"
                        onKeyDown={handleFilter}
                    />
                );
            case 'course':
                return (
                    <Dropdown
                        value={filterSearchValue}
                        options={courses.map(course => ({ label: course.name, value: course.name }))}
                        onChange={(e) => setFilterSearchValue(e.value)}
                        placeholder={getPlaceholder()}
                        className="w-[300px] h-10 border-2 border-gray-300 rounded-md"
                        style={{ display: 'flex', alignItems: 'center' }}
                    />
                );
            default:
                return (
                    <InputText
                        value={filterSearchValue}
                        onChange={handleFilterSearchChange}
                        placeholder={getPlaceholder()}
                        className="w-[300px] h-10 pl-3 pr-4 border-2 border-gray-300 rounded-md"
                        onKeyDown={handleFilter}
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
                        <Button className="p-button-sm h-10 flex items-center" onClick={handleFilter} >
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
                        paginatorClassName="text-xs"
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
                            body={(rowData) => rowData.keywords.map((keyword) => keyword.name).join(', ')}
                        />
                    </DataTable>
                </div>
            </div>
            <div className="card flex justify-content-center">
                <Toast ref={toast} position="bottom-right" />
            </div>
        </div>
    );
}
