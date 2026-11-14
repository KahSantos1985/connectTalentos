import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-subtle border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                <span className="text-sm font-bold text-white">CT</span>
              </div>
              <span className="text-lg font-bold text-foreground">Conectando Talentos</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Conectando prestadores de serviços a clientes com confiança e qualidade.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Links Rápidos</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/search" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                Buscar Serviços
              </Link>
              <Link to="/register" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                Cadastre-se
              </Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                Sobre Nós
              </Link>
            </nav>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Categorias</h3>
            <nav className="flex flex-col space-y-2">
              <span className="text-sm text-muted-foreground">Limpeza</span>
              <span className="text-sm text-muted-foreground">Jardinagem</span>
              <span className="text-sm text-muted-foreground">Manutenção</span>
              <span className="text-sm text-muted-foreground">Beleza</span>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Contato</h3>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">contato@conectandotalentos.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">(11) 9999-9999</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">São Paulo, SP</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Conectando Talentos. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                Privacidade
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;