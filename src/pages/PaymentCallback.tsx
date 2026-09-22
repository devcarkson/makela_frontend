
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('');
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    const handlePaymentCallback = () => {
      const transactionId = searchParams.get('transaction_id');
      const txRef = searchParams.get('tx_ref');
      const statusParam = searchParams.get('status');
      const flwRef = searchParams.get('flw_ref');
      
      console.log('Payment callback received:', { 
        transactionId, 
        txRef, 
        statusParam, 
        flwRef,
        allParams: Object.fromEntries(searchParams.entries())
      });

      // Get stored order details
      const pendingOrderRef = localStorage.getItem('pending_order_ref');
      const pendingOrderId = localStorage.getItem('pending_order_id');
      
      console.log('Stored order details:', { pendingOrderRef, pendingOrderId });

      // Simulate payment verification (in production, verify with your backend)
      setTimeout(() => {
        if (statusParam === 'successful' || statusParam === 'completed') {
          setStatus('success');
          setMessage('Payment successful! Your order has been confirmed and is being processed.');
          setOrderDetails({
            transactionId: transactionId || flwRef,
            orderRef: txRef || pendingOrderRef,
            orderId: pendingOrderId
          });
          
          // Only clear cart on successful payment
          console.log('Payment successful - clearing cart');
          clearCart();
          
          // Clean up stored order data
          localStorage.removeItem('pending_order_ref');
          localStorage.removeItem('pending_order_id');
          
          toast.success('Payment completed successfully!');
          
        } else if (statusParam === 'cancelled') {
          setStatus('failed');
          setMessage('Payment was cancelled. Your cart items are still saved. You can try again by returning to checkout.');
          toast.error('Payment was cancelled');
          
          // Don't clear cart on cancelled payment
          console.log('Payment cancelled - keeping cart items');
          
        } else {
          setStatus('failed');
          setMessage('Payment failed or was not completed. Your cart items are still saved. Please try again or contact support if you were charged.');
          toast.error('Payment failed');
          
          // Don't clear cart on failed payment
          console.log('Payment failed - keeping cart items');
        }
      }, 2000); // 2 second delay to simulate verification
    };

    handlePaymentCallback();
  }, [searchParams, clearCart]);

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleTryAgain = () => {
    navigate('/checkout');
  };

  const handleViewOrders = () => {
    navigate('/dashboard');
  };

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <Loader className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-semibold mb-2">Verifying Payment</h2>
            <p className="text-muted-foreground">
              Please wait while we confirm your payment with the payment gateway...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          {status === 'success' ? (
            <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
          ) : (
            <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          )}
          <CardTitle className={status === 'success' ? 'text-primary' : 'text-destructive'}>
            {status === 'success' ? 'Payment Successful!' : 'Payment Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">{message}</p>
          
          {status === 'success' && orderDetails && (
            <div className="bg-secondary p-4 rounded-lg text-left">
              <h4 className="font-semibold text-primary mb-2">Order Details:</h4>
              {orderDetails.orderId && (
                <p className="text-sm text-primary">Order ID: {orderDetails.orderId}</p>
              )}
              {orderDetails.transactionId && (
                <p className="text-sm text-primary">Transaction ID: {orderDetails.transactionId}</p>
              )}
              {orderDetails.orderRef && (
                <p className="text-sm text-primary">Reference: {orderDetails.orderRef}</p>
              )}
            </div>
          )}
          
          <div className="space-y-2">
            {status === 'success' ? (
              <>
                <Button onClick={handleViewOrders} className="w-full">
                  View My Orders
                </Button>
                <Button variant="outline" onClick={handleContinueShopping} className="w-full">
                  Continue Shopping
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleTryAgain} className="w-full">
                  Try Payment Again
                </Button>
                <Button variant="outline" onClick={handleContinueShopping} className="w-full">
                  Continue Shopping
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCallback;
