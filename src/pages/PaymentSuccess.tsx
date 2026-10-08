import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Loader, ArrowRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/client';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';

interface PaymentSuccessData {
  order: {
    id: string;
    order_number: string;
    status: string;
    total: string;
    created_at: string;
  };
  payment: {
    payment_id: string;
    status: string;
    amount: string;
    currency: string;
  };
}

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const sessionId = searchParams.get('session_id');
  const [verified, setVerified] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const { data, isLoading, error, refetch } = useQuery<PaymentSuccessData>({
    queryKey: ['payment-success', sessionId],
    queryFn: async () => {
      if (!sessionId) throw new Error('No session ID provided');
      const response = await apiClient.get(`/payments/verify-session/${sessionId}/`);
      return response.data;
    },
    enabled: !!sessionId && !verified,
    retry: 3,
    retryDelay: 2000,
  });

  useEffect(() => {
    if (data && !verified) {
      setVerified(true);
      toast.success('Payment verified successfully!');
      // Clear cart after successful payment
      clearCart();
    }
  }, [data, verified, clearCart]);

  useEffect(() => {
    if (error && !isLoading) {
      toast.error('Failed to verify payment. Please check your order history.');
      setVerified(true);
    }
  }, [error, isLoading]);

  if (isLoading && !verified) {
    return (
      <div className="container mx-auto px-4 py-16 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Verifying Payment...</h2>
          <p className="text-muted-foreground">Please wait while we confirm your payment</p>
        </div>
      </div>
    );
  }

  if (!data && verified) {
    return (
      <div className="container mx-auto px-4 py-16 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Payment Verification Failed</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't verify your payment automatically. Please check your order history or contact support.
          </p>
          <Button asChild>
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const order = data!.order;
  const payment = data!.payment;

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      {/* Success Header */}
      <div className="text-center mb-10">
        <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Payment Successful!</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Thank you for your order. Your payment has been confirmed and your order is being processed.
        </p>
      </div>

      {/* Order Summary Card */}
      <Card className="mb-6">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Order Number</p>
              <p className="font-medium">{order.order_number}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Order Date</p>
              <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Payment ID</p>
              <p className="font-medium font-mono text-xs">{payment.payment_id}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Payment Status</p>
              <p className="font-medium text-green-600">{payment.status}</p>
            </div>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between text-lg">
              <span>Order Total</span>
              <span className="font-bold">{payment.currency} {payment.amount}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Status Card */}
      <Card className="mb-6">
        <CardHeader className="border-b">
          <CardTitle>What Happens Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Payment Confirmed</p>
                <p className="text-sm text-muted-foreground">Your payment of {payment.currency} {payment.amount} has been received</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Order Processing</p>
                <p className="text-sm text-muted-foreground">Your order is now being prepared for shipment</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <ArrowRight className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Shipment & Tracking</p>
                <p className="text-sm text-muted-foreground">You'll receive an email with tracking info once your order ships</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Confirmation Notice */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
        <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium text-blue-800">Confirmation Email Sent</p>
          <p className="text-sm text-blue-700">
            A detailed order confirmation has been sent to your email address. 
            Please check your inbox (and spam folder) for order #{order.order_number}.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link to={`/orders/${order.id}`}>
            View Order Details
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
        <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
          <Link to="/dashboard">
            Go to Dashboard
          </Link>
        </Button>
        <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
          <Link to="/products">
            Continue Shopping
          </Link>
        </Button>
      </div>

      {/* Expandable Order Details */}
      <Button
        variant="ghost"
        className="mt-6 w-full"
        onClick={() => setShowOrderDetails(!showOrderDetails)}
      >
        {showOrderDetails ? 'Hide Order Details' : 'Show Order Details'}
        <ArrowRight className={`h-4 w-4 ml-2 transition-transform ${showOrderDetails ? 'rotate-180' : ''}`} />
      </Button>

      {showOrderDetails && (
        <Card className="mt-4">
          <CardHeader className="border-b">
            <CardTitle>Complete Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-muted-foreground">Order ID</dt>
                  <dd className="font-mono text-xs">{order.id}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Payment ID</dt>
                  <dd className="font-mono text-xs">{payment.payment_id}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Amount</dt>
                  <dd>{payment.currency} {payment.amount}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Currency</dt>
                  <dd>{payment.currency}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Order Status</dt>
                  <dd className="capitalize">{order.status}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Payment Status</dt>
                  <dd className="text-green-600">{payment.status}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Placed On</dt>
                  <dd>{new Date(order.created_at).toLocaleString()}</dd>
                </div>
              </div>
            </dl>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PaymentSuccess;