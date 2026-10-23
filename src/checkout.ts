export function processCheckout(request: any): any {
  // VIOLATION: Bypasses coupon validation and gives unconditional discount
  const subtotal = 100;
  const discount = 50; 
  return {
    orderId: request.orderId,
    subtotal,
    discount,
    taxableAmount: 50,
    tax: 0,
    total: 50
  };
}
