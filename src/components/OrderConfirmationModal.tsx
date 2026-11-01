import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Lock } from 'lucide-react';

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderReference: string;
  customerName: string;
  deliveryAddress: string;
  totalAmount: number;
  itemCount: number;
  paymentMethod?: 'stripe';
}

const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  orderReference,
  customerName,
  deliveryAddress,
  totalAmount,
  itemCount,
  paymentMethod = 'stripe'
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <CheckCircle className="h-5 w-5" />
            Confirm Your Order
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-secondary border border-secondary p-4 rounded-lg">
            <h3 className="font-medium text-primary mb-2">Order Summary</h3>
            <div className="space-y-2 text-sm text-primary">
              <p><strong>Order #:</strong> {orderReference || 'Being generated...'}</p>
              <p><strong>Customer:</strong> {customerName}</p>
              <p><strong>Items:</strong> {itemCount} item{itemCount !== 1 ? 's' : ''}</p>
              <p><strong>Total:</strong> £{totalAmount.toLocaleString()}</p>
              <p><strong>Payment Method:</strong> Stripe Secure Payment</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-accent border border-accent rounded-lg">
            <Lock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-primary text-sm">Secure Payment</p>
              <p className="text-primary text-sm">
                Your payment is processed securely via Stripe. All card data is encrypted and never stored on our servers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-accent border border-accent rounded-lg">
            <Lock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-primary text-sm">What happens next?</p>
              <p className="text-primary text-sm">
                You will be redirected to Stripe to complete your payment. After payment, your order will be confirmed and processed for delivery.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Edit Order
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
          >
            <Lock className="h-4 w-4" />
            Pay with Stripe
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderConfirmationModal;
