interface FooterProps {
    margin?: string; 
}

const Footer: React.FC<FooterProps> = ({ margin = "0" }) => {
    return (
        <footer className={`bg-gray-200 p-4 text-center text-sm text-gray-600 w-full mt-${margin}`}>
            <p>Repositório Institucional - RTCCIF</p>
            <p>INSTITUTO FEDERAL DO NORTE DE MINAS GERAIS</p>
        </footer>
    );
};

export default Footer;