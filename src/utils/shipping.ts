
export interface ShippingTier {
  minKg: number;
  maxKg: number;
  fee: number;
  label: string;
}

export const SHIPPING_TIERS: ShippingTier[] = [
  { minKg: 0, maxKg: 1, fee: 4.99, label: '1 kg, small parcel' },
  { minKg: 1, maxKg: 2, fee: 5.99, label: '1–2 kg, small parcel' },
  { minKg: 2, maxKg: 2, fee: 6.99, label: '2 kg, medium parcel' },
  { minKg: 2, maxKg: 5, fee: 8.99, label: '2–5 kg, medium parcel' },
  { minKg: 5, maxKg: 10, fee: 9.99, label: '5–10 kg, medium parcel' },
  { minKg: 10, maxKg: 20, fee: 14.99, label: '10–20 kg, medium parcel' },
  { minKg: 20, maxKg: Infinity, fee: 14.99, label: 'Over 20 kg, medium parcel' },
];

/**
 * Calculate shipping fee based on total cart weight in kg.
 * Mirrors the backend tier logic in orders/serializers.py and orders/views.py.
 *
 * Tiers:
 *   ≤1 kg        → £4.99
 *   1–2 kg       → £5.99
 *   exactly 2 kg → £6.99
 *   2–5 kg       → £8.99
 *   5–10 kg      → £9.99
 *   10–20 kg     → £14.99
 *   >20 kg       → £14.99
 */
export function calculateShippingByWeight(weightKg: number): { fee: number; tier: ShippingTier | null } {
  const weight = Math.max(0, weightKg);

  if (weight === 2) {
    return { fee: 6.99, tier: SHIPPING_TIERS[2] };
  }
  if (weight <= 1) {
    return { fee: 4.99, tier: SHIPPING_TIERS[0] };
  }
  if (weight <= 2) {
    return { fee: 5.99, tier: SHIPPING_TIERS[1] };
  }
  if (weight <= 5) {
    return { fee: 8.99, tier: SHIPPING_TIERS[3] };
  }
  if (weight <= 10) {
    return { fee: 9.99, tier: SHIPPING_TIERS[4] };
  }
  if (weight <= 20) {
    return { fee: 14.99, tier: SHIPPING_TIERS[5] };
  }
  return { fee: 14.99, tier: SHIPPING_TIERS[6] };
}

/**
 * Format a shipping fee as a GBP currency string.
 */
export function formatShippingFee(fee: number): string {
  return `£${fee.toFixed(2)}`;
}
