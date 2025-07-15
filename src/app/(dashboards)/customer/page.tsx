import { CustomerOrders } from "@/components/customer-orders";

export default function CustomerDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Customer Center</h1>
        <p className="text-muted-foreground">
          Submit new orders, track your deliveries, and view your order history.
        </p>
      </div>

      <CustomerOrders />
    </div>
  );
}
