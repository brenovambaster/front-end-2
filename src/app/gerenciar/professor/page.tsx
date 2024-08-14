import TableProf from "../../../components/TableProf";


export default function ManageProfessorsPage() {
    return (
        <main >
            <div className=" justify-center items-center">
                <h1 className="text-center text-3xl font-bold mt-8 mb-16">Gerenciamento de Professores</h1>
                <div className=" ">
                    <TableProf />
                </div>
            </div>

        </main >
    )
}