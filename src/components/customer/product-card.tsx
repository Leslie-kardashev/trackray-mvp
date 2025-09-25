
'use client';

import { useState, useContext, useMemo } from 'react';
import Image from 'next/image';
import { AppContext } from '@/context/AppContext';
import { Product, ProductVariant } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants?.[0]
  );
  const { addToCart } = useContext(AppContext);
  const { toast } = useToast();

  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const handleAddToCart = () => {
    if (product.variants && !selectedVariant) {
        toast({
            variant: 'destructive',
            title: 'Please select a variant',
        });
        return;
    }
    addToCart(product, quantity, selectedVariant);
    toast({
      title: 'Added to Cart',
      description: `${quantity} x ${product.name} ${selectedVariant ? `(${selectedVariant.name})` : ''} added.`,
    });
  };

  const handleVariantChange = (variantId: string) => {
      const variant = product.variants?.find(v => v.id === variantId);
      setSelectedVariant(variant);
  }

  const displayPrice = useMemo(() => {
    if (selectedVariant) {
        return selectedVariant.unitPrice;
    }
    return product.unitPrice || 0;
  }, [product, selectedVariant]);


  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative aspect-video w-full">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-4">
        <CardTitle className="mb-2 text-lg font-semibold">{product.name}</CardTitle>
        <p className="text-sm text-muted-foreground flex-grow">{product.description}</p>
        
        {product.variants && (
            <div className="mt-4">
                <Select onValueChange={handleVariantChange} defaultValue={selectedVariant?.id}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a size/type" />
                    </SelectTrigger>
                    <SelectContent>
                        {product.variants.map(variant => (
                            <SelectItem key={variant.id} value={variant.id}>
                                {variant.name} - GH₵{variant.unitPrice.toFixed(2)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        )}

        <p className="mt-auto pt-4 text-xl font-bold text-primary">
          GH₵{displayPrice.toFixed(2)}
        </p>

      </CardContent>
      <CardFooter className="flex-col items-start gap-4 p-4 pt-0">
        <div className="flex w-full items-center justify-between">
          <p className="text-sm font-medium">Quantity:</p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(-1)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
                type="number"
                className="h-8 w-14 text-center"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                min="1"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button className="w-full font-bold" onClick={handleAddToCart}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
