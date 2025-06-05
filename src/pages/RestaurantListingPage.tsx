import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import RestaurantCard from '@/components/RestaurantCard'; // Custom Component
import { Search, Filter, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

// Placeholder restaurant data
const mockRestaurants = [
  { id: '1', name: 'Pizza Palace', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGl6emF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', cuisineTypes: ['Italian', 'Pizza', 'Fast Food'], rating: 4.5, deliveryTime: '25-35 min' },
  { id: '2', name: 'Sushi Central', imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c3VzaGl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', cuisineTypes: ['Japanese', 'Sushi', 'Seafood'], rating: 4.8, deliveryTime: '30-40 min' },
  { id: '3', name: 'Burger Barn', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60', cuisineTypes: ['American', 'Burgers', 'Fries'], rating: 4.2, deliveryTime: '20-30 min' },
  { id: '4', name: 'Taco Town', imageUrl: 'https://images.unsplash.com/photo-1565299715199-866c917206bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dGFjb3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', cuisineTypes: ['Mexican', 'Tacos', 'Burritos'], rating: 4.6, deliveryTime: '25-35 min' },
  { id: '5', name: 'Curry Corner', imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aW5kaWFuJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60', cuisineTypes: ['Indian', 'Curry', 'Vegetarian'], rating: 4.7, deliveryTime: '35-45 min' },
];

const cuisineOptions = ['Italian', 'Japanese', 'American', 'Mexican', 'Indian', 'Chinese', 'Thai', 'Vegan'];

const RestaurantListingPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<typeof mockRestaurants>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<typeof mockRestaurants>([]);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [ratingFilter, setRatingFilter] = useState<number[]>([0]); // Slider expects an array
  const [deliveryTimeFilter, setDeliveryTimeFilter] = useState<number[]>([60]); // Max delivery time in minutes

  const navigate = useNavigate();

  useEffect(() => {
    console.log('RestaurantListingPage loaded');
    // Simulate API call
    setTimeout(() => {
      setRestaurants(mockRestaurants);
      setFilteredRestaurants(mockRestaurants);
      setIsLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    let tempRestaurants = restaurants;

    if (searchTerm) {
      tempRestaurants = tempRestaurants.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.cuisineTypes.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCuisines.length > 0) {
      tempRestaurants = tempRestaurants.filter(r =>
        selectedCuisines.every(sc => r.cuisineTypes.includes(sc))
      );
    }
    
    if (ratingFilter[0] > 0) {
        tempRestaurants = tempRestaurants.filter(r => r.rating >= ratingFilter[0]);
    }

    // Delivery time filter logic (e.g., deliveryTime is "20-30 min", extract max time)
    tempRestaurants = tempRestaurants.filter(r => {
        const maxTime = parseInt(r.deliveryTime.split('-')[1]?.replace(' min', '') || '999');
        return maxTime <= deliveryTimeFilter[0];
    });


    setFilteredRestaurants(tempRestaurants);
  }, [searchTerm, restaurants, selectedCuisines, ratingFilter, deliveryTimeFilter]);

  const handleRestaurantClick = (id: string | number) => {
    console.log(`Navigating to menu for restaurant ID: ${id}`);
    navigate(`/restaurant/${id}/menu`);
  };
  
  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines(prev => 
      prev.includes(cuisine) ? prev.filter(c => c !== cuisine) : [...prev, cuisine]
    );
  };

  const clearFilters = () => {
    setSelectedCuisines([]);
    setRatingFilter([0]);
    setDeliveryTimeFilter([60]);
    setSearchTerm('');
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        {/* Simplified Nav for example purposes. In a real app, this would be a shared component */}
        <NavigationMenu className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink href="/" className="text-xl font-bold text-green-600">FoodDash</NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
            <div className="flex items-center space-x-2">
                <NavigationMenuLink href="/cart" className="text-sm">Cart</NavigationMenuLink>
                <NavigationMenuLink href="/profile" className="text-sm">Profile</NavigationMenuLink>
            </div>
        </NavigationMenu>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Find Your Next Meal</h1>
          <p className="text-gray-600 text-center mb-6">Discover local restaurants and enjoy delicious food delivered to your door.</p>
          <div className="flex flex-col sm:flex-row gap-4 items-center max-w-2xl mx-auto">
            <div className="relative flex-grow w-full">
              <Input
                type="search"
                placeholder="Search restaurants or cuisines..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Filter className="mr-2 h-4 w-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-sm">
                <SheetHeader>
                  <SheetTitle>Filter Options</SheetTitle>
                  <SheetDescription>
                    Refine your search to find the perfect meal.
                  </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-200px)] pr-4"> {/* Adjust height as needed */}
                    <div className="grid gap-6 py-6">
                    <div>
                        <h4 className="font-semibold mb-2 text-sm">Cuisine Type</h4>
                        <div className="grid grid-cols-2 gap-2">
                        {cuisineOptions.map(cuisine => (
                            <div key={cuisine} className="flex items-center space-x-2">
                            <Checkbox 
                                id={`cuisine-${cuisine}`} 
                                checked={selectedCuisines.includes(cuisine)}
                                onCheckedChange={() => toggleCuisine(cuisine)}
                            />
                            <Label htmlFor={`cuisine-${cuisine}`} className="text-xs font-normal">{cuisine}</Label>
                            </div>
                        ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2 text-sm">Minimum Rating</h4>
                        <div className="flex items-center space-x-2">
                            <Slider
                                defaultValue={[0]}
                                value={ratingFilter}
                                max={5}
                                step={0.5}
                                onValueChange={setRatingFilter}
                                className="w-full"
                            />
                            <span className="text-xs w-12 text-right">{ratingFilter[0].toFixed(1)}+</span>
                        </div>
                    </div>
                     <div>
                        <h4 className="font-semibold mb-2 text-sm">Max Delivery Time</h4>
                         <div className="flex items-center space-x-2">
                            <Slider
                                defaultValue={[60]}
                                value={deliveryTimeFilter}
                                max={90} // Max 90 minutes
                                step={5}
                                onValueChange={setDeliveryTimeFilter}
                                className="w-full"
                            />
                            <span className="text-xs w-20 text-right">{deliveryTimeFilter[0]} min</span>
                        </div>
                    </div>
                    </div>
                </ScrollArea>
                <SheetFooter className="mt-auto">
                  <Button variant="ghost" onClick={clearFilters} className="w-full sm:w-auto">Clear Filters</Button>
                  {/* Apply button can be added if filters are not applied live */}
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </section>

        <section>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <Skeleton className="h-[180px] w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  id={restaurant.id}
                  name={restaurant.name}
                  imageUrl={restaurant.imageUrl}
                  cuisineTypes={restaurant.cuisineTypes}
                  rating={restaurant.rating}
                  deliveryTime={restaurant.deliveryTime}
                  onClick={handleRestaurantClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">No Restaurants Found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
              { (selectedCuisines.length > 0 || ratingFilter[0] > 0 || deliveryTimeFilter[0] < 60 || searchTerm) &&
                <Button variant="link" onClick={clearFilters} className="mt-4">Clear Search & Filters</Button>
              }
            </div>
          )}
        </section>
      </main>

      <footer className="bg-gray-100 border-t py-6 text-center">
        <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} FoodDash. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default RestaurantListingPage;