export const handleCheckoutError = (error: any): string => {
  if (!error) return 'Unknown checkout error';

  // Network errors
  if (error.message === 'Network Error') {
    return 'Network connection failed. Please check your internet.';
  }

  // Axios errors
  if (error.response) {
    switch (error.response.status) {
      case 400: return 'Invalid checkout data';
      case 401: return 'Session expired. Please login again';
      case 404: return 'Checkout service unavailable';
      case 500: return 'Server error. Please try again later';
      default: return error.response.data?.detail || 'Checkout processing failed';
    }
  }

  // Default to error message or generic message
  return error.message || 'Could not complete checkout';
};