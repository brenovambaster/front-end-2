'use client';

import TableCoord from "../../../../components/TableCoord";
import withAdminProtection from "@/hoc/withAdminProtection";

function ManageCursosPage() {
    return (
        <>
            <div className=" justify-center items-center">
                <h1 className="text-center text-3xl font-bold mt-8 mb-16">Gerenciamento de Coordenadores</h1>
                <div className=" ">
                    <TableCoord />
                </div>
            </div>
        </>
    )
}


export default withAdminProtection(ManageCursosPage);