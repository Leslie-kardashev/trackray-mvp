
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
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { AlertTriangle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sendSOS } from "@/lib/data-service";
import { Textarea } from "./ui/textarea";

const sosSchema = z.object({
  message: z.string().optional(),
});

type SosFormValues = z.infer<typeof sosSchema>;

export function DriverSOS() {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, reset } = useForm<SosFormValues>({
    resolver: zodResolver(sosSchema),
  });

  const handleSendSOS = async (data: SosFormValues) => {
    setIsSending(true);
    try {
      // In a real app, you'd get the real driver ID from auth state.
      // We'll use a placeholder for now.
      const driverId = "DRV-002"; // Placeholder: Abeiku Acquah
      const driverName = "Abeiku Acquah";

      await sendSOS({
        driverId,
        driverName,
        message: data.message || "Requesting immediate assistance!",
        location: "Last known location: N1 Highway, near Tema", // Placeholder location
      });

      toast({
        title: "SOS Sent!",
        description: "Help is on the way. The admin team has been notified.",
      });
      reset();
      setDialogOpen(false);
    } catch (error) {
      console.error("Failed to send SOS:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not send SOS signal. Please try again or call support.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="shadow-sm sticky top-24 bg-destructive/5 border-destructive">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2 text-destructive">
          <AlertTriangle className="w-6 h-6" /> Emergency SOS
        </CardTitle>
        <CardDescription className="text-destructive/80">
          Use only in a genuine emergency. This will immediately alert the admin team.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full h-24 text-2xl font-bold animate-pulse">
              <AlertTriangle className="w-8 h-8 mr-4" />
              SEND SOS
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <form onSubmit={handleSubmit(handleSendSOS)}>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Emergency SOS</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will send an urgent alert to the admin team with your location. Are you sure you want to proceed?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="my-4">
                <Textarea
                  {...register("message")}
                  placeholder="Optional: Briefly describe the emergency..."
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction type="submit" disabled={isSending}>
                  {isSending ? "Sending..." : <>
                    <Send className="mr-2 h-4 w-4" />
                    Confirm & Send
                  </>
                  }
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
