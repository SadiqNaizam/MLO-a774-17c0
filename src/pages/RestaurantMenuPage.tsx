import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from '@/components/ui/skeleton';
import MenuItemCard from '@/components/MenuItemCard'; // Custom Component
import { ChevronDown, ShoppingCart, Star, Utensils, ArrowLeft, Plus, Minus } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast" // Assuming useToast is setup

// Mock data - replace with actual data fetching
const mockRestaurantDetails = {
  '1': { name: 'Pizza Palace', logoUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', rating: 4.5, cuisine: 'Italian', description: 'Authentic Italian pizzas and pastas.'},
  '2': { name: 'Sushi Central', logoUrl: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png', rating: 4.8, cuisine: 'Japanese', description: 'Fresh sushi and Japanese delicacies.' },
  '3': { name: 'Burger Barn', logoUrl: 'https://cdn-icons-png.flaticon.com/512/877/877951.png', rating: 4.2, cuisine: 'American', description: 'Classic American burgers and fries.' },
  '4': { name: 'Taco Town', logoUrl: 'https://cdn-icons-png.flaticon.com/512/4058/4058306.png', rating: 4.6, cuisine: 'Mexican', description: 'Flavorful tacos, burritos, and more.' },
  '5': { name: 'Curry Corner', logoUrl: 'https://cdn-icons-png.flaticon.com/512/3480/3480767.png', rating: 4.7, cuisine: 'Indian', description: 'Aromatic Indian curries and breads.' },
};

const mockMenuItems = {
  '1': [ // Pizza Palace
    { id: 'p1', category: 'Pizzas', name: 'Margherita Pizza', description: 'Classic cheese and tomato.', price: 12.99, imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWFyZ2hlcml0YSUyMHBpenphfGVufDB8fDB8fHww&auto=format&fit=crop&w=300&q=60', options: [{ title: 'Size', type: 'radio', items: ['Regular - $0', 'Large - $3']}]},
    { id: 'p2', category: 'Pizzas', name: 'Pepperoni Pizza', description: 'Loaded with pepperoni.', price: 14.99, imageUrl: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVwcGVyb25pJTIwcGl6emF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=300&q=60' },
    { id: 'p3', category: 'Pastas', name: 'Spaghetti Carbonara', description: 'Creamy pasta with bacon.', price: 13.50, imageUrl: 'https://images.unsplash.com/photo-1588013273468-31508066ea61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3BhZ2hldHRpJTIwY2FyYm9uYXJhfGVufDB8fDB8fHww&auto=format&fit=crop&w=300&q=60' },
  ],
  '2': [ // Sushi Central
    { id: 's1', category: 'Rolls', name: 'California Roll', description: 'Crab, avocado, cucumber.', price: 8.00, imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FsaWZvcm5pYSUyMHJvbGx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=300&q=60' },
    { id: 's2', category: 'Rolls', name: 'Spicy Tuna Roll', description: 'Tuna, spicy mayo.', price: 9.50, imageUrl: 'https://images.unsplash.com/photo-1617196034183-421b4917091d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3BpY3klMjB0dW5hJTIwcm9sbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=300&q=60', options: [{title: 'Extras', type: 'checkbox', items: ['Extra Ginger - $0.50', 'Extra Wasabi - $0.50']}] },
    { id: 's3', category: 'Nigiri', name: 'Salmon Nigiri', description: 'Slice of salmon over rice.', price: 5.00, imageUrl: 'https://images.unsplash.com/photo-1611141921029-6969053e7579?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2FsbW9uJTIwbmlnaXJpfGVufDB8fDB8fHww&auto=format&fit=crop&w=300&q=60' },
  ],
  // ... more items for other restaurants
};

type MenuItemWithOptions = typeof mockMenuItems['1'][0] & { options?: { title: string; type: 'radio' | 'checkbox'; items: string[] }[]};
type RestaurantDetail = typeof mockRestaurantDetails['1'] | undefined;


const RestaurantMenuPage = () => {
  const { id: restaurantId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [restaurant, setRestaurant] = useState<RestaurantDetail>(undefined);
  const [menuItems, setMenuItems] = useState<MenuItemWithOptions[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0); // Dummy cart count

  const [selectedItemForDialog, setSelectedItemForDialog] = useState<MenuItemWithOptions | null>(null);
  const [itemQuantity, setItemQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string | string[]>>({});


  useEffect(() => {
    console.log(`RestaurantMenuPage loaded for ID: ${restaurantId}`);
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (restaurantId && mockRestaurantDetails[restaurantId as keyof typeof mockRestaurantDetails]) {
        setRestaurant(mockRestaurantDetails[restaurantId as keyof typeof mockRestaurantDetails]);
        setMenuItems(mockMenuItems[restaurantId as keyof typeof mockMenuItems] || []);
      } else {
        // Handle restaurant not found
        navigate('/404');
      }
      setIsLoading(false);
    }, 1000);
  }, [restaurantId, navigate]);
  
  const handleAddToCart = (item: { id: string | number; name: string; price: number }) => {
    const itemWithOptions = menuItems.find(mi => mi.id === item.id);
    if (itemWithOptions?.options && itemWithOptions.options.length > 0) {
        setSelectedItemForDialog(itemWithOptions);
        setItemQuantity(1); // Reset quantity for new dialog
        setSelectedOptions({}); // Reset options
    } else {
        // Direct add to cart
        console.log('Adding to cart (direct):', item, 'Quantity: 1');
        setCartCount(prev => prev + 1); // Update dummy cart
        toast({ title: `${item.name} added to cart!`, description: "Proceed to cart to checkout." });
    }
  };

  const handleDialogAddToCart = () => {
    if (!selectedItemForDialog) return;
    console.log('Adding to cart (from dialog):', selectedItemForDialog.name, 'Quantity:', itemQuantity, 'Options:', selectedOptions);
    setCartCount(prev => prev + itemQuantity); // Update dummy cart
    toast({ title: `${itemQuantity}x ${selectedItemForDialog.name} added to cart!`, description: "Customizations applied." });
    setSelectedItemForDialog(null); // Close dialog
  };

  const handleOptionChange = (optionTitle: string, value: string, type: 'radio' | 'checkbox') => {
    setSelectedOptions(prev => {
        if (type === 'radio') {
            return { ...prev, [optionTitle]: value };
        } else { // checkbox
            const currentValues = (prev[optionTitle] as string[] || []);
            if (currentValues.includes(value)) {
                return { ...prev, [optionTitle]: currentValues.filter(v => v !== value) };
            } else {
                return { ...prev, [optionTitle]: [...currentValues, value] };
            }
        }
    });
  };


  const groupedMenuItems = menuItems.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, MenuItemWithOptions[]>);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-1/4 mb-4" />
        <Skeleton className="h-20 w-full mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return <div>Restaurant not found.</div>; // Or a more styled 404
  }
  

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
       <header className="sticky top-0 z-50 bg-white shadow-sm">
        <NavigationMenu className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <NavigationMenuList>
                <NavigationMenuItem>
                     <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
                        <ArrowLeft className="h-5 w-5" />
                     </Button>
                    <NavigationMenuLink href="/" className="text-xl font-bold text-green-600">FoodDash</NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
            <Button variant="outline" onClick={() => navigate('/cart')}>
                <ShoppingCart className="mr-2 h-4 w-4" /> Cart ({cartCount})
            </Button>
        </NavigationMenu>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/restaurants">Restaurants</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{restaurant.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <section className="mb-8 p-6 bg-white rounded-lg shadow">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar className="h-20 w-20 ring-2 ring-primary">
              <AvatarImage src={restaurant.logoUrl || 'https://via.placeholder.com/80'} alt={restaurant.name} />
              <AvatarFallback>{restaurant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <h1 className="text-3xl font-bold text-gray-800">{restaurant.name}</h1>
              <p className="text-gray-600">{restaurant.description}</p>
              <div className="flex items-center gap-2 mt-1 text-sm">
                <Badge variant="secondary">{restaurant.cuisine}</Badge>
                <div className="flex items-center text-yellow-500">
                  <Star className="h-4 w-4 mr-1 fill-current" /> {restaurant.rating.toFixed(1)}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <ScrollArea className="w-full"> {/* ScrollArea for menu items if needed */}
            <div className="space-y-6">
            {Object.entries(groupedMenuItems).map(([category, items]) => (
                <Collapsible key={category} defaultOpen className="bg-white p-4 rounded-lg shadow">
                <CollapsibleTrigger className="flex justify-between items-center w-full py-2">
                    <h2 className="text-xl font-semibold text-gray-700 flex items-center">
                        <Utensils className="mr-2 h-5 w-5 text-primary" /> {category}
                    </h2>
                    <ChevronDown className="h-5 w-5 transition-transform duration-200 [&[data-state=open]]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {items.map(item => (
                        <MenuItemCard
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        description={item.description}
                        price={item.price}
                        imageUrl={item.imageUrl}
                        onAddToCart={() => handleAddToCart(item)}
                        />
                    ))}
                    </div>
                </CollapsibleContent>
                </Collapsible>
            ))}
            </div>
        </ScrollArea>
      </main>

      {selectedItemForDialog && (
        <Dialog open={!!selectedItemForDialog} onOpenChange={() => setSelectedItemForDialog(null)}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Customize {selectedItemForDialog.name}</DialogTitle>
                    <DialogDescription>
                        Make selections for your item. Price: ${selectedItemForDialog.price.toFixed(2)}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between">
                        <Label htmlFor="quantity" className="font-semibold">Quantity</Label>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" onClick={() => setItemQuantity(q => Math.max(1, q - 1))} disabled={itemQuantity <=1}>
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{itemQuantity}</span>
                            <Button variant="outline" size="icon" onClick={() => setItemQuantity(q => q + 1)}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Dynamic Options */}
                    {selectedItemForDialog.options?.map(opt => (
                        <div key={opt.title}>
                            <Label className="font-semibold block mb-2">{opt.title}</Label>
                            {opt.type === 'radio' && (
                                <RadioGroup 
                                    defaultValue={opt.items[0]} 
                                    onValueChange={(value) => handleOptionChange(opt.title, value, 'radio')}
                                >
                                    {opt.items.map(itemVal => (
                                        <div key={itemVal} className="flex items-center space-x-2">
                                            <RadioGroupItem value={itemVal} id={`${opt.title}-${itemVal}`} />
                                            <Label htmlFor={`${opt.title}-${itemVal}`} className="font-normal">{itemVal}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            )}
                            {opt.type === 'checkbox' && (
                                <div className="space-y-2">
                                {opt.items.map(itemVal => (
                                    <div key={itemVal} className="flex items-center space-x-2">
                                        <Checkbox 
                                            id={`${opt.title}-${itemVal}`} 
                                            onCheckedChange={(checked) => handleOptionChange(opt.title, itemVal, 'checkbox')}
                                        />
                                        <Label htmlFor={`${opt.title}-${itemVal}`} className="font-normal">{itemVal}</Label>
                                    </div>
                                ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setSelectedItemForDialog(null)}>Cancel</Button>
                    <Button onClick={handleDialogAddToCart}>Add to Cart (${(selectedItemForDialog.price * itemQuantity).toFixed(2)})</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      )}

      <footer className="bg-gray-100 border-t py-6 text-center">
        <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} FoodDash. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default RestaurantMenuPage;