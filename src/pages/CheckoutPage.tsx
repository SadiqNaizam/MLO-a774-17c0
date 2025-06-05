import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, CreditCard, Truck, Lock } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";

const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  streetAddress: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  saveAddress: z.boolean().optional(),
});

const paymentSchema = z.object({
  paymentMethod: z.enum(["creditCard", "paypal", "cod"], { required_error: "Please select a payment method"}),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  saveCard: z.boolean().optional(),
}).refine(data => {
    if (data.paymentMethod === "creditCard") {
        return !!data.cardNumber && /^\d{16}$/.test(data.cardNumber) &&
               !!data.expiryDate && /^(0[1-9]|1[0-2])\/\d{2}$/.test(data.expiryDate) && // MM/YY
               !!data.cvv && /^\d{3,4}$/.test(data.cvv);
    }
    return true;
}, {
    message: "Invalid credit card details",
    path: ["cardNumber"], // Attach error to a relevant field
});

const checkoutFormSchema = addressSchema.merge(paymentSchema);

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  // Retrieve cart summary from navigation state (passed from CartPage)
  const cartSummary = location.state || { total: 0, cartItems: [] };

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      fullName: '',
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      phoneNumber: '',
      saveAddress: false,
      paymentMethod: undefined, // Ensure it's undefined to trigger required error if not selected
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      saveCard: false,
    },
  });

  useEffect(() => {
    console.log('CheckoutPage loaded');
    if (cartSummary.total === 0 && cartSummary.cartItems.length === 0) {
        toast({ title: "Your cart is empty.", description: "Please add items to your cart before checking out.", variant: "destructive" });
        navigate('/cart');
    }
  }, [cartSummary, navigate, toast]);

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsProcessing(true);
    console.log('Checkout form submitted:', data);
    console.log('Order Summary:', cartSummary);
    // Simulate API call for order placement
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setOrderPlaced(true);
    toast({ title: "Order Placed Successfully!", description: "Thank you for your purchase. You will be redirected shortly."});
    // In a real app, you'd clear the cart here (e.g., from global state)
    // and navigate to an order confirmation/thank you page or user profile.
    setTimeout(() => navigate('/profile', { state: { fromCheckout: true, orderDetails: data, cartSummary } }), 3000);
  };

  if (orderPlaced) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <Truck className="mx-auto h-16 w-16 text-green-500 mb-4" />
                    <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600">Your order has been placed successfully. We'll send you an email confirmation shortly.</p>
                    <p className="mt-2 text-gray-600">Order Total: <span className="font-semibold">${cartSummary.total?.toFixed(2) || '0.00'}</span></p>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={() => navigate('/profile')}>View My Orders</Button>
                </CardFooter>
            </Card>
        </div>
    );
  }


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
         <NavigationMenu className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <NavigationMenuList>
                <NavigationMenuItem>
                     <Button variant="ghost" onClick={() => navigate('/cart')} className="mr-2">
                        <ArrowLeft className="h-5 w-5" />
                     </Button>
                    <NavigationMenuLink href="/" className="text-xl font-bold text-green-600">FoodDash</NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
             <NavigationMenuLink href="/profile" className="text-sm">Profile</NavigationMenuLink>
        </NavigationMenu>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Checkout</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Delivery Information Section */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center"><Truck className="mr-2 h-5 w-5 text-primary" /> Delivery Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="fullName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="streetAddress" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl><Input placeholder="123 Main St" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl><Input placeholder="Anytown" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="state" render={({ field }) => (
                    <FormItem>
                      <FormLabel>State / Province</FormLabel>
                      <FormControl><Input placeholder="CA" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="zipCode" render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP / Postal Code</FormLabel>
                      <FormControl><Input placeholder="90210" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl><Input type="tel" placeholder="+1 (555) 123-4567" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                 <FormField control={form.control} name="saveAddress" render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>Save this address for future orders</FormLabel>
                        </div>
                    </FormItem>
                )} />
              </CardContent>
            </Card>

            {/* Order Summary and Payment Section */}
            <div className="lg:col-span-1 space-y-8">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {cartSummary.cartItems?.map((item: any) => (
                     <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.name}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <hr/>
                  <div className="flex justify-between"><span>Subtotal</span><span>${cartSummary.subtotal?.toFixed(2) || '0.00'}</span></div>
                  <div className="flex justify-between"><span>Delivery</span><span>${cartSummary.deliveryFee?.toFixed(2) || '0.00'}</span></div>
                  <div className="flex justify-between"><span>Taxes</span><span>${cartSummary.taxes?.toFixed(2) || '0.00'}</span></div>
                  <hr />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${cartSummary.total?.toFixed(2) || '0.00'}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><CreditCard className="mr-2 h-5 w-5 text-primary" /> Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Payment Method</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="creditCard" /></FormControl>
                            <FormLabel className="font-normal">Credit/Debit Card</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="paypal" /></FormControl>
                            <FormLabel className="font-normal">PayPal</FormLabel>
                          </FormItem>
                           <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="cod" /></FormControl>
                            <FormLabel className="font-normal">Cash on Delivery</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {form.watch("paymentMethod") === "creditCard" && (
                    <div className="space-y-4 border p-4 rounded-md">
                        <FormField control={form.control} name="cardNumber" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Card Number</FormLabel>
                                <FormControl><Input placeholder="•••• •••• •••• ••••" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="expiryDate" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Expiry Date</FormLabel>
                                    <FormControl><Input placeholder="MM/YY" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="cvv" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>CVV</FormLabel>
                                    <FormControl><Input placeholder="•••" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="saveCard" render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-2">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                <FormLabel className="text-sm font-normal">Save this card for future payments</FormLabel>
                            </FormItem>
                        )} />
                    </div>
                  )}
                  {form.watch("paymentMethod") === "paypal" && (
                    <Alert>
                        <AlertTitle>PayPal Selected</AlertTitle>
                        <AlertDescription>You will be redirected to PayPal to complete your payment.</AlertDescription>
                    </Alert>
                  )}
                  {form.watch("paymentMethod") === "cod" && (
                    <Alert>
                        <AlertTitle>Cash on Delivery</AlertTitle>
                        <AlertDescription>Please have the exact amount ready for the delivery person.</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" size="lg" disabled={isProcessing || !form.formState.isValid}>
                    {isProcessing ? "Processing..." : (
                        <span className="flex items-center justify-center"><Lock className="mr-2 h-4 w-4" /> Place Order (${cartSummary.total?.toFixed(2) || '0.00'})</span>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </form>
        </Form>
      </main>

      <footer className="bg-gray-100 border-t py-6 text-center">
        <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} FoodDash. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CheckoutPage;