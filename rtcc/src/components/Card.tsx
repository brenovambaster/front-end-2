interface CardProps {
    produto: string;
    valor: number;
    descricao: string;
}

export default function Card(props: CardProps) {

    return (
        <div className="felx flex-col border m-2">
            <h1 className="flex">{props.produto}</h1>
            <p className="m-2">{props.valor}</p>
        </div>
    )
}