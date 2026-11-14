import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProviderCard from "@/components/ui/ProviderCard";
import { useRankedProviders } from "@/hooks/useRankedProviders";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Usar ranking inteligente de ML
  const { data: providers = [], isLoading } = useRankedProviders(
    selectedCategory || undefined,
    selectedLocation || undefined
  );

  const categories = [
    "Limpeza",
    "Jardinagem",
    "Elétrica",
    "Encanamento",
    "Pintura",
    "Marcenaria",
    "Tecnologia",
    "Cuidados Pessoais",
    "Educação",
    "Outros"
  ];

  const locations = [
    "São Paulo",
    "Rio de Janeiro",
    "Belo Horizonte",
    "Curitiba",
    "Porto Alegre",
    "Salvador",
    "Brasília",
    "Fortaleza"
  ];

  // Filtrar por query de busca no texto e mapear para formato do ProviderCard
  const filteredProviders = providers
    .filter(provider => {
      if (!searchQuery) return true;
      
      const searchLower = searchQuery.toLowerCase();
      const matchesName = provider.nome_completo.toLowerCase().includes(searchLower);
      const matchesService = provider.servicos.some(s =>
        s.titulo_servico.toLowerCase().includes(searchLower) ||
        s.descricao.toLowerCase().includes(searchLower)
      );
      
      return matchesName || matchesService;
    })
    .flatMap(provider =>
      // Criar um card para cada serviço do prestador
      provider.servicos.map(service => ({
        id: `${provider.id}-${service.id}`,
        providerName: provider.nome_completo,
        serviceTitle: service.titulo_servico,
        category: service.categoria,
        description: service.descricao,
        location: `${provider.endereco_bairro}, ${provider.endereco_cidade}`,
        rating: 0, // TODO: calcular baseado em avaliações
        reviewCount: 0, // TODO: buscar do banco
        priceRange: service.preco_unico
          ? `R$ ${service.preco_unico}`
          : service.preco_por_hora
          ? `R$ ${service.preco_por_hora}/hora`
          : "Sob consulta",
        isAvailable: true,
        imageUrl: provider.foto_perfil_url
      }))
    );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: searchQuery });
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedLocation("");
    setSearchQuery("");
    setSearchParams({});
  };

  const activeFiltersCount = [selectedCategory, selectedLocation, searchQuery].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Buscar Serviços
          </h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="O que você está procurando?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Buscar</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtros
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </form>

          {/* Filters */}
          {showFilters && (
            <div className="bg-muted/30 rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Categoria
                  </label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Localização
                  </label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um bairro" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {activeFiltersCount > 0 && (
                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="flex flex-wrap gap-2">
                    {searchQuery && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        Busca: "{searchQuery}"
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => setSearchQuery("")}
                        />
                      </Badge>
                    )}
                    {selectedCategory && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        {selectedCategory}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => setSelectedCategory("")}
                        />
                      </Badge>
                    )}
                    {selectedLocation && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        {selectedLocation}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => setSelectedLocation("")}
                        />
                      </Badge>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Limpar Filtros
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              {isLoading ? "Carregando..." : `${filteredProviders.length} serviços encontrados`}
            </h2>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Buscando prestadores com ranking inteligente...</p>
            </div>
          ) : filteredProviders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProviders.map((provider) => (
                <ProviderCard key={provider.id} {...provider} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Nenhum serviço encontrado
              </h3>
              <p className="text-muted-foreground mb-6">
                Tente ajustar seus filtros ou termos de busca
              </p>
              <Button onClick={clearFilters}>
                Limpar Filtros
              </Button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SearchPage;