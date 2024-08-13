import TableCurso from "../../../components/TableCurso";


export default function ManageCursosPage() {
    return (
        <main >
            <div className=" justify-center items-center">
                <h1 className="text-center text-3xl font-bold mt-8 mb-16">Gerenciamento de Cursos</h1>
                <div className=" ">
                    <TableCurso />
                </div>
            </div>

        </main >
    )
}