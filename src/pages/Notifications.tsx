import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Check } from 'lucide-react';
import { fetchNotifications, markNotificationRead } from '@/api/notifications';
import { Button } from '@/components/ui/button';

const Notifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadNotifications = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchNotifications();
      setNotifications(Array.isArray(data) ? data : data.results || []);
    } catch (e: any) {
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (id: number) => {
    try {
      await markNotificationRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (e) {
      alert('Failed to mark as read');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2">
        <Bell className="h-6 w-6" /> Notifications
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-destructive">{error}</p>
          ) : notifications.length === 0 ? (
            <p className="text-muted-foreground">No notifications yet.</p>
          ) : (
            <ul className="space-y-4">
              {notifications.map(n => (
                <li key={n.id} className={`border rounded-lg p-4 ${n.read ? 'bg-muted' : ''}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{n.message}</span>
                    <span className="text-xs text-muted-foreground">{new Date(n.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {!n.read && (
                      <Button size="sm" variant="outline" onClick={() => handleMarkRead(n.id)}>
                        <Check className="h-4 w-4 mr-1" /> Mark as read
                      </Button>
                    )}
                    {n.read && <span className="text-primary text-xs flex items-center gap-1"><Check className="h-4 w-4" /> Read</span>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications; 