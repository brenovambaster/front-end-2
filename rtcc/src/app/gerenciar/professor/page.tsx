
import './professor.css';

import 'primeicons/primeicons.css';
import 'primereact/resources/themes/tailwind-light/theme.css';
import TableProf from "../../../components/TableProf";


export default function ManageProfessorsPage() {
  return (
    <main >
      <div className=" justify-center items-center">
        <h1 className="text-center text-2xl font-bold my-4">Gerenciamento de Professores</h1>
        <div className=" ">
          <TableProf />
        </div>
      </div>

    </main >
  )
}