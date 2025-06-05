import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import OrderProgressIndicator from '@/components/OrderProgressIndicator'; // Custom Component
import { User, ShoppingBag, MapPin, CreditCardIcon, Settings, LogOut, Edit3, Trash2, Bell } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number.").optional().or(z.literal('')),
});
type ProfileFormValues = z.infer<typeof profileFormSchema>;

const addressFormSchema = z.object({
    id: z.string().optional(), // For editing existing addresses
    label: z.string().min(2, "Label is required (e.g., Home, Work)"),
    street: z.string().min(3, "Street address is required"),
    city: z.string().min(2, "City is required"),
    zip: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
});
type AddressFormValues = z.infer<typeof addressFormSchema>;


const mockUser = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  phone: "+15551234567",
  avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
  joinDate: "2023-01-15",
};

const mockOrders = [
  { id: "ORD001", date: "2024-07-20", total: 45.99, status: "Delivered", restaurant: "Pizza Palace", items: [{name: "Pepperoni Pizza", quantity: 1}, {name: "Coke", quantity: 2}], progressSteps: ["Ordered", "Preparing", "Out for Delivery", "Delivered"], currentStepIndex: 3 },
  { id: "ORD002", date: "2024-07-28", total: 22.50, status: "Preparing", restaurant: "Sushi Central", items: [{name: "California Roll", quantity: 2}], progressSteps: ["Ordered", "Preparing", "Out for Delivery", "Delivered"], currentStepIndex: 1 },
  { id: "ORD003", date: "2024-07-10", total: 15.75, status: "Delivered", restaurant: "Burger Barn", items: [{name: "Cheeseburger", quantity: 1}], progressSteps: ["Ordered", "Preparing", "Out for Delivery", "Delivered"], currentStepIndex: 3 },
];

const mockAddresses = [
    { id: 'addr1', label: 'Home', street: '123 Willow Creek Rd', city: 'Springfield', zip: '62704' },
    { id: 'addr2', label: 'Work', street: '456 Business Park Ave', city: 'Springfield', zip: '62702' },
];

const UserProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState(mockUser);
  const [orders, setOrders] = useState(mockOrders);
  const [addresses, setAddresses] = useState(mockAddresses);
  const [editingAddress, setEditingAddress] = useState<AddressFormValues | null>(null);

  const defaultTab = location.state?.fromCheckout ? "orders" : "profile";

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: user,
  });

  const addressForm = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: { label: '', street: '', city: '', zip: ''},
  });

  useEffect(() => {
    console.log('UserProfilePage loaded');
    profileForm.reset(user); // Ensure form is populated when user data changes
  }, [user, profileForm]);

  const onProfileSubmit = (data: ProfileFormValues) => {
    console.log('Profile updated:', data);
    setUser(prevUser => ({ ...prevUser, ...data }));
    toast({ title: "Profile Updated", description: "Your information has been saved." });
  };

  const onAddressSubmit = (data: AddressFormValues) => {
    if(editingAddress && editingAddress.id) {
        setAddresses(prev => prev.map(addr => addr.id === editingAddress.id ? {...data, id: editingAddress.id} : addr));
        toast({ title: "Address Updated"});
    } else {
        setAddresses(prev => [...prev, {...data, id: `addr${Date.now()}`}]);
        toast({ title: "Address Added"});
    }
    setEditingAddress(null);
    addressForm.reset({ label: '', street: '', city: '', zip: ''});
  };

  const handleEditAddress = (address: AddressFormValues) => {
    setEditingAddress(address);
    addressForm.reset(address);
  };
  
  const handleDeleteAddress = (addressId: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== addressId));
    toast({ title: "Address Deleted", variant: "destructive" });
  };

  const handleLogout = () => {
    console.log("User logging out...");
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    // Simulate logout and redirect
    setTimeout(() => navigate('/'), 1500); // Navigate to homepage or login page
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
         <NavigationMenu className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink href="/" className="text-xl font-bold text-green-600">FoodDash</NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
             <div className="flex items-center space-x-4">
                <NavigationMenuLink href="/cart" className="text-sm">Cart</NavigationMenuLink>
                <Button variant="outline" size="sm" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" /> Logout</Button>
             </div>
        </NavigationMenu>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 border-2 border-primary">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500">Joined: {new Date(user.joinDate).toLocaleDateString()}</p>
          </div>
        </div>

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-6">
            <TabsTrigger value="profile"><User className="mr-2 h-4 w-4" />Profile</TabsTrigger>
            <TabsTrigger value="orders"><ShoppingBag className="mr-2 h-4 w-4" />Orders</TabsTrigger>
            <TabsTrigger value="addresses"><MapPin className="mr-2 h-4 w-4" />Addresses</TabsTrigger>
            <TabsTrigger value="payment"><CreditCardIcon className="mr-2 h-4 w-4" />Payment</TabsTrigger>
            <TabsTrigger value="settings"><Settings className="mr-2 h-4 w-4" />Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Manage your personal details.</CardDescription>
              </CardHeader>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                  <CardContent className="space-y-4">
                    <FormField control={profileForm.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={profileForm.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl><Input type="email" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={profileForm.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number (Optional)</FormLabel>
                        <FormControl><Input type="tel" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">Save Changes</Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>View your past and current orders.</CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {orders.map(order => (
                      <AccordionItem value={order.id} key={order.id}>
                        <AccordionTrigger>
                          <div className="flex justify-between w-full pr-4">
                            <span>Order #{order.id} ({order.restaurant}) - {order.status}</span>
                            <span>{new Date(order.date).toLocaleDateString()} - ${order.total.toFixed(2)}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 space-y-3">
                          <p className="font-semibold">Items:</p>
                          <ul className="list-disc list-inside text-sm">
                            {order.items.map(item => <li key={item.name}>{item.quantity}x {item.name}</li>)}
                          </ul>
                          <OrderProgressIndicator steps={order.progressSteps} currentStepIndex={order.currentStepIndex} />
                          <Button variant="outline" size="sm" className="mt-2" onClick={() => toast({title: "Reorder feature coming soon!"})}>Reorder</Button>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <p>You have no past orders.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addresses">
             <Card>
                <CardHeader>
                    <CardTitle>Manage Addresses</CardTitle>
                    <CardDescription>Add, edit, or remove your delivery addresses.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...addressForm}>
                        <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-4 mb-6 p-4 border rounded-md">
                            <h3 className="text-lg font-semibold">{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
                             <FormField control={addressForm.control} name="label" render={({ field }) => (
                                <FormItem><FormLabel>Label</FormLabel><FormControl><Input placeholder="e.g., Home, Work" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={addressForm.control} name="street" render={({ field }) => (
                                <FormItem><FormLabel>Street Address</FormLabel><FormControl><Input placeholder="123 Main St" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={addressForm.control} name="city" render={({ field }) => (
                                    <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="Anytown" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={addressForm.control} name="zip" render={({ field }) => (
                                    <FormItem><FormLabel>ZIP Code</FormLabel><FormControl><Input placeholder="12345" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit">{editingAddress ? 'Save Changes' : 'Add Address'}</Button>
                                {editingAddress && <Button type="button" variant="outline" onClick={() => { setEditingAddress(null); addressForm.reset({ label: '', street: '', city: '', zip: ''}); }}>Cancel</Button>}
                            </div>
                        </form>
                    </Form>

                    <h4 className="text-md font-semibold mb-2 mt-6">Saved Addresses:</h4>
                    {addresses.length > 0 ? (
                        <div className="space-y-3">
                        {addresses.map(addr => (
                            <Card key={addr.id} className="p-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold">{addr.label}</p>
                                        <p className="text-sm text-gray-600">{addr.street}, {addr.city}, {addr.zip}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleEditAddress(addr)}><Edit3 className="h-4 w-4" /></Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader><AlertDialogTitle>Delete Address?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                                                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteAddress(addr.id!)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </Card>
                        ))}
                        </div>
                    ) : <p>No saved addresses.</p>}
                </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Manage your saved payment options. (Placeholder)</CardDescription>
              </CardHeader>
              <CardContent>
                <p>You have no saved payment methods.</p>
                <Button className="mt-4">Add Payment Method</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage notification preferences and account security. (Placeholder)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                    <h4 className="font-semibold mb-2">Notification Preferences</h4>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border rounded-md">
                            <Label htmlFor="email-notifications" className="flex items-center gap-2"><Bell className="h-4 w-4"/> Email Notifications for promotions</Label>
                            <Input type="checkbox" id="email-notifications" className="h-5 w-5"/>
                        </div>
                         <div className="flex items-center justify-between p-3 border rounded-md">
                            <Label htmlFor="sms-notifications" className="flex items-center gap-2"><Bell className="h-4 w-4"/> SMS Notifications for order updates</Label>
                            <Input type="checkbox" id="sms-notifications" className="h-5 w-5" checked/>
                        </div>
                    </div>
                </div>
                 <div>
                    <h4 className="font-semibold mb-2">Account Security</h4>
                     <Button variant="outline">Change Password</Button>
                </div>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4"/>Delete Account</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction className="bg-destructive hover:bg-destructive/80" onClick={() => toast({title: "Account Deletion Requested", description:"This is a placeholder action.", variant: "destructive"})}>Delete Account</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </main>

      <footer className="bg-gray-100 border-t py-6 text-center">
        <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} FoodDash. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default UserProfilePage;