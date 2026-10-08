
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { User, ShoppingBag, Heart, Settings, Package, CreditCard, MapPin, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { fetchOrders } from '@/api/orders';
import { fetchWishlist } from '@/api/wishlist';
import { apiErrorMessage } from '@/api/client';
// import { fetchNotifications } from '@/api/notifications';

interface OrderSummary {
  id: number;
  status?: string;
  date?: string;
  created_at?: string;
  total?: number;
  total_price?: number;
  total_items?: number;
  items_count?: number;
  items?: unknown[];
}

interface WishlistEntry {
  id: number;
  product?: Record<string, unknown>;
}

const Dashboard = () => {
  const { cart } = useCart();
  const { isAuthenticated, isInitialized } = useAuth();

  // Helper to format ISO date string
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return '';
    }
  };

  // Helper to safely parse numeric values from API
  const parseAmount = (value: unknown): number => {
    if (value === null || value === undefined) return 0;
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  // State for API data
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');

  const [wishlist, setWishlist] = useState<WishlistEntry[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [wishlistError, setWishlistError] = useState('');

  const [notifications, setNotifications] = useState<Record<string, unknown>[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [notificationsError, setNotificationsError] = useState('');

  // Fetch orders
  useEffect(() => {
    if (!isInitialized || !isAuthenticated) {
      setOrdersLoading(false);
      return;
    }

    let cancelled = false;
    const loadOrders = async () => {
      setOrdersLoading(true);
      setOrdersError('');
      try {
        const data = await fetchOrders();
        if (cancelled) return;
        if (Array.isArray(data)) {
          setOrders(data);
        } else if (data && Array.isArray(data.results)) {
          setOrders(data.results);
        } else {
          setOrders([]);
          setOrdersError('Unexpected response from server.');
        }
      } catch (error: unknown) {
        if (cancelled) return;
        console.warn('Dashboard: failed to fetch orders:', error);
        setOrders([]);
        setOrdersError(apiErrorMessage(error, 'Failed to load orders'));
      } finally {
        if (!cancelled) setOrdersLoading(false);
      }
    };
    loadOrders();
    return () => { cancelled = true; };
  }, [isInitialized, isAuthenticated]);

  // Fetch wishlist
  useEffect(() => {
    if (!isInitialized || !isAuthenticated) {
      setWishlistLoading(false);
      return;
    }

    let cancelled = false;
    const loadWishlist = async () => {
      setWishlistLoading(true);
      setWishlistError('');
      try {
        const data = await fetchWishlist();
        if (cancelled) return;
        setWishlist(Array.isArray(data) ? data : data?.results ?? []);
      } catch (error: unknown) {
        if (cancelled) return;
        console.warn('Dashboard: failed to fetch wishlist:', error);
        setWishlist([]);
        setWishlistError(apiErrorMessage(error, 'Failed to load wishlist'));
      } finally {
        if (!cancelled) setWishlistLoading(false);
      }
    };
    loadWishlist();
    return () => { cancelled = true; };
  }, [isInitialized, isAuthenticated]);

  // Fetch notifications
  // useEffect(() => {
  //   setNotificationsLoading(true);
  //   setNotificationsError('');
  //   fetchNotifications()
  //     .then(data => {
  //       setNotifications(Array.isArray(data) ? data : data.results || []);
  //     })
  //     .catch(() => setNotificationsError('Failed to load notifications'))
  //     .finally(() => setNotificationsLoading(false));
  // }, []);

  // Calculate stats
  const totalOrders = orders.length;
  const wishlistCount = wishlist.length;
  // Only include orders with successful status (e.g., 'processing', 'shipped', 'delivered')
  const successfulStatuses = ['processing', 'shipped', 'delivered'];
  const totalSpent = orders
    .filter(order => successfulStatuses.includes(order.status))
    .reduce((sum, order) => sum + parseAmount(order.total), 0);

  const stats = [
    { label: 'Total Orders', value: ordersLoading ? '...' : totalOrders, icon: Package },
    { label: 'Items in Cart', value: cart.items.length.toString(), icon: ShoppingBag },
    { label: 'Wishlist Items', value: wishlistLoading ? '...' : wishlistCount, icon: Heart },
    { label: 'Total Spent', value: ordersLoading ? '...' : `£${totalSpent.toLocaleString()}`, icon: CreditCard },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'default';
      case 'Shipped': return 'secondary';
      case 'Processing': return 'outline';
      default: return 'outline';
    }
  };

  // Get up to 3 most recent orders
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your account.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center space-x-2 md:space-x-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <stat.icon className="h-4 w-4 md:h-6 md:w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-lg md:text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <p>Loading...</p>
              ) : ordersError ? (
                <p className="text-destructive">{ordersError}</p>
              ) : recentOrders.length === 0 ? (
                <p className="text-muted-foreground">No recent orders.</p>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-2">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row gap-2 sm:items-center mb-2">
                          <span className="font-medium">Order #{order.id}</span>
                          <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{formatDate(order.date || order.created_at)} • {order.total_items ?? order.items?.length ?? order.items_count ?? 0} items</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">£{parseAmount(order.total).toLocaleString()}</p>
                        <Button variant="outline" size="sm" className="mt-2" asChild>
                          <Link to={`/orders/${order.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link to="/orders">View All Orders</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full" variant="outline">
                <Link to="/products" className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Shop Products
                </Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link to="/cart" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  View Cart ({cart.items.length})
                </Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link to="/orders" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  My Orders
                </Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link to="/wishlist" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Wishlist
                </Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link to="/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link to="/addresses" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Manage Addresses
                </Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link to="/settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Account Settings
                </Link>
              </Button>
              {/* <Button asChild className="w-full" variant="outline">
                <Link to="/notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </Link>
              </Button> */}
            </CardContent>
          </Card>

          {/* Notifications */}
          {/* <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {notificationsLoading ? (
                <p>Loading...</p>
              ) : notificationsError ? (
                <p className="text-destructive">{notificationsError}</p>
              ) : notifications.length === 0 ? (
                <p className="text-muted-foreground">No notifications.</p>
              ) : (
                <div className="space-y-3">
                  {notifications.slice(0, 5).map((notif: any) => (
                    <div className="text-sm" key={notif.id}>
                      <p className="font-medium">{notif.title || notif.type || 'Notification'}</p>
                      <p className="text-muted-foreground">{notif.message || notif.detail || ''}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
