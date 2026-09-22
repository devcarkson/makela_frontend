
import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { getFirstImage } from '@/utils/imageUrl';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, loading } = useCart();

  console.log('Cart component - cart data:', cart);
  console.log('Cart component - items length:', cart.items.length);

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Button asChild>
            <Link to="/products">Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  const shipping = cart.total > 50 ? 0 : 9.99;
  const tax = cart.total * 0.00;
  const finalTotal = cart.total + shipping + tax;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <Card key={item.product.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={getFirstImage(item.product.images)}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm md:text-base mb-1 line-clamp-2">
                      <Link 
                        to={`/product/${item.product.slug}`}
                        className="hover:text-primary"
                      >
                        {item.product.name}
                      </Link>
                    </h3>
                    <p className="text-muted-foreground text-xs md:text-sm mb-2 line-clamp-1 md:line-clamp-2">
                      {item.product.description}
                    </p>
                    
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <span className="text-lg font-bold text-primary">
                        £{Number(item.product.price).toLocaleString('en-GB')}
                      </span>
                      
                      <div className="flex items-center justify-between md:justify-end gap-2">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id.toString(), item.quantity - 1)}
                            disabled={item.quantity <= 1 || loading}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-2 py-1 min-w-[2rem] text-center text-sm">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id.toString(), item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock || loading}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.product.id.toString())}
                          className="text-destructive hover:text-destructive h-8 w-8 p-0"
                          disabled={loading}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
            <Button variant="outline" onClick={clearCart} className="w-full sm:w-auto">
              Clear Cart
            </Button>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({cart.items.length} items)</span>
                <span>£{cart.total.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-primary">Free</span>
                  ) : (
                    `£${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>£{tax.toLocaleString()}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>£{finalTotal.toLocaleString()}</span>
              </div>

              {cart.total < 30000 && (
                <p className="text-xs text-muted-foreground">
                  Add £{(30000 - cart.total).toLocaleString()} more for free shipping!
                </p>
              )}

              <Button className="w-full" size="lg" asChild>
                <Link to="/checkout">
                  Proceed to Checkout
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;
