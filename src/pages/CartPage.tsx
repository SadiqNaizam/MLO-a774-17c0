import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { X, Plus, Minus, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  // customizations?: string[]; // Example if items have selected options
}

const initialCartItems: CartItem[] = [
  { id: 'p1', name: 'Margherita Pizza', price: 12.99, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWFyZ2hlcml0YSUyMHBpenphfGVufDB8fDB8fHww&auto=format&fit=crop&w=100&q=60' },
  { id: 's2', name: 'Spicy Tuna Roll', price: 9.50, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1617196034183-421b4917091d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3BpY3klMjB0dW5hJTIwcm9sbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=100&q=60' },
];

const DELIVERY_FEE = 2.50;
const TAX_RATE = 0.08; // 8%

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log('CartPage loaded');
    // Here you would typically fetch cart items from global state or API
  }, []);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      // Optionally trigger remove confirmation or just disallow < 1
      removeItem(itemId);
      return;
    }
    setCartItems(items =>
      items.map(item => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const removeItem = (itemId: string) => {
    setCartItems(items => items.filter(item => item.id !== itemId));
    toast({ title: "Item removed from cart." });
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxes = subtotal * TAX_RATE;
  const total = subtotal + DELIVERY_FEE + taxes;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({ title: "Your cart is empty!", description: "Add some items before checking out.", variant: "destructive" });
      return;
    }
    console.log('Proceeding to checkout with items:', cartItems, 'Instructions:', specialInstructions);
    navigate('/checkout', { state: { cartItems, subtotal, deliveryFee: DELIVERY_FEE, taxes, total, specialInstructions } });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
         <NavigationMenu className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <NavigationMenuList>
                <NavigationMenuItem>
                     <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2"> {/* Assuming -1 goes to previous page, e.g. menu */}
                        <ArrowLeft className="h-5 w-5" />
                     </Button>
                    <NavigationMenuLink href="/" className="text-xl font-bold text-green-600">FoodDash</NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
             <NavigationMenuLink href="/profile" className="text-sm">Profile</NavigationMenuLink>
        </NavigationMenu>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Your Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <Card className="text-center py-10">
            <CardHeader>
              <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <CardTitle>Your cart is empty</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
              <Button onClick={() => navigate('/restaurants')}>Start Shopping</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Order Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px] hidden sm:table-cell">Image</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-center">Quantity</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Remove</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cartItems.map(item => (
                        <TableRow key={item.id}>
                          <TableCell className="hidden sm:table-cell">
                            <img src={item.imageUrl || 'https://via.placeholder.com/64'} alt={item.name} className="h-16 w-16 object-cover rounded" />
                          </TableCell>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center space-x-1">
                              <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <=0}>
                                <Minus className="h-3 w-3" />
                              </Button>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                className="w-12 h-7 text-center px-1"
                                min="0"
                              />
                              <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                  <X className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action will remove {item.name} from your cart.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => removeItem(item.id)} className="bg-destructive hover:bg-destructive/90">Remove</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Special Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea
                        placeholder="Any special requests for your order? (e.g., no onions, extra sauce)"
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        rows={3}
                    />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24"> {/* Sticky summary card */}
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>${DELIVERY_FEE.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes ({(TAX_RATE * 100).toFixed(0)}%)</span>
                    <span>${taxes.toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" size="lg" onClick={handleCheckout}>
                    Proceed to Checkout
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-100 border-t py-6 text-center">
        <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} FoodDash. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CartPage;