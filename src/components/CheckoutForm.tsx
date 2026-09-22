import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { User, Loader } from 'lucide-react';

interface CheckoutFormData {
  first_name: string;
  last_name: string;
  phone?: string;
  email?: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_country: string;
  shipping_zip_code?: string;
  order_notes?: string;
  delivery_preference?: string;
  payment_method: string;
}

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void;
  isLoading: boolean;
  defaultValues?: Partial<CheckoutFormData>;
}

const nigerianStates = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 
  'FCT (Abuja)', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 
  'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 
  'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

const CheckoutForm: React.FC<CheckoutFormProps> = ({ 
  onSubmit, 
  isLoading,
  defaultValues 
}) => {
  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue, 
    formState: { errors } 
  } = useForm<CheckoutFormData>({
    defaultValues: {
      payment_method: 'flutterwave',
      shipping_country: 'Nigeria',
      ...defaultValues // Spread any additional default values passed as props
    }
  });

  const watchedState = watch('shipping_state');
  const watchedCountry = watch('shipping_country');
  const watchedPaymentMethod = watch('payment_method');

  const handleStateChange = (value: string) => {
    setValue('shipping_state', value, { shouldValidate: true });
  };

  const handleCountryChange = (value: string) => {
    setValue('shipping_country', value, { shouldValidate: true });
    if (value !== 'Nigeria') {
      setValue('shipping_state', '');
    }
  };

  const handlePaymentMethodChange = (value: string) => {
    setValue('payment_method', value, { shouldValidate: true });
  };

  const handleFormSubmit = (data: CheckoutFormData) => {
    if (!data.shipping_state) {
      return;
    }
    onSubmit(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" /> Shipping Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* First Name */}
          <div>
            <Label htmlFor="first_name">First Name *</Label>
            <Input
              id="first_name"
              {...register('first_name', { required: 'First name is required' })}
              placeholder="Enter your first name"
              disabled={isLoading}
            />
            {errors.first_name && (
              <p className="text-sm text-destructive mt-1">{errors.first_name.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <Label htmlFor="last_name">Last Name *</Label>
            <Input
              id="last_name"
              {...register('last_name', { required: 'Last name is required' })}
              placeholder="Enter your last name"
              disabled={isLoading}
            />
            {errors.last_name && (
              <p className="text-sm text-destructive mt-1">{errors.last_name.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              {...register('phone', {
                pattern: {
                  value: /^(\+234|0)[789][01]\d{8}$/,
                  message: 'Please enter a valid Nigerian phone number'
                }
              })}
              placeholder="0xxx xxx xxxx"
              disabled={isLoading}
            />
            {errors.phone && (
              <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Recommended for delivery coordination
            </p>
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email Address (Optional)</Label>
            <Input
              id="email"
              type="email"
              {...register('email', {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address'
                }
              })}
              placeholder="Email"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Address Field */}
          <div>
            <Label htmlFor="shipping_address">Street Address *</Label>
            <Input
              id="shipping_address"
              {...register('shipping_address', { 
                required: 'Street address is required',
                minLength: { value: 10, message: 'Address must be at least 10 characters' }
              })}
              placeholder="Enter your complete street address"
              disabled={isLoading}
            />
            {errors.shipping_address && (
              <p className="text-sm text-destructive mt-1">{errors.shipping_address.message}</p>
            )}
          </div>

          {/* City and ZIP Code */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="shipping_city">City *</Label>
              <Input
                id="shipping_city"
                {...register('shipping_city', { 
                  required: 'City is required',
                  minLength: { value: 2, message: 'City name must be at least 2 characters' }
                })}
                placeholder="Enter city name"
                disabled={isLoading}
              />
              {errors.shipping_city && (
                <p className="text-sm text-destructive mt-1">{errors.shipping_city.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="shipping_zip_code">ZIPCode (Optional)</Label>
              <Input
                id="shipping_zip_code"
                {...register('shipping_zip_code', { 
                  pattern: {
                    value: /^[0-9]{6}$/,
                    message: 'Please enter a valid 6-digit postal code'
                  }
                })}
                placeholder="123456"
                disabled={isLoading}
              />
              {errors.shipping_zip_code && (
                <p className="text-sm text-destructive mt-1">{errors.shipping_zip_code.message}</p>
              )}
            </div>
          </div>

          {/* Country and State */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="shipping_country">Country *</Label>
              <Select 
                value={watchedCountry} 
                onValueChange={handleCountryChange} 
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nigeria">Nigeria</SelectItem>
                  <SelectItem value="Ghana">Ghana</SelectItem>
                  <SelectItem value="Kenya">Kenya</SelectItem>
                  <SelectItem value="South Africa">South Africa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="shipping_state">State/Region *</Label>
              <Select 
                value={watchedState} 
                onValueChange={handleStateChange} 
                disabled={isLoading || !watchedCountry}
              >
                <SelectTrigger>
                  <SelectValue placeholder={watchedCountry ? "Select State" : "Select Country First"} />
                </SelectTrigger>
                <SelectContent>
                  {watchedCountry === 'Nigeria' ? (
                    nigerianStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="Other">Other</SelectItem>
                  )}
                </SelectContent>
              </Select>
              {!watchedState && (
                <p className="text-sm text-destructive mt-1">Please select a state</p>
              )}
            </div>
          </div>

          {/* Delivery Preference */}
          <div>
            <Label htmlFor="delivery_preference">Delivery Preference</Label>
            <Select
              value={watch('delivery_preference') || 'standard'}
              onValueChange={(value) => setValue('delivery_preference', value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select delivery option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard Delivery (3-5 business days)</SelectItem>
                <SelectItem value="express">Express Delivery (1-2 business days)</SelectItem>
                <SelectItem value="same_day">Same Day Delivery (Lagos only)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Order Notes */}
          <div>
            <Label htmlFor="order_notes">Special Instructions (Optional)</Label>
            <textarea
              id="order_notes"
              {...register('order_notes', {
                maxLength: { value: 500, message: 'Notes cannot exceed 500 characters' }
              })}
              placeholder="Any special delivery instructions, preferred delivery time, etc."
              disabled={isLoading}
              className="w-full min-h-[80px] px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md resize-vertical"
              rows={3}
            />
            {errors.order_notes && (
              <p className="text-sm text-destructive mt-1">{errors.order_notes.message}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {watch('order_notes')?.length || 0}/500 characters
            </p>
          </div>

          {/* Payment Method - WhatsApp Only */}
          <div className="pt-4">
            <Label>Order Method *</Label>
            <div className="mt-2">
              <div className="p-4 border rounded-lg bg-secondary border-secondary">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-background"></div>
                  </div>
                  <div className="flex-1">
                    <label className="font-medium text-primary cursor-pointer">
                      Order via WhatsApp
                    </label>
                    <p className="text-sm text-primary mt-1">
                      Complete your order through WhatsApp for personalized service and flexible payment options
                    </p>
                  </div>
                  <div className="text-2xl">📱</div>
                </div>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isLoading || !watchedState}
          >
            {isLoading ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Preparing Order...
              </>
            ) : (
              <>
                📱 Order via WhatsApp
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CheckoutForm;