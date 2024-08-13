import TableTCC from "../../../components/TableTCC";

export default function ManageCursosPage() {
    return (
        <>
            <div className=" justify-center items-center">
                <h1 className="text-center text-3xl font-bold mt-8 mb-16">Gerenciamento de TCCs</h1>
                <div className=" ">
                    <TableTCC />
                </div>
            </div>
        </>
    )
}