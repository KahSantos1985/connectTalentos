import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Users, Shield, Clock } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProviderCard from "@/components/ui/ProviderCard";

interface DesktopHomePageProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  featuredProviders: any[];
}

const DesktopHomePage = ({ searchQuery, setSearchQuery, handleSearch, featuredProviders }: DesktopHomePageProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Conecte-se aos
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
              Melhores Talentos
            </span>
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Encontre prestadores de serviços confiáveis na sua região com base na confiança da comunidade
          </p>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input 
                type="text" 
                placeholder="O que você precisa? Ex: limpeza, jardinagem, manutenção..." 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)} 
                className="pl-10 h-12 bg-white/90 backdrop-blur-sm border-white/20 focus:border-white" 
              />
            </div>
            <Button type="submit" size="lg" className="bg-white text-primary hover:bg-white/90 transition-smooth">
              Buscar
            </Button>
          </form>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gradient-subtle">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Por que escolher nossa plataforma?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Confiança Verificada</h3>
              <p className="text-muted-foreground">
                Todos os prestadores são verificados e avaliados pela comunidade
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-secondary rounded-full flex items-center justify-center">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Rápido e Fácil</h3>
              <p className="text-muted-foreground">
                Encontre e contrate serviços em poucos cliques
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Comunidade Local</h3>
              <p className="text-muted-foreground">
                Conecte-se com profissionais da sua região
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Providers */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">
              Prestadores em Destaque
            </h2>
            <Button variant="outline" onClick={() => navigate("/search")}>
              Ver Todos
            </Button>
          </div>
          
          {featuredProviders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProviders.map(provider => (
                <ProviderCard key={provider.id} {...provider} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Nenhum prestador cadastrado ainda
              </h3>
              <p className="text-muted-foreground mb-6">
                Seja o primeiro a oferecer seus serviços!
              </p>
              <Button onClick={() => navigate("/register")}>
                Cadastre-se como Prestador
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-hero">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para começar?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Cadastre-se agora e faça parte da nossa comunidade
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/register?type=resident")} className="bg-white hover:bg-white/90 transition-smooth text-blue-500">
              Sou Cliente
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/register?type=provider")} className="border-white hover:bg-white transition-smooth text-blue-500">
              Sou Prestador
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DesktopHomePage;