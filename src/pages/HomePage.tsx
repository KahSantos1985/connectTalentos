import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileHomePage from "@/components/layout/MobileHomePage";
import DesktopHomePage from "@/components/layout/DesktopHomePage";

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Mock data for featured providers
  const featuredProviders = [{
    id: "1",
    providerName: "Maria Silva",
    serviceTitle: "Limpeza Residencial Completa",
    category: "Limpeza",
    description: "Serviço de limpeza completo para sua casa com produtos profissionais e qualidade garantida.",
    location: "Vila Madalena, SP",
    rating: 4.8,
    reviewCount: 24,
    priceRange: "R$ 80-120",
    isAvailable: true
  }, {
    id: "2",
    providerName: "João Santos",
    serviceTitle: "Jardinagem e Paisagismo",
    category: "Jardinagem",
    description: "Cuidado profissional do seu jardim, poda, plantio e manutenção de áreas verdes.",
    location: "Pinheiros, SP",
    rating: 4.9,
    reviewCount: 18,
    priceRange: "R$ 60-100",
    isAvailable: true
  }, {
    id: "3",
    providerName: "Ana Costa",
    serviceTitle: "Manutenção Elétrica Residencial",
    category: "Manutenção",
    description: "Instalação e reparo de sistemas elétricos com segurança e garantia de qualidade.",
    location: "Itaim Bibi, SP",
    rating: 4.7,
    reviewCount: 31,
    priceRange: "R$ 90-150",
    isAvailable: false
  }];

  return (
    <>
      {/* Mobile and Tablet Layout */}
      <div className="block lg:hidden">
        <MobileHomePage
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          featuredProviders={featuredProviders}
        />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <DesktopHomePage
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          featuredProviders={featuredProviders}
        />
      </div>
    </>
  );
};

export default HomePage;