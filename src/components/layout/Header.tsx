import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Menu, X, User, LogOut } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const getDashboardPath = () => {
    if (!user) return "/";
    return user.user_type === "provider" ? "/provider-dashboard" : "/resident-dashboard";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
            <span className="text-sm font-bold text-white">CT</span>
          </div>
          <span className="text-xl font-bold text-foreground">Conectando Talentos</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/search" className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-smooth">
            <Search className="h-4 w-4" />
            <span>Buscar Serviços</span>
          </Link>
          
          {user ? (
            <>
              <Link to={getDashboardPath()} className="text-sm font-medium text-foreground hover:text-primary transition-smooth">
                Dashboard
              </Link>
              {user.user_type === "provider" && (
                <Link to="/my-services" className="text-sm font-medium text-foreground hover:text-primary transition-smooth">
                  Meus Serviços
                </Link>
              )}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Olá, {user.full_name}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Entrar
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-gradient-primary text-white hover:opacity-90 transition-smooth">
                  Cadastrar
                </Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="container mx-auto flex flex-col space-y-2 p-4">
            <Link 
              to="/search" 
              className="flex items-center space-x-2 py-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
              onClick={() => setIsMenuOpen(false)}
            >
              <Search className="h-4 w-4" />
              <span>Buscar Serviços</span>
            </Link>
            
            {user ? (
              <>
                <Link 
                  to={getDashboardPath()} 
                  className="py-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {user.user_type === "provider" && (
                  <Link 
                    to="/my-services" 
                    className="py-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Meus Serviços
                  </Link>
                )}
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm text-muted-foreground">Olá, {user.full_name}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-1"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sair</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-2 pt-2 border-t">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    Entrar
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button size="sm" className="w-full bg-gradient-primary text-white hover:opacity-90 transition-smooth">
                    Cadastrar
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;