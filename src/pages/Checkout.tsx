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
import { fetchAddresses, Address as AddressType } from '@/api/addresses';
import { UK_EU_COUNTRIES, getStatesForCountry, getStateLabel } from '@/utils/countries';
import { User, CreditCard, Loader, MapPin } from 'lucide-react';

const SHIPPING_FIELDS: Array<keyof CheckoutFormData> = [
  'first_name',
  'last_name',
  'phone',
  'shipping_address',
  'shipping_city',
  'shipping_state_region',
  'shipping_country',
  'shipping_zip_code',
];

// Saved addresses store a free-text country, but checkout only ships to the
// countries in UK_EU_COUNTRIES - so only prefill values the form can display.
const toSupportedCountry = (country?: string): string | null => {
  const code = (country ?? '').trim().toUpperCase();
  return UK_EU_COUNTRIES.some(option => option.code === code) ? code : null;
};

const toSupportedState = (country: string, state?: string): string => {
  const wanted = (state ?? '').trim();
  if (!wanted) return '';
  const match = getStatesForCountry(country).find(
    option => option.value.toLowerCase() === wanted.toLowerCase() || option.label.toLowerCase() === wanted.toLowerCase()
  );
  return match ? match.value : '';
};

// Addresses are stored with or without the international prefix.
const toLocalPhoneNumber = (phone?: string): string =>
  (phone ?? '').trim().replace(/^\+\d{1,3}\s?/, '');

const Checkout: React.FC = () => {
  const { cart, clearCart } = useCart();
  const { isAuthenticated, logout, email: userEmail } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingOrderData, setPendingOrderData] = useState<CheckoutFormData | null>(null);
  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

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

  const defaultAddress = useMemo(
    () => addresses.find(address => address.isDefault) ?? addresses[0] ?? null,
    [addresses]
  );

  const applyAddress = (address: AddressType) => {
    const country = toSupportedCountry(address.country) ?? 'GB';
    const values: Partial<CheckoutFormData> = {
      first_name: address.firstName,
      last_name: address.lastName,
      shipping_address: address.street,
      shipping_city: address.city,
      shipping_country: country,
      shipping_state_region: toSupportedState(country, address.state),
      shipping_zip_code: address.zipCode ?? '',
    };
    const phone = toLocalPhoneNumber(address.phone);
    if (phone) values.phone = phone;

    Object.entries(values).forEach(([field, value]) => {
      methods.setValue(field as keyof CheckoutFormData, value ?? '', { shouldValidate: false });
    });
  };

  const handleSelectAddress = (addressId: string) => {
    const address = addresses.find(item => item.id === addressId);
    if (!address) return;
    setSelectedAddressId(addressId);
    applyAddress(address);
  };

  const handleUseNewAddress = () => {
    setSelectedAddressId(null);
    SHIPPING_FIELDS.forEach(field => {
      if (field === 'shipping_country' || field === 'phone_country_code') return;
      methods.setValue(field, '');
    });
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;
    const loadAddresses = async () => {
      setAddressesLoading(true);
      try {
        const data = await fetchAddresses();
        if (cancelled) return;
        setAddresses(data);
        const preferred = data.find(address => address.isDefault) ?? data[0];
        if (preferred) {
          setSelectedAddressId(preferred.id);
          applyAddress(preferred);
        }
      } catch (error) {
        // Never block checkout on this - the shipping form is the fallback.
        console.warn('Checkout: failed to load saved addresses:', error);
      } finally {
        if (!cancelled) setAddressesLoading(false);
      }
    };
    loadAddresses();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

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
      } else if (pendingOrderData.payment_method === 'bank_transfer' || pendingOrderData.payment_method === 'cash_on_delivery') {
        toast.success('Order placed successfully! Payment instructions will be sent via email.');
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
                    {!addressesLoading && addresses.length > 0 && (
                      <div className="rounded-lg border border-border p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="font-medium flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            Saved addresses
                          </p>
                          <Button variant="link" size="sm" asChild className="h-auto p-0">
                            <Link to="/addresses">Manage</Link>
                          </Button>
                        </div>

                        <div className="space-y-2">
                          {addresses.map(address => {
                            const isSelected = address.id === selectedAddressId;
                            return (
                              <label
                                key={address.id}
                                className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors ${
                                  isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="saved-address"
                                  className="mt-1"
                                  checked={isSelected}
                                  onChange={() => handleSelectAddress(address.id)}
                                />
                                <span className="text-sm">
                                  <span className="font-medium">
                                    {address.firstName} {address.lastName}
                                    {address.isDefault && (
                                      <span className="ml-2 text-xs text-muted-foreground">(default)</span>
                                    )}
                                  </span>
                                  <span className="block text-muted-foreground">
                                    {address.street}, {address.city}
                                    {address.state ? `, ${getStateLabel(address.country, address.state)}` : ''}
                                    {address.zipCode ? `, ${address.zipCode}` : ''}
                                  </span>
                                </span>
                              </label>
                            );
                          })}
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleUseNewAddress}
                          disabled={selectedAddressId === null}
                        >
                          Use a different address
                        </Button>
                      </div>
                    )}

                    {!addressesLoading && addresses.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        You have no saved addresses yet — enter your delivery details below.
                      </p>
                    )}

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
