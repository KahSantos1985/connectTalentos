import { Home, Heart, FileText, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "início", path: "/" },
    { icon: Heart, label: "serviços", path: "/search" },
    { icon: FileText, label: "pedidos", path: "/resident-dashboard" },
    { icon: User, label: "você", path: "/login" }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-2 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Button
              key={item.label}
              variant="ghost"
              size="sm"
              onClick={() => navigate(item.path)}
              className={`flex-1 flex flex-col items-center gap-1 h-12 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;