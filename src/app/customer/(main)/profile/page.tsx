
'use client';

import { useContext } from 'react';
import { AppContext } from '@/context/AppContext';
import { ProfileDisplay } from '@/components/customer/profile-display';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { user } = useContext(AppContext);
  const { toast } = useToast();

  const handleEditClick = () => {
    toast({
      title: 'Feature Coming Soon',
      description: 'The ability to edit your profile will be added in a future update.',
    });
  }

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <h1 className="font-headline text-3xl font-bold">My Profile</h1>
         <Button variant="outline" onClick={handleEditClick}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Profile
         </Button>
      </div>
      
      {user ? (
        <ProfileDisplay user={user} />
      ) : (
        <p>Loading user profile...</p>
      )}
    </div>
  );
}
