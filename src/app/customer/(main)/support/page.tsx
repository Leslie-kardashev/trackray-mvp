
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Phone, Mail, Clock } from 'lucide-react';

const faqItems = [
    {
        question: "How do I track my order?",
        answer: "You can track your active deliveries from the 'My Orders' page. We provide real-time status updates, including the driver's location area and estimated progress."
    },
    {
        question: "What are the payment options?",
        answer: "We accept prepaid payments for all customers. For our registered Business customers, we also offer a 'Pay On Credit' option, subject to terms and conditions."
    },
    {
        question: "Can I change my delivery address after placing an order?",
        answer: "Once an order is placed, the delivery address cannot be changed through the app. Please contact customer support immediately, and we will do our best to assist you if the order has not yet been dispatched."
    },
    {
        question: "What is the loyalty discount?",
        answer: "Registered Business customers automatically receive a 10% loyalty discount on the subtotal of every order as a thank you for their continued partnership."
    }
]

export default function SupportPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold">Customer Service</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-8">
            <Card>
                <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                    Our team is here to help you with any questions or issues.
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Phone className="h-6 w-6 text-muted-foreground" />
                        <div>
                            <p className="font-semibold">Phone Support</p>
                            <a href="tel:+233302123456" className="text-primary hover:underline">+233 (0) 302 123 456</a>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Mail className="h-6 w-6 text-muted-foreground" />
                        <div>
                            <p className="font-semibold">Email Support</p>
                             <a href="mailto:support@thonket.com" className="text-primary hover:underline">support@thonket.com</a>
                        </div>
                    </div>
                     <div className="flex items-center gap-4">
                        <Clock className="h-6 w-6 text-muted-foreground" />
                        <div>
                            <p className="font-semibold">Operating Hours</p>
                             <p className="text-muted-foreground">Mon - Fri, 8:00 AM - 5:00 PM</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div>
            <Card>
                <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                    Find quick answers to common questions.
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {faqItems.map((item, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger>{item.question}</AccordionTrigger>
                                <AccordionContent>
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
