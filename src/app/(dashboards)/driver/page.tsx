
import { DriverDeliveries } from "@/components/driver-deliveries";
import { DriverOrderHistory } from "@/components/driver-order-history";
import { DriverSOS } from "@/components/driver-sos";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListTodo, History } from "lucide-react";

export default function DriverDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Driver Hub</h1>
        <p className="text-muted-foreground">
          Your command center for all deliveries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
            <Tabs defaultValue="active">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="active">
                        <ListTodo className="mr-2" /> Active Deliveries
                    </TabsTrigger>
                    <TabsTrigger value="history">
                        <History className="mr-2" /> Order History
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="active">
                    <DriverDeliveries />
                </TabsContent>
                <TabsContent value="history">
                    <DriverOrderHistory />
                </TabsContent>
            </Tabs>
        </div>
        <div className="lg:col-span-1">
            <DriverSOS />
        </div>
      </div>
    </div>
  );
}
