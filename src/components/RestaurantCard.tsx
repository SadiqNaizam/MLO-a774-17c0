import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Star, Clock } from 'lucide-react';

interface RestaurantCardProps {
  id: string | number;
  name: string;
  imageUrl: string;
  cuisineTypes: string[];
  rating: number; // e.g., 4.5
  deliveryTime: string; // e.g., "25-35 min"
  onClick?: (id: string | number) => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  name,
  imageUrl,
  cuisineTypes,
  rating,
  deliveryTime,
  onClick,
}) => {
  console.log(`Rendering RestaurantCard: ${name} (ID: ${id})`);

  const handleCardClick = () => {
    if (onClick) {
      console.log(`RestaurantCard clicked: ${name} (ID: ${id})`);
      onClick(id);
    }
  };

  return (
    <Card
      className={`w-full overflow-hidden transition-shadow duration-300 hover:shadow-md ${onClick ? 'cursor-pointer' : ''}`}
      onClick={handleCardClick}
      tabIndex={onClick ? 0 : -1}
      onKeyPress={onClick ? (e) => e.key === 'Enter' && handleCardClick() : undefined}
    >
      <CardHeader className="p-0">
        <AspectRatio ratio={16 / 9}>
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={`Image of ${name}`}
            className="object-cover w-full h-full"
            onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
          />
        </AspectRatio>
      </CardHeader>
      <CardContent className="p-3 space-y-1">
        <h3 className="text-md font-semibold truncate" title={name}>{name}</h3>
        <div className="flex flex-wrap gap-1">
          {cuisineTypes.slice(0, 3).map((cuisine) => (
            <Badge key={cuisine} variant="secondary" className="text-xs">{cuisine}</Badge>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
          <div className="flex items-center">
            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
            <span>{rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>{deliveryTime}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;