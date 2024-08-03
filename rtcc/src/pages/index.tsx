// src/pages/index.tsx
import TableCord from "../components/TableCord";


export default function Home() {
  return (
    <main >

      <div className=" justify-center items-center">
        <h1 className="text-center text-2xl font-bold my-4">Gerenciamento de Professores</h1>
        <div className=" ">
          <TableCord />
        </div>
      </div>

    </main >
  )
}