// This is a placeholder for the Support page.
// We will implement the content in the next step.

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SupportPage() {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <h1 className="font-headline text-3xl font-bold">Customer Service</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Contact information will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
