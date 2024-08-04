
import TableCurso from "../../../components/TableCurso";


export default function Home() {
  return (
    <main >

      <div className=" justify-center items-center">
        <h1 className="text-center text-2xl font-bold my-4">Gerenciamento de Cursos</h1>
        <div className=" ">
          <TableCurso />
        </div>
      </div>

    </main >
  )
}