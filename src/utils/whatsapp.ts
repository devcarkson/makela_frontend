import { CartItem } from '@/contexts/CartContext';

export interface WhatsAppOrderData {
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
}

export interface WhatsAppMessageData {
  customerInfo: WhatsAppOrderData;
  cartItems: CartItem[];
  total: number;
  orderReference: string;
  orderTime: string;
}

/**
 * Format a comprehensive WhatsApp message for order submission
 */
export const formatWhatsAppMessage = (data: WhatsAppMessageData): string => {
  const { customerInfo, cartItems, total, orderReference, orderTime } = data;
  
  const messageLines = [
    `*NEW ORDER - MAKELA*`,
    ``,
    `*Order #${orderReference}*`,
    `*Time:* ${orderTime}`,
    ``,
    `*Customer Details:*`,
    `Name: ${customerInfo.first_name} ${customerInfo.last_name}`,
  ];

  // Add phone if provided
  if (customerInfo.phone) {
    messageLines.push(` Phone: ${customerInfo.phone}`);
  }

  // Add email if provided
  if (customerInfo.email) {
    messageLines.push(`Email: ${customerInfo.email}`);
  }

  // Build address line with optional ZIP code
  const addressLine = customerInfo.shipping_zip_code 
    ? `${customerInfo.shipping_country}, ${customerInfo.shipping_zip_code}`
    : customerInfo.shipping_country;

  messageLines.push(
    ``,
    ` *Delivery Address:*`,
    `${customerInfo.shipping_address}`,
    `${customerInfo.shipping_city}, ${customerInfo.shipping_state}`,
    addressLine,
    ``
  );

  // Add delivery preference if specified
  if (customerInfo.delivery_preference && customerInfo.delivery_preference !== 'standard') {
    messageLines.push(`*Delivery:* ${customerInfo.delivery_preference}`);
    messageLines.push(``);
  }

  messageLines.push(`*Order Items:*`);

  // Add cart items
  cartItems.forEach((item, index) => {
    const itemTotal = (item.product.price * item.quantity).toLocaleString();
    messageLines.push(
      `${index + 1}. ${item.product.name} × ${item.quantity} - £${itemTotal}`
    );
  });

  messageLines.push(
    ``,
    `*Order Summary:*`,
    `Subtotal: £${total.toLocaleString()}`,
    `*Total: £${total.toLocaleString()}*`
  );

  // Add order notes if provided
  if (customerInfo.order_notes?.trim()) {
    messageLines.push(
      ``,
      `*Special Instructions:*`,
      customerInfo.order_notes.trim()
    );
  }

  messageLines.push(
    ``,
    `*Please confirm this order and provide delivery timeline.*`,
    ``,
    `Thank you for choosing Makela!`
  );

  return messageLines.join('\n');
};

/**
 * Generate WhatsApp URL with pre-filled message
 */
export const generateWhatsAppURL = (phoneNumber: string, message: string): string => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};

/**
 * Generate a unique order reference
 */
export const generateOrderReference = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `MAKELA${timestamp}${randomStr}`.toUpperCase();
};

/**
 * Format current date and time for order
 */
export const formatOrderTime = (): string => {
  const now = new Date();
  return now.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Store order reference locally for tracking
 */
export const storeOrderReference = (orderRef: string, orderData: any): void => {
  try {
    const orderHistory = JSON.parse(localStorage.getItem('makela_orders') || '[]');
    orderHistory.unshift({
      reference: orderRef,
      timestamp: Date.now(),
      status: 'submitted_whatsapp',
      data: orderData
    });
    
    // Keep only last 10 orders
    if (orderHistory.length > 10) {
      orderHistory.splice(10);
    }
    
    localStorage.setItem('makela_orders', JSON.stringify(orderHistory));
  } catch (error) {
    console.error('Failed to store order reference:', error);
  }
};

/**
 * Default WhatsApp business number (can be moved to environment variables)
 */
export const DEFAULT_WHATSAPP_NUMBER = '2347040080721';