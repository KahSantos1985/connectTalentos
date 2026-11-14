import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
const MobileHeader = () => {
  const navigate = useNavigate();
  return <header className="bg-background border-b border-border px-4 py-3 flex items-center justify-between">
      <h1 className="text-xl font-bold text-foreground">Conectando Talentos</h1>
      <Button variant="ghost" size="sm" onClick={() => navigate("/login")} className="h-8 w-8 p-0">
        <User className="h-5 w-5" />
      </Button>
    </header>;
};
export default MobileHeader;