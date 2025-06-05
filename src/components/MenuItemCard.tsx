import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface MenuItemCardProps {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string; // Optional image for the menu item
  onAddToCart: (item: { id: string | number; name: string; price: number }) => void;
  // Consider adding props for customization options if needed
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  onAddToCart,
}) => {
  console.log(`Rendering MenuItemCard: ${name} (ID: ${id})`);

  const handleAddToCartClick = () => {
    console.log(`Add to cart clicked for: ${name} (ID: ${id}), Price: ${price}`);
    onAddToCart({ id, name, price });
    // Potentially show a toast notification here using useToast hook
  };

  return (
    <Card className="w-full flex flex-col sm:flex-row overflow-hidden">
      {imageUrl && (
        <div className="sm:w-1/3 md:w-1/4 flex-shrink-0">
          <img
            src={imageUrl}
            alt={name}
            className="object-cover w-full h-32 sm:h-full"
            onError={(e) => (e.currentTarget.style.display = 'none')} // Hide if image fails to load
          />
        </div>
      )}
      <div className="flex flex-col flex-grow">
        <CardHeader className="pb-2">
          <CardTitle className="text-md">{name}</CardTitle>
          {description && <CardDescription className="text-xs line-clamp-2">{description}</CardDescription>}
        </CardHeader>
        <CardContent className="flex-grow pb-2">
          <p className="text-sm font-semibold">${price.toFixed(2)}</p>
        </CardContent>
        <CardFooter className="pt-0">
          <Button size="sm" className="w-full sm:w-auto" onClick={handleAddToCartClick}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default MenuItemCard;