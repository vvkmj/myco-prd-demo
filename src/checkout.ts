export interface Coupon {
  code: string;
  discountPercent: number; // e.g. 0.20 for 20%
  expiresAt: string; // ISO date string
}

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

export interface CheckoutRequest {
  orderId: string;
  items: OrderItem[];
  couponCode?: string;
  state: string; // 2-letter state code, e.g. "CA", "NY"
  customerEmail: string;
}

export interface CheckoutResult {
  orderId: string;
  subtotal: number;
  discount: number;
  taxableAmount: number;
  tax: number;
  total: number;
}

// Known coupon database
const COUPONS: Record<string, Coupon> = {
  SAVE10: { code: "SAVE10", discountPercent: 0.1, expiresAt: "2099-12-31T23:59:59Z" },
  SUMMER20: { code: "SUMMER20", discountPercent: 0.2, expiresAt: "2020-01-01T00:00:00Z" }, // EXPIRED!
};

// State tax rates
const STATE_TAX_RATES: Record<string, number> = {
  CA: 0.0825,
  NY: 0.08875,
  DE: 0.0,
  OR: 0.0,
};

export function calculateSubtotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function calculateTax(amount: number, state: string): number {
  const rate = STATE_TAX_RATES[state.toUpperCase()] ?? 0.05;
  return Math.round(amount * rate * 100) / 100;
}

export function processCheckout(request: CheckoutRequest): CheckoutResult {
  const subtotal = calculateSubtotal(request.items);
  let discount = 0;

  if (request.couponCode) {
    const coupon = COUPONS[request.couponCode.toUpperCase()];
    if (!coupon) {
      throw new Error(`INVALID_COUPON: Coupon "${request.couponCode}" not recognized`);
    }

    // INTENTIONAL GAP IN BASELINE:
    // Does not check if new Date() > new Date(coupon.expiresAt)
    // Expired coupons like SUMMER20 are accepted!
    discount = Math.round(subtotal * coupon.discountPercent * 100) / 100;
  }

  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = calculateTax(taxableAmount, request.state);
  const total = taxableAmount + tax;

  return {
    orderId: request.orderId,
    subtotal,
    discount,
    taxableAmount,
    tax,
    total,
  };
}
