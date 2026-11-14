import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthContext, type RegisterData } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Users, Briefcase, Eye, EyeOff } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { registerSchema, type RegisterFormData } from "@/lib/validations";
import { ZodError } from "zod";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    user_type: "resident" as "resident" | "provider",
    contact_phone: "",
    address_city: "",
    address_neighborhood: "",
    acceptTerms: false,
    acceptPrivacy: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuthContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    try {
      // Validate form data with Zod
      const validatedData = registerSchema.parse(formData);
      
      // Extract only the fields needed for registration (exclude confirmPassword)
      const registerData: RegisterData = {
        email: validatedData.email,
        password: validatedData.password,
        full_name: validatedData.full_name,
        user_type: validatedData.user_type,
        contact_phone: validatedData.contact_phone,
        address_city: validatedData.address_city,
        address_neighborhood: validatedData.address_neighborhood,
      };
      
      const success = await register(registerData);
      
      if (success) {
        toast({
          title: "Sucesso!",
          description: "Conta criada! Verifique seu email para confirmar o cadastro.",
        });
        navigate(`/confirm-email?email=${encodeURIComponent(registerData.email)}`);
      }
    } catch (error) {
      if (error instanceof ZodError) {
        // Display the first validation error
        const firstError = error.errors[0];
        toast({
          title: "Erro de validação",
          description: firstError.message,
          variant: "destructive",
        });
      } else if (error instanceof Error) {
        toast({
          title: "Erro no cadastro",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro",
          description: "Ocorreu um erro inesperado. Tente novamente.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <main className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
            <CardDescription>
              Junte-se à plataforma Conectando Talentos
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tipo de Usuário */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Tipo de Conta</Label>
                <RadioGroup
                  value={formData.user_type}
                  onValueChange={(value) => handleInputChange("user_type", value)}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 transition-smooth">
                    <RadioGroupItem value="resident" id="resident" />
                    <Label htmlFor="resident" className="flex items-center space-x-2 cursor-pointer">
                      <Users className="h-4 w-4" />
                      <span>Cliente</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 transition-smooth">
                    <RadioGroupItem value="provider" id="provider" />
                    <Label htmlFor="provider" className="flex items-center space-x-2 cursor-pointer">
                      <Briefcase className="h-4 w-4" />
                      <span>Prestador</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Dados Pessoais */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nome Completo *</Label>
                  <Input
                    id="full_name"
                    placeholder="Seu nome completo"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange("full_name", e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Telefone</Label>
                  <Input
                    id="contact_phone"
                    placeholder="(11) 99999-9999"
                    value={formData.contact_phone}
                    onChange={(e) => handleInputChange("contact_phone", e.target.value)}
                  />
                </div>
              </div>

              {/* Endereço */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address_city">Cidade *</Label>
                  <Input
                    id="address_city"
                    placeholder="São Paulo"
                    value={formData.address_city}
                    onChange={(e) => handleInputChange("address_city", e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address_neighborhood">Bairro *</Label>
                  <Input
                    id="address_neighborhood"
                    placeholder="Centro"
                    value={formData.address_neighborhood}
                    onChange={(e) => handleInputChange("address_neighborhood", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Senha *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirme sua senha"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Termos e Política de Privacidade */}
              <div className="space-y-4 pt-2">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="acceptTerms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, acceptTerms: checked === true }))
                    }
                  />
                  <label
                    htmlFor="acceptTerms"
                    className="text-sm leading-relaxed cursor-pointer"
                  >
                    Eu li e aceito os{" "}
                    <Link to="/terms" target="_blank" className="text-primary hover:underline font-medium">
                      Termos de Uso
                    </Link>
                    {" "}*
                  </label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="acceptPrivacy"
                    checked={formData.acceptPrivacy}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, acceptPrivacy: checked === true }))
                    }
                  />
                  <label
                    htmlFor="acceptPrivacy"
                    className="text-sm leading-relaxed cursor-pointer"
                  >
                    Eu li e aceito a{" "}
                    <Link to="/privacy" target="_blank" className="text-primary hover:underline font-medium">
                      Política de Privacidade
                    </Link>
                    {" "}*
                  </label>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-gradient-primary text-white hover:opacity-90 transition-smooth"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  "Criar Conta"
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Faça login aqui
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default RegisterPage;