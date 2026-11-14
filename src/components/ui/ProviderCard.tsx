import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Clock } from "lucide-react";

interface ProviderCardProps {
  id: string;
  providerName: string;
  providerPhotoUrl?: string;
  serviceTitle: string;
  category: string;
  description: string;
  location: string;
  rating?: number;
  reviewCount?: number;
  priceRange?: string;
  isAvailable?: boolean;
}

const ProviderCard = ({
  id,
  providerName,
  providerPhotoUrl,
  serviceTitle,
  category,
  description,
  location,
  rating = 0,
  reviewCount = 0,
  priceRange,
  isAvailable = true,
}: ProviderCardProps) => {
  return (
    <Link to={`/service/${id}`}>
      <Card className="group cursor-pointer transition-all duration-300 hover:shadow-card hover:-translate-y-1 bg-white border border-border">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start space-x-4 mb-4">
            <Avatar className="h-12 w-12 ring-2 ring-primary/10">
              <AvatarImage src={providerPhotoUrl} alt={providerName} />
              <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                {providerName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-smooth truncate">
                {serviceTitle}
              </h3>
              <p className="text-sm text-muted-foreground">{providerName}</p>
              
              <div className="flex items-center mt-1 space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {category}
                </Badge>
                {isAvailable ? (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    <span className="text-xs text-success">Disponível</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-warning" />
                    <span className="text-xs text-warning">Ocupado</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {rating > 0 && (
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-warning text-warning" />
                  <span className="text-sm font-medium">{rating.toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground">({reviewCount})</span>
                </div>
              )}
              
              {priceRange && (
                <span className="text-sm font-semibold text-primary">
                  {priceRange}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProviderCard;