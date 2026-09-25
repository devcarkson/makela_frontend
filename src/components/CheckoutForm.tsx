import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader } from 'lucide-react';
import { UK_EU_COUNTRIES, COUNTRY_STATES, getStatesForCountry, GB_POSTCODE_REGEX, CountryOption } from '@/utils/countries';
import Flag from '@/components/Flag';
import { CheckoutFormData } from './CheckoutFormTypes';

export const ShippingFields: React.FC<{ isLoading?: boolean }> = ({ isLoading }) => {
  const { register, watch, setValue, formState: { errors } } = useFormContext<CheckoutFormData>();

  const watchedCountry = watch('shipping_country');
  const watchedStateRegion = watch('shipping_state_region');

  const handleCountryChange = (value: string) => {
    setValue('shipping_country', value, { shouldValidate: true });
    setValue('shipping_state_region', '');
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      </div>

      <div>
        <Label htmlFor="phone">Phone Number *</Label>
        <div className="flex gap-2">
          <Select
            value={watch('phone_country_code')}
            onValueChange={(val) => setValue('phone_country_code', val, { shouldValidate: true })}
            disabled={isLoading}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Code" />
            </SelectTrigger>
            <SelectContent position="item">
              {UK_EU_COUNTRIES.map((country: CountryOption) => (
                <SelectItem key={country.code} value={country.phoneCode}>
                  <span className="flex items-center gap-2">
                    <Flag countryCode={country.code} />
                    <span>{country.phoneCode}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            id="phone"
            type="tel"
            {...register('phone', {
              required: 'Phone number is required',
              pattern: {
                value: /^[0-9]{6,15}$/,
                message: 'Please enter a valid phone number'
              }
            })}
            placeholder="7xxx xxx xxx"
            disabled={isLoading}
            className="flex-1"
          />
        </div>
        {errors.phone && (
          <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          {...register('email', {
            required: 'Email address is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Please enter a valid email address'
            }
          })}
          placeholder="you@example.com"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="shipping_address">Street Address *</Label>
        <Input
          id="shipping_address"
          {...register('shipping_address', {
            required: 'Street address is required',
            minLength: { value: 5, message: 'Address must be at least 5 characters' }
          })}
          placeholder="123 High Street, Flat 4B"
          disabled={isLoading}
        />
        {errors.shipping_address && (
          <p className="text-sm text-destructive mt-1">{errors.shipping_address.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="shipping_city">City *</Label>
          <Input
            id="shipping_city"
            {...register('shipping_city', {
              required: 'City is required',
              minLength: { value: 2, message: 'City name must be at least 2 characters' }
            })}
            placeholder="e.g. London, Manchester"
            disabled={isLoading}
          />
          {errors.shipping_city && (
            <p className="text-sm text-destructive mt-1">{errors.shipping_city.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="shipping_zip_code">Postcode *</Label>
          <Input
            id="shipping_zip_code"
            {...register('shipping_zip_code', {
              required: 'Postcode is required',
              validate: (value) => {
                if (watchedCountry === 'GB') {
                  const cleanValue = value.replace(/\s/g, '');
                  if (!GB_POSTCODE_REGEX.test(cleanValue)) {
                    return 'Please enter a valid UK postcode (e.g. SW1A 1AA)';
                  }
                }
                return true;
              }
            })}
            placeholder={watchedCountry === 'GB' ? 'e.g. SW1A 1AA' : 'e.g. 10115'}
            disabled={isLoading}
            maxLength={10}
          />
          {errors.shipping_zip_code && (
            <p className="text-sm text-destructive mt-1">{errors.shipping_zip_code.message}</p>
          )}
        </div>
      </div>

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
            <SelectContent position="item">
              {UK_EU_COUNTRIES.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  <span className="flex items-center gap-2">
                    <Flag countryCode={country.code} />
                    <span>{country.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="shipping_state_region">State/Region *</Label>
          <Select
            value={watchedStateRegion}
            onValueChange={(val) => setValue('shipping_state_region', val, { shouldValidate: true })}
            disabled={isLoading || !watchedCountry}
          >
            <SelectTrigger>
              <SelectValue placeholder={watchedCountry ? 'Select Region' : 'Select Country First'} />
            </SelectTrigger>
            <SelectContent position="item">
              {getStatesForCountry(watchedCountry).map((state) => (
                <SelectItem key={state.value} value={state.value}>
                  {state.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};

export const PaymentSection: React.FC<{ isLoading?: boolean }> = ({ isLoading }) => {
  const { handleSubmit, watch, setValue } = useFormContext<CheckoutFormData>();

  const watchedPaymentMethod = watch('payment_method');

  const handlePaymentMethodChange = (value: string) => {
    setValue('payment_method', value as CheckoutFormData['payment_method'], { shouldValidate: true });
  };

  return (
    <>
      <div className="pt-4">
        <Label>Payment Method *</Label>
        <div className="mt-2 space-y-3">
          <div
            className={`border rounded-lg p-4 cursor-pointer ${
              watchedPaymentMethod === 'stripe'
                ? 'border-primary bg-secondary'
                : 'border-muted'
            }`}
            onClick={() => !isLoading && handlePaymentMethodChange('stripe')}
          >
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <label className="font-medium">Card via Stripe</label>
                  <p className="text-sm text-muted-foreground">
                    Pay securely with Stripe
                  </p>
                </div>
              </div>
          </div>

          <div
            className={`border rounded-lg p-4 cursor-pointer ${
              watchedPaymentMethod === 'flutterwave'
                ? 'border-primary bg-secondary'
                : 'border-muted'
            }`}
            onClick={() => !isLoading && handlePaymentMethodChange('flutterwave')}
          >
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <label className="font-medium">All Payment Method via Flutterwave</label>
                <p className="text-sm text-muted-foreground">
                  Pay securely with Flutterwave
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground"
        disabled={isLoading || !watchedPaymentMethod}
      >
        {isLoading ? (
          <>
            <Loader className="h-4 w-4 mr-2 animate-spin" />
            Processing Order...
          </>
        ) : (
          watchedPaymentMethod === 'flutterwave'
            ? 'Pay with Flutterwave'
            : 'Pay with Stripe'
        )}
      </Button>
    </>
  );
};
