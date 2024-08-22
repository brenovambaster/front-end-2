'use client';

import { AuthContext } from "@/contexts/AuthContext";
import TableTCC from "../../../../components/TableTCC";
import { useContext } from "react";

export default function ManageCursosPage() {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <>
            <div className=" justify-center items-center">
                <h1 className="text-center text-3xl font-bold mt-8 mb-16">Gerenciamento de TCCs</h1>
                <div className=" ">
                    <TableTCC />
                </div>
                <p>Autenticado? {JSON.stringify(isAuthenticated)}</p>
            </div>
        </>
    )
}