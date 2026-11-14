import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Wrench, Hammer, Paintbrush, Droplet, Zap, Scissors } from "lucide-react";
import MobileHeader from "@/components/layout/MobileHeader";
import BottomNavigation from "@/components/layout/BottomNavigation";
import CategoryCard from "@/components/ui/CategoryCard";
import ProviderCard from "@/components/ui/ProviderCard";

interface MobileHomePageProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  featuredProviders: any[];
}

const MobileHomePage = ({ searchQuery, setSearchQuery, handleSearch, featuredProviders }: MobileHomePageProps) => {
  const navigate = useNavigate();

  const categories = [
    { icon: Scissors, label: "Limpeza", search: "limpeza" },
    { icon: Wrench, label: "Manutenção", search: "manutenção" },
    { icon: Hammer, label: "Jardinagem", search: "jardinagem" },
    { icon: Droplet, label: "Encanamento", search: "encanamento" },
    { icon: Zap, label: "Elétrica", search: "elétrica" },
    { icon: Paintbrush, label: "Pintura", search: "pintura" }
  ];

  const handleCategoryClick = (searchTerm: string) => {
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      <MobileHeader />
      
      {/* Hero Section - Mobile Optimized */}
      <section className="bg-gradient-hero px-4 pt-6 pb-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-white mb-2">
            Encontre o serviço ideal
          </h1>
          <p className="text-blue-100 mb-6 text-sm">
            Conecte-se com prestadores qualificados na sua região
          </p>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 z-10" />
            <Input 
              type="text" 
              placeholder="Buscar serviços..." 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              className="pl-12 h-12 bg-white rounded-full border-0 focus:ring-2 focus:ring-white/50 text-foreground placeholder:text-muted-foreground"
            />
          </form>
        </div>
      </section>

      {/* Categories Section */}
      <section className="px-4 py-6 bg-muted/30">
        <h2 className="text-lg font-semibold text-foreground mb-4">Categorias</h2>
        <div className="grid grid-cols-3 gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.label}
              icon={category.icon}
              label={category.label}
              onClick={() => handleCategoryClick(category.search)}
            />
          ))}
        </div>
      </section>

      {/* Featured Services */}
      <section className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Serviços em destaque
          </h2>
          <Button 
            variant="link" 
            onClick={() => navigate("/search")}
            className="text-primary text-sm p-0 h-auto"
          >
            Ver todos
          </Button>
        </div>
        
        {featuredProviders.length > 0 ? (
          <div className="space-y-4">
            {featuredProviders.slice(0, 2).map(provider => (
              <ProviderCard key={provider.id} {...provider} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 px-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nenhum prestador cadastrado ainda
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Seja o primeiro a oferecer seus serviços!
            </p>
            <Button onClick={() => navigate("/register")} size="sm">
              Cadastre-se como Prestador
            </Button>
          </div>
        )}
      </section>

      <BottomNavigation />
    </div>
  );
};

export default MobileHomePage;