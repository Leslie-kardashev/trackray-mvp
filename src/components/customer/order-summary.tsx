
'use client';
import { Separator } from '../ui/separator';

interface OrderSummaryProps {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
}

export function OrderSummary({
  subtotal,
  discount,
  deliveryFee,
  total,
}: OrderSummaryProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between text-muted-foreground">
        <span>Subtotal</span>
        <span>GH₵{subtotal.toFixed(2)}</span>
      </div>
      {discount > 0 && (
        <div className="flex justify-between text-muted-foreground">
          <span>Loyalty Discount (10%)</span>
          <span className="text-green-600">-GH₵{discount.toFixed(2)}</span>
        </div>
      )}
      <div className="flex justify-between text-muted-foreground">
        <span>Delivery Fee</span>
        <span>GH₵{deliveryFee.toFixed(2)}</span>
      </div>
      <Separator />
      <div className="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span>GH₵{total.toFixed(2)}</span>
      </div>
    </div>
  );
}
