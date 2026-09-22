import apiClient from "./client";

interface CartItem {
  product_id: string;
  quantity: number;
  price: number;
  name?: string;
  image?: string;
}

export interface CheckoutData {
  first_name: string;
  last_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_country: string;
  shipping_zip_code?: string;
  payment_method: string;
  cart_items?: CartItem[];
}

export interface CheckoutResponse {
  order: any;
  payment_url: string;
  reference: string;
  order_id: string | number;
  status?: string;
}

export const createCheckout = async (
  data: CheckoutData,
  token: string
): Promise<CheckoutResponse> => {
  try {
    if (!token) {
      throw new Error("Authentication token is required");
    }

    // Validate cart items
    if (!data.cart_items?.length) {
      throw new Error("Your cart is empty");
    }

    // Validate quantities and prices
    data.cart_items.forEach(item => {
      if (item.quantity < 1 || item.quantity > 99) {
        throw new Error("Quantity must be between 1 and 99");
      }
      if (item.price <= 0) {
        throw new Error("Invalid product price");
      }
    });

    // Validate shipping data
    const requiredFields = [
      { field: "shipping_address", name: "Shipping address" },
      { field: "shipping_city", name: "City" },
      { field: "shipping_state", name: "State/Province" },
      { field: "shipping_country", name: "Country" }
    ];
    
    for (const { field, name } of requiredFields) {
      const value = data[field as keyof CheckoutData];
      if (!value?.toString().trim()) {
        throw new Error(`${name} is required`);
      }
    }

    const response = await apiClient.post("/orders/checkout/", data, {
      timeout: 30000
    });

    if (!response.data?.payment_url) {
      throw new Error("Payment initialization failed");
    }

    return {
      payment_url: response.data.payment_url,
      reference: response.data.reference || "",
      order_id: response.data.order_id || "",
      order: response.data.order || null,
      status: response.data.status || "pending"
    };

  } catch (error: any) {
    if (error.response?.status === 401) {
      // Do not throw a custom session expired error; let the global handler manage it
      throw error;
    } else if (error.response?.status === 400) {
      throw new Error(error.response.data?.detail || "Invalid checkout data");
    }
    throw error;
  }
};