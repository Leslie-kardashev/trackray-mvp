
'use client';

import { useState, useContext } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AppContext } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { User, Location } from '@/lib/types';
import { Phone, Plus, Trash2 } from 'lucide-react';
import { LocationPicker } from '../location-picker';
import Link from 'next/link';

const baseSchema = z.object({
  userType: z.enum(['Individual', 'Business']),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' }),
  fullName: z.string().optional(),
  businessName: z.string().optional(),
  businessOwnerName: z.string().optional(),
  phoneNumbers: z
    .array(z.object({ value: z.string() }))
    .optional(),
  shopLocation: z
    .object({
      address: z.string(),
      coords: z.object({ lat: z.number(), lng: z.number() }),
    })
    .nullable(),
});

const formSchema = baseSchema.superRefine((data, ctx) => {
    if (data.userType === 'Individual') {
        if (!data.fullName || data.fullName.trim() === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Full name is required.',
                path: ['fullName'],
            });
        }
    } else if (data.userType === 'Business') {
        if (!data.businessName || data.businessName.trim() === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Business name is required.',
                path: ['businessName'],
            });
        }
        if (!data.businessOwnerName || data.businessOwnerName.trim() === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Business owner's name is required.",
                path: ['businessOwnerName'],
            });
        }
        if (!data.phoneNumbers || data.phoneNumbers.length === 0 || data.phoneNumbers.some(p => p.value.trim() === '')) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'At least one phone number is required.',
                path: ['phoneNumbers'],
            });
        }
    }

    if (!data.shopLocation) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please select a location on the map.',
            path: ['shopLocation'],
        });
    }
});


type FormSchema = z.infer<typeof formSchema>;

export function RegisterForm() {
  const router = useRouter();
  const { login } = useContext(AppContext);
  const { toast } = useToast();
  const [userType, setUserType] = useState<'Individual' | 'Business'>(
    'Individual'
  );

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userType: 'Individual',
      email: '',
      password: '',
      fullName: '',
      businessName: '',
      businessOwnerName: '',
      phoneNumbers: [{ value: '' }],
      shopLocation: null,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'phoneNumbers',
  });

  function onSubmit(values: FormSchema) {
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: values.email,
      password: values.password, // In a real app, this would be hashed
      type: values.userType,
      fullName: values.fullName,
      businessName: values.businessName,
      businessOwnerName: values.businessOwnerName,
      phoneNumbers: values.phoneNumbers?.map((p) => p.value).filter(p => p.trim() !== ''),
      shopLocation: values.shopLocation!,
    };

    login(newUser);
    toast({
      title: 'Account Created!',
      description: 'Welcome to Thonket!',
    });
    router.push('/customer/dashboard');
  }

  const handleLocationConfirm = (location: Location) => {
    form.setValue('shopLocation', location);
    form.clearErrors('shopLocation');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="userType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Select Account Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value: 'Individual' | 'Business') => {
                    field.onChange(value);
                    setUserType(value);
                    // Reset fields when switching
                    form.reset({
                      ...form.getValues(),
                      userType: value,
                      fullName: value === 'Individual' ? form.getValues().fullName : '',
                      businessName: value === 'Business' ? form.getValues().businessName : '',
                      businessOwnerName: value === 'Business' ? form.getValues().businessOwnerName : '',
                      phoneNumbers: value === 'Business' ? form.getValues().phoneNumbers : [{ value: '' }],
                    });
                  }}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Individual" />
                    </FormControl>
                    <FormLabel className="font-normal">Individual</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Business" />
                    </FormControl>
                    <FormLabel className="font-normal">Business</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {userType === 'Individual' && (
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Ama Badu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {userType === 'Business' && (
          <>
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Melcome Shop" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="businessOwnerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Owner&apos;s Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {userType === 'Business' && (
          <div className="space-y-4">
            <FormLabel>Business Phone Number(s)</FormLabel>
            {fields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`phoneNumbers.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                        <div className="flex items-center gap-2">
                           <div className="relative w-full">
                             <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                             <Input {...field} placeholder="e.g., 0244123456" className="pl-10" />
                           </div>
                           <Button type="button" variant="destructive" size="icon" onClick={() => fields.length > 1 && remove(index)}>
                             <Trash2 className="h-4 w-4" />
                           </Button>
                        </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
             <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ value: '' })}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Phone Number
            </Button>
          </div>
        )}

        {userType === 'Individual' && (
             <FormField
                control={form.control}
                name={`phoneNumbers.0.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                        <div className="relative w-full">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input {...field} placeholder="e.g., 0244123456" className="pl-10" />
                        </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
        )}


        <FormField
          control={form.control}
          name="shopLocation"
          render={({ field }) => (
            <FormItem>
                <FormLabel>Shop / Home Location</FormLabel>
                <FormDescription>Set the primary location for your deliveries.</FormDescription>
                <FormControl>
                    <LocationPicker onLocationConfirm={handleLocationConfirm} />
                </FormControl>
                <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full text-lg h-12 font-bold">
          Create Account
        </Button>
         <p className="text-sm text-center text-muted-foreground">
          Already have an account?{' '}
          <Link href="/customer/login" className="text-primary hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </form>
    </Form>
  );
}

    
