import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import CheckoutForm from '@/components/CheckoutForm';
import OrderSummary from '@/components/OrderSummary';
import OrderConfirmationModal from '@/components/OrderConfirmationModal';
import {
  formatWhatsAppMessage,
  generateWhatsAppURL,
  generateOrderReference,
  formatOrderTime,
  storeOrderReference,
  DEFAULT_WHATSAPP_NUMBER,
  type WhatsAppOrderData
} from '@/utils/whatsapp';

interface CheckoutFormData extends WhatsAppOrderData {
  payment_method: string;
}

const Checkout = () => {
  const { cart, loading: cartLoading } = useCart();
  // Debug log for checkout cart state
  console.log('Checkout page: cart', cart, 'loading', cartLoading);
  const { isAuthenticated, logout, email: userEmail } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingOrderData, setPendingOrderData] = useState<any>(null);

  // Allow both authenticated and guest checkout for WhatsApp orders
  useEffect(() => {
    setAuthChecked(true);
  }, []);

  const handleWhatsAppOrder = async (formData: CheckoutFormData) => {
    if (!cart?.items?.length) {
      toast.error('Your cart is empty');
      navigate('/products');
      return;
    }

    try {
      // Validate required fields
      const requiredFields = {
        first_name: 'First Name',
        last_name: 'Last Name',
        shipping_address: 'Shipping Address',
        shipping_city: 'City',
        shipping_state: 'State/Province',
        shipping_country: 'Country'
      };

      for (const [field, name] of Object.entries(requiredFields)) {
        if (!formData[field as keyof CheckoutFormData]?.trim()) {
          throw new Error(`${name} is required`);
        }
      }

      // Generate order reference and timestamp
      const orderReference = generateOrderReference();
      const orderTime = formatOrderTime();

      // Get user email if authenticated
      const finalEmail = isAuthenticated && userEmail ? userEmail : formData.email;

      // Prepare order data for confirmation modal
      const orderData = {
        customerInfo: {
          ...formData,
          email: finalEmail
        },
        cartItems: cart.items,
        total: cart.total,
        orderReference,
        orderTime
      };

      // Store pending order data and show confirmation modal
      setPendingOrderData(orderData);
      setShowConfirmModal(true);

    } catch (error: any) {
      console.error('WhatsApp Order Error:', error);
      
      let errorMessage = 'Failed to prepare WhatsApp order. Please try again.';
      
      if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    }
  };

  const handleConfirmOrder = async () => {
    if (!pendingOrderData) return;

    setIsLoading(true);
    setShowConfirmModal(false);

    try {
      // Format WhatsApp message
      const whatsappMessage = formatWhatsAppMessage(pendingOrderData);

      // Store order reference locally
      storeOrderReference(pendingOrderData.orderReference, {
        ...pendingOrderData,
        status: 'submitted_whatsapp',
        timestamp: Date.now()
      });

      // Generate WhatsApp URL
      const whatsappURL = generateWhatsAppURL(DEFAULT_WHATSAPP_NUMBER, whatsappMessage);

      // Show success message
      toast.success('Opening WhatsApp...');

      // Small delay to show the success message
      setTimeout(() => {
        // Open WhatsApp
        window.open(whatsappURL, '_blank');
        
        // Show success message
        toast.success(`Order #${pendingOrderData.orderReference} sent via WhatsApp!`);
        
        // Optionally clear cart after successful submission
        // clearCart();
      }, 500);

    } catch (error: any) {
      console.error('WhatsApp Order Error:', error);
      toast.error('Failed to open WhatsApp. Please try again.');
    } finally {
      setIsLoading(false);
      setPendingOrderData(null);
    }
  };

  if (cartLoading || !authChecked) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Verifying your session...</h1>
        </div>
      </div>
    );
  }

  if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <Button asChild className="mt-4">
            <Link to="/products">Shop Now</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link to="/cart">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Link>
        </Button>
        <h1 className="text-3xl font-bold mt-4">Checkout</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CheckoutForm 
            onSubmit={handleWhatsAppOrder}
            isLoading={isLoading}
            defaultValues={{
              payment_method: 'flutterwave',
              shipping_country: 'Nigeria'
            }}
          />
        </div>
        <div>
          <OrderSummary cart={cart} />
          <div className="mt-4 p-4 bg-secondary border border-secondary rounded-lg">
            <h3 className="font-medium mb-2 text-primary flex items-center gap-2">
              📱 WhatsApp Order Process
            </h3>
            <div className="text-sm text-primary space-y-2">
              <p>• Fill in your shipping details</p>
              <p>• Review your order summary</p>
              <p>• Click "Order via WhatsApp"</p>
              <p>• Complete payment with our agent</p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-accent border border-accent rounded-lg">
            <h3 className="font-medium mb-2 text-primary">Business Hours</h3>
            <p className="text-sm text-primary">
              Mon-Fri: 9:00 AM - 6:00 PM<br/>
              Sat: 10:00 AM - 4:00 PM<br/>
              Sun: Closed
            </p>
          </div>
        </div>
      </div>

      {/* Order Confirmation Modal */}
      {pendingOrderData && (
        <OrderConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => {
            setShowConfirmModal(false);
            setPendingOrderData(null);
          }}
          onConfirm={handleConfirmOrder}
          orderReference={pendingOrderData.orderReference}
          customerName={`${pendingOrderData.customerInfo.first_name} ${pendingOrderData.customerInfo.last_name}`}
          deliveryAddress={`${pendingOrderData.customerInfo.shipping_address}, ${pendingOrderData.customerInfo.shipping_city}, ${pendingOrderData.customerInfo.shipping_state}`}
          totalAmount={pendingOrderData.total}
          itemCount={pendingOrderData.cartItems.length}
        />
      )}
    </div>
  );
};

export default Checkout;

