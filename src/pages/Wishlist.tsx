import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchWishlist, removeFromWishlist } from '@/api/wishlist';
import SimpleProductCard from '@/components/SimpleProductCard';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadWishlist = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchWishlist();
      setWishlist(Array.isArray(data) ? data : data.results || []);
    } catch (e: any) {
      setError('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleRemove = async (id: number) => {
    try {
      await removeFromWishlist(id);
      setWishlist(wishlist.filter(item => item.id !== id));
    } catch (e) {
      alert('Failed to remove item');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">My Wishlist</h1>
      <Card>
        <CardHeader>
          <CardTitle>Wishlist Items</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-destructive">{error}</p>
          ) : wishlist.length === 0 ? (
            <p className="text-muted-foreground">Your wishlist is empty.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-[2px]">
              {wishlist.map(item => (
                <SimpleProductCard key={item.product?.slug} product={item.product} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Wishlist; 