export interface CheckoutFormData {
  first_name: string;
  last_name: string;
  phone_country_code: string;
  phone: string;
  email: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state_region: string;
  shipping_country: string;
  shipping_zip_code: string;
  payment_method: 'stripe' | 'flutterwave';
}
