
'use client';

import { useContext } from 'react';
import Image from 'next/image';
import { AppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useIsMobile } from '@/hooks/use-mobile';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { Separator } from '../ui/separator';

export function CartItemDisplay() {
  const { cart, updateCartQuantity, removeFromCart } = useContext(AppContext);
  const isMobile = useIsMobile();

  const handleQuantityChange = (productId: string, variantId: string | undefined, amount: number) => {
    const item = cart.find(i => i.product.id === productId && i.variant?.id === variantId);
    if (item) {
        updateCartQuantity(productId, item.quantity + amount, variantId);
    }
  }

  if (isMobile) {
    return (
      <div className="space-y-4">
        {cart.map((item, index) => {
          const price = item.variant ? item.variant.unitPrice : item.product.unitPrice || 0;
          return (
            <React.Fragment key={`${item.product.id}-${item.variant?.id}`}>
              <div className="flex items-start gap-4">
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between self-stretch">
                  <div className='flex-1'>
                    <h3 className="font-semibold leading-tight">{item.product.name}</h3>
                    {item.variant && <p className="text-sm text-muted-foreground">{item.variant.name}</p>}
                    <p className="text-sm font-medium">GH₵{price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                          <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleQuantityChange(item.product.id, item.variant?.id, -1)}
                          >
                          <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                              type="number"
                              className="h-7 w-12 text-center"
                              value={item.quantity}
                              onChange={(e) => updateCartQuantity(item.product.id, parseInt(e.target.value) || 1, item.variant?.id)}
                              min="1"
                          />
                          <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleQuantityChange(item.product.id, item.variant?.id, 1)}
                          >
                          <Plus className="h-4 w-4" />
                          </Button>
                      </div>
                      <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground"
                          onClick={() => removeFromCart(item.product.id, item.variant?.id)}
                          >
                          <Trash2 className="h-4 w-4" />
                      </Button>
                  </div>
                </div>
              </div>
              {index < cart.length - 1 && <Separator />}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Price</TableHead>
          <TableHead className="text-center">Quantity</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cart.map((item) => {
          const price = item.variant ? item.variant.unitPrice : item.product.unitPrice || 0;
          return (
            <TableRow key={`${item.product.id}-${item.variant?.id}`}>
              <TableCell>
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">{item.variant?.name}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>GH₵{price.toFixed(2)}</TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-2">
                    <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleQuantityChange(item.product.id, item.variant?.id, -1)}
                    >
                    <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                        type="number"
                        className="h-8 w-14 text-center"
                        value={item.quantity}
                        onChange={(e) => updateCartQuantity(item.product.id, parseInt(e.target.value) || 1, item.variant?.id)}
                        min="1"
                    />
                    <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleQuantityChange(item.product.id, item.variant?.id, 1)}
                    >
                    <Plus className="h-4 w-4" />
                    </Button>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">
                GH₵{(price * item.quantity).toFixed(2)}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground"
                  onClick={() => removeFromCart(item.product.id, item.variant?.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

