
'use client';

import { User } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User as UserIcon, Building, Mail, Phone, MapPin } from 'lucide-react';

interface ProfileDisplayProps {
  user: User;
}

const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value?: string | string[] }) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;

    return (
        <div className="flex items-start gap-4">
            <Icon className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
            <div className="flex-grow">
                <p className="text-sm text-muted-foreground">{label}</p>
                {Array.isArray(value) ? (
                     <ul className="font-medium">
                        {value.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                ) : (
                    <p className="font-medium">{value}</p>
                )}
            </div>
        </div>
    )
}


export function ProfileDisplay({ user }: ProfileDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
            {user.type === 'Business' ? user.businessName : user.fullName}
        </CardTitle>
        <CardDescription>
            {user.type} Account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Separator />
        <div className="space-y-6">
            {user.type === 'Business' && (
                 <InfoRow icon={UserIcon} label="Business Owner" value={user.businessOwnerName} />
            )}
             {user.type === 'Individual' && (
                 <InfoRow icon={UserIcon} label="Full Name" value={user.fullName} />
            )}
            <InfoRow icon={Mail} label="Email Address" value={user.email} />
            <InfoRow icon={Phone} label="Phone Number(s)" value={user.phoneNumbers} />
            <InfoRow icon={MapPin} label="Primary Location" value={user.shopLocation.address} />
        </div>
      </CardContent>
    </Card>
  );
}
