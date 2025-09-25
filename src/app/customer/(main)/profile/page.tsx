// This is a placeholder for the Profile page.
// We will implement the content in the next step.

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <h1 className="font-headline text-3xl font-bold">My Profile</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p>User profile information will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
