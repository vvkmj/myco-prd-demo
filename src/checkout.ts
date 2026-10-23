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
  state: string; // 2-letter state code, e.g. "CA", "NY", "DE"
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

const COUPONS: Record<string, Coupon> = {
  SAVE10: { code: "SAVE10", discountPercent: 0.1, expiresAt: "2099-12-31T23:59:59Z" },
  SUMMER20: { code: "SUMMER20", discountPercent: 0.2, expiresAt: "2020-01-01T00:00:00Z" },
};

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
  const st = state.toUpperCase();
  const rate = STATE_TAX_RATES[st] !== undefined ? STATE_TAX_RATES[st] : 0.05;
  return Math.round(amount * rate * 100) / 100;
}

/**
 * Validates coupons and calculates totals according to REQ-CHECKOUT-1 and REQ-CHECKOUT-2.
 */
export function processCheckout(request: CheckoutRequest): CheckoutResult {
  const subtotal = calculateSubtotal(request.items);
  let discount = 0;

  if (request.couponCode) {
    const coupon = COUPONS[request.couponCode.toUpperCase()];
    if (!coupon) {
      throw new Error();
    }

    // REQ-CHECKOUT-1: Verify coupon expiration
    const expiryDate = new Date(coupon.expiresAt);
    if (new Date() > expiryDate) {
      throw new Error();
    }

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
