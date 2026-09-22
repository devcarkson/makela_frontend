import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, MessageCircle, Clock, MapPin } from 'lucide-react';

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderReference: string;
  customerName: string;
  deliveryAddress: string;
  totalAmount: number;
  itemCount: number;
}

const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  orderReference,
  customerName,
  deliveryAddress,
  totalAmount,
  itemCount
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
              <p><strong>Order #:</strong> {orderReference}</p>
              <p><strong>Customer:</strong> {customerName}</p>
              <p><strong>Items:</strong> {itemCount} item{itemCount !== 1 ? 's' : ''}</p>
              <p><strong>Total:</strong> £{totalAmount.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-accent border border-accent rounded-lg">
            <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-primary text-sm">Delivery Address:</p>
              <p className="text-primary text-sm">{deliveryAddress}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-accent border border-accent rounded-lg">
            <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-primary text-sm">What happens next?</p>
              <p className="text-primary text-sm">
                You'll be redirected to WhatsApp with your order details. Our agent will confirm your order and arrange payment & delivery.
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
            <MessageCircle className="h-4 w-4" />
            Send to WhatsApp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderConfirmationModal;