import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ShippingFields, PaymentSection } from '@/components/CheckoutForm';
import { CheckoutFormData } from '@/components/CheckoutFormTypes';
import OrderSummary from '@/components/OrderSummary';
import OrderConfirmationModal from '@/components/OrderConfirmationModal';
import apiClient from '@/api/client';
import { User, CreditCard, Loader } from 'lucide-react';

const Checkout: React.FC = () => {
  const { cart, clearCart } = useCart();
  const { isAuthenticated, logout, email: userEmail } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingOrderData, setPendingOrderData] = useState<CheckoutFormData | null>(null);

  const methods = useForm<CheckoutFormData>({
    defaultValues: {
      payment_method: 'stripe',
      shipping_country: 'GB',
      phone_country_code: '+44',
    }
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    }
  }, [isAuthenticated, navigate]);

  const handleCheckoutSubmit = async (formData: CheckoutFormData) => {
    if (!cart?.items?.length) {
      toast.error('Your cart is empty');
      navigate('/products');
      return;
    }

    try {
      const requiredFields: Array<keyof CheckoutFormData> = [
        'first_name',
        'last_name',
        'phone',
        'phone_country_code',
        'email',
        'shipping_address',
        'shipping_city',
        'shipping_state_region',
        'shipping_country',
        'shipping_zip_code'
      ];

      for (const field of requiredFields) {
        const value = formData[field];
        if (!value || (typeof value === 'string' && !value.trim())) {
          const fieldNames: Record<string, string> = {
            first_name: 'First Name',
            last_name: 'Last Name',
            phone: 'Phone Number',
            phone_country_code: 'Phone Country Code',
            email: 'Email Address',
            shipping_address: 'Street Address',
            shipping_city: 'City',
            shipping_state_region: 'Region/Country',
            shipping_country: 'Country',
            shipping_zip_code: 'Postcode'
          };
          throw new Error(`${fieldNames[field as string] || field} is required`);
        }
      }

      setPendingOrderData(formData);
      setShowConfirmModal(true);
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || 'Please fill in all required fields');
    }
  };

  const handleConfirmOrder = async () => {
    if (!pendingOrderData) return;

    setIsLoading(true);
    setShowConfirmModal(false);

    try {
      const phoneNumber = `${pendingOrderData.phone_country_code}${pendingOrderData.phone}`;

      const orderPayload = {
        first_name: pendingOrderData.first_name,
        last_name: pendingOrderData.last_name,
        phone: phoneNumber,
        email: pendingOrderData.email,
        shipping_address: pendingOrderData.shipping_address,
        shipping_city: pendingOrderData.shipping_city,
        shipping_state: pendingOrderData.shipping_state_region,
        shipping_country: pendingOrderData.shipping_country,
        shipping_zip_code: pendingOrderData.shipping_zip_code,
        payment_method: pendingOrderData.payment_method,
      };

      const response = await apiClient.post('/orders/checkout/', orderPayload);

      const orderData = response.data;
      const orderReference = orderData.reference;

      if (pendingOrderData.payment_method === 'stripe') {
        const paymentUrl = orderData.payment_url;
        if (paymentUrl) {
          toast.success('Redirecting to Stripe for secure payment...');
          window.location.href = paymentUrl;
        } else {
          throw new Error('Payment URL not received from server');
        }
      } else if (pendingOrderData.payment_method === 'flutterwave') {
        const paymentUrl = orderData.payment_url;
        if (paymentUrl) {
          toast.success('Redirecting to Flutterwave for payment...');
          window.location.href = paymentUrl;
        } else {
          throw new Error('Payment URL not received from server');
        }
      }
    } catch (error: unknown) {
      console.error('Checkout error:', error);
      const err = error as { response?: { data?: { detail?: string } }; message?: string };
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to process order';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setPendingOrderData(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground mb-8">
            Please log in or create an account to proceed with checkout.
          </p>
          <Button asChild>
            <Link to="/login?redirect=/checkout">Login to Continue</Link>
          </Button>
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

       <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleCheckoutSubmit)} className="w-full">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" /> Shipping & Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <ShippingFields isLoading={isLoading} />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <OrderSummary cart={cart} />
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" /> Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PaymentSection isLoading={isLoading} />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <div className="p-4 bg-secondary border border-secondary rounded-lg">
                <h3 className="font-medium mb-2 text-primary flex items-center gap-2">
                  Secure Checkout Information
                </h3>
                <div className="text-sm text-primary space-y-2">
                  <p>• Fill in your shipping details</p>
                  <p>• Review your order summary</p>
                  <p>• Confirm and pay securely with Stripe</p>
                  <p>• Track your order in your account</p>
                </div>
              </div>
              <div className="p-4 bg-accent border border-accent rounded-lg">
                <h3 className="font-medium mb-2 text-primary">Delivery & Support</h3>
                <p className="text-sm text-primary">
                  Mon-Fri: 9:00 AM - 6:00 PM (GMT)<br />
                  Sat: 10:00 AM - 4:00 PM (GMT)<br />
                  Sun: Closed
                </p>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>

      {pendingOrderData && (
        <OrderConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => {
            setShowConfirmModal(false);
            setPendingOrderData(null);
          }}
          onConfirm={handleConfirmOrder}
          orderReference=""
          customerName={`${pendingOrderData.first_name} ${pendingOrderData.last_name}`}
          deliveryAddress={`${pendingOrderData.shipping_address}, ${pendingOrderData.shipping_city}, ${pendingOrderData.shipping_state_region}`}
          totalAmount={cart.total}
          itemCount={cart.items.length}
          paymentMethod={pendingOrderData.payment_method}
        />
      )}
    </div>
  );
};

export default Checkout;
