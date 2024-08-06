import TableCurso from "../../../components/TableCoord";

export default function ManageCursosPage() {
  return (
    <>
      <div className=" justify-center items-center">
        <h1 className="text-center text-3xl font-bold mt-8 mb-16">Gerenciamento de Coordenadores</h1>
        <div className=" ">
          <TableCurso />
        </div>
      </div>
    </>
  )
}