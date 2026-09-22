
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Cart } from '@/types';

interface OrderSummaryProps {
  cart: Cart;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ cart }) => {
  const shipping = cart.total > 0 ? 0 : 99;
  const tax = Math.round(cart.total * 0.00);
  const finalTotal = cart.total + shipping + tax;

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
            <span>{shipping === 0 ? 'Depend On Your Address' : `£${shipping.toLocaleString()}`}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax (0%)</span>
            <span>£{tax.toLocaleString()}</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>£{finalTotal.toLocaleString()}</span>
        </div>

        {cart.total < 30000 && (
          <p className="text-xs text-muted-foreground text-center">
            Add £{(30000 - cart.total).toLocaleString()} more for free shipping!
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
