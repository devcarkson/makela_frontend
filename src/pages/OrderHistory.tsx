import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { fetchOrders } from '@/api/orders';

const OrderHistory = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchOrders();
        setOrders(Array.isArray(data) ? data : data.results || []);
      } catch (e: any) {
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    getOrders();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Order History</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-destructive">{error}</p>
          ) : orders.length === 0 ? (
            <p className="text-muted-foreground">You have no orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-2">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row gap-2 sm:items-center mb-2">
                      <span className="font-medium">Order #{order.id}</span>
                      <span className="text-xs text-muted-foreground">{order.status}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{order.created_at?.slice(0, 10) || order.date} • {order.items?.length || 0} items</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">£{order.total || order.total_price || order.total_amount || '0'}</p>
                    <Button asChild variant="outline" size="sm" className="mt-2">
                      <Link to={`/orders/${order.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderHistory; 