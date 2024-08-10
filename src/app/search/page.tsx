
export default function Component() {
    return (
      <div className="flex flex-col gap-8 w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Página de Busca</h1>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row items-center">
        <input
      className="flex h-10 w-full ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1 rounded-md border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
      type="search"
      placeholder="Pesquisar..."
    />
        <button className="inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-md px-4 py-2 text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 mr-2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          Pesquisar
        </button>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="results-per-page"
          >
            Resultados/Página
          </label>
          <button
            type="button"
            role="combobox"
            aria-controls="radix-:r1o:"
            aria-expanded="false"
            aria-autocomplete="none"
            dir="ltr"
            data-state="closed"
            className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-24"
          >
            <span style={{ pointerEvents: 'none' }}>10</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-chevron-down h-4 w-4 opacity-50"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6"></path>
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row items-center">
          <div className="flex items-center gap-4">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="sort-by"
            >
              Ordenar por
            </label>
            <button
              type="button"
              role="combobox"
              aria-controls="radix-:r1t:"
              aria-expanded="false"
              aria-autocomplete="none"
              dir="ltr"
              data-state="closed"
              className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-48"
            >
              <span style={{ pointerEvents: 'none' }}>Relevância</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-chevron-down h-4 w-4 opacity-50"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              role="combobox"
              aria-controls="radix-:r22:"
              aria-expanded="false"
              aria-autocomplete="none"
              dir="ltr"
              data-state="closed"
              className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-24"
            >
              <span style={{ pointerEvents: 'none' }}>Ascendente</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-chevron-down h-4 w-4 opacity-50"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </button>
            <button className="inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-md px-4 py-2 text-sm">
              Atualizar
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&amp;_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Data de defesa
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Pré-visualização
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Título
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Autor
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Orientador
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Programa
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Tipo de documento
                </th>
              </tr>
            </thead>
            <tbody className="[&amp;_tr:last-child]:border-0">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">2023-05-15</td>
                <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                  <img
                    src="/placeholder.svg"
                    alt="Pré-visualização"
                    width="80"
                    height="100"
                    className="rounded-md"
                    style={{ aspectRatio: '80 / 100', objectFit: 'cover' }}
                  />
                </td>
                <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                  Impacto da Inteligência Artificial na Educação
                </td>
                <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">João Silva</td>
                <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">Maria Oliveira</td>
                <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                  Programa de Pós-Graduação em Educação
                </td>
                <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">Dissertação de Mestrado</td>
              </tr>
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">2023-06-10</td>
                <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                  <img
                    src="/placeholder.svg"
                    alt="Pré-visualização"
                    width="80"
                    height="100"
                    className="rounded-md"
                    style={{ aspectRatio: '80 / 100', objectFit: 'cover' }}
                  />
                </td>
                <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                  Análise do Crescimento Urbano e Sustentabilidade
                </td>
                <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">Ana Paula</td>
                <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">Carlos Mendes</td>
                <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                  Programa de Pós-Graduação em Urbanismo
                </td>
                <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">Tese de Doutorado</td>
              </tr>
              {/* Adicione mais linhas conforme necessário */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
