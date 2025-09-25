
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { User, Pen } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Please enter a valid phone number."),
  avatar: z.string().url().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function SettingsPage() {
  const { toast } = useToast();
  const [userData, setUserData] = useState({
    name: "Warehouse Agent",
    email: "agent@thonket.com",
    phone: "+233 24 123 4567",
    avatar: "https://placehold.co/128x128.png",
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: userData,
  });

  const onSubmit = (data: ProfileFormValues) => {
    // In a real app, you would save this data to your backend.
    setUserData(data);
    toast({
      title: "Profile Updated",
      description: "Your information has been saved successfully.",
    });
  };

  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-3xl font-headline font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and preferences.
        </p>
      </div>
        <Card className="shadow-sm max-w-2xl">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">My Profile</CardTitle>
                <CardDescription>
                Update your personal details and contact information.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                    <FormItem className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={field.value} alt={form.getValues("name")} data-ai-hint="profile picture" />
                        <AvatarFallback>
                        <User className="h-10 w-10" />
                        </AvatarFallback>
                    </Avatar>
                    <Button type="button" variant="outline">
                        <Pen className="mr-2" /> Change Picture
                    </Button>
                    </FormItem>
                )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                        <Input type="email" placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                </div>
                <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., +233 24 123 4567" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
                <Button type="submit">Save Changes</Button>
            </CardFooter>
            </form>
        </Form>
        </Card>
    </div>
  );
}
