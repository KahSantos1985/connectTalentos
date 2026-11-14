import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}

const CategoryCard = ({ icon: Icon, label, onClick }: CategoryCardProps) => {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="flex flex-col items-center gap-3 h-20 w-full bg-white rounded-xl border border-border hover:bg-muted/50 transition-colors"
    >
      <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
        <Icon className="h-6 w-6 text-white" />
      </div>
      <span className="text-sm text-foreground font-medium">{label}</span>
    </Button>
  );
};

export default CategoryCard;