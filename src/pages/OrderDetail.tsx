import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchOrderDetail } from '@/api/orders';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getOrder = async () => {
      setLoading(true);
      setError('');
      try {
        if (id) {
          const data = await fetchOrderDetail(id);
          setOrder(data);
        }
      } catch (e: any) {
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };
    getOrder();
  }, [id]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button asChild variant="ghost" className="mb-4">
        <Link to="/orders">&larr; Back to Orders</Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Order #{order?.id || id}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-destructive">{error}</p>
          ) : !order ? (
            <p className="text-muted-foreground">Order not found.</p>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-muted-foreground">Date: {order.created_at?.slice(0, 10) || order.date}</p>
                <p className="text-muted-foreground">Status: {order.status}</p>
                <p className="text-muted-foreground">Shipping: {order.shipping_address || order.shipping || 'N/A'}</p>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Items</h3>
                <ul className="space-y-2">
                  {(order.items || []).map((item: any, idx: number) => (
                    <li key={idx} className="flex justify-between">
                      <span>{item.product_name || item.name} x{item.quantity || item.qty}</span>
                      <span>£{item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="font-bold text-lg">Total: £{order.total || order.total_price || order.total_amount || '0'}</div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetail; 