
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Cart } from '@/types';
import { getShippingFee } from '@/api/checkout';
import { calculateShippingByWeight, formatShippingFee } from '@/utils/shipping';

interface OrderSummaryProps {
  cart: Cart;
  shippingCity?: string;
  shippingCountry?: string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ cart, shippingCity, shippingCountry }) => {
  const totalWeightKg = cart.items.reduce(
    (sum, item) => sum + (item.product.weight || 0) * item.quantity,
    0
  );
  const { fee: calculatedShippingFee } = calculateShippingByWeight(totalWeightKg);
  const [shipping, setShipping] = useState<number | null>(calculatedShippingFee);
  const [shippingLoading, setShippingLoading] = useState(false);

  useEffect(() => {
    const fetchShippingFee = async () => {
      if (!shippingCity?.trim() || !shippingCountry?.trim()) {
        setShipping(calculatedShippingFee);
        setShippingLoading(false);
        return;
      }
      setShippingLoading(true);
      try {
        const subtotal = Math.round(cart.total * 100);
        const data = await getShippingFee(shippingCity.trim(), shippingCountry.trim(), subtotal);
        const fee = parseFloat(data.shipping_fee);
        setShipping(isNaN(fee) ? calculatedShippingFee : fee);
      } catch {
        setShipping(calculatedShippingFee);
      } finally {
        setShippingLoading(false);
      }
    };
    fetchShippingFee();
  }, [shippingCity, shippingCountry, cart.total, calculatedShippingFee]);

  // Determine what to display for shipping
  let shippingLabel: string;
  let shippingAmount = 0;
  if (shippingLoading) {
    shippingLabel = 'Calculating...';
    shippingAmount = 0;
  } else if (shipping === null) {
    shippingLabel = formatShippingFee(calculatedShippingFee);
    shippingAmount = calculatedShippingFee;
  } else {
    shippingLabel = `£${shipping.toFixed(2)}`;
    shippingAmount = shipping;
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {cart.items.map((item) => (
            <div key={item.product.id} className="flex justify-between">
              <div className="flex-1">
                <p className="font-medium text-sm line-clamp-2">{item.product.name}</p>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="font-medium">£{(item.product.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>£{cart.total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{shippingLabel}</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>£{(cart.total + shippingAmount).toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
