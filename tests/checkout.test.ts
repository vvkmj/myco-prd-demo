import * as assert from "assert";
import { processCheckout, calculateTax, calculateSubtotal } from "../src/checkout";

function runTests() {
  console.log("Running compliant checkout tests...");

  const items = [
    { name: "Widget", price: 20, quantity: 2 },
    { name: "Gadget", price: 10, quantity: 1 },
  ];
  const subtotal = calculateSubtotal(items);
  assert.strictEqual(subtotal, 50);

  // REQ-CHECKOUT-2: State taxes
  assert.strictEqual(calculateTax(100, "CA"), 8.25);
  assert.strictEqual(calculateTax(100, "NY"), 8.88);
  assert.strictEqual(calculateTax(100, "DE"), 0.0);
  assert.strictEqual(calculateTax(100, "OR"), 0.0);

  // REQ-CHECKOUT-1: Valid coupon
  const res = processCheckout({
    orderId: "ORD-1",
    items,
    state: "CA",
    customerEmail: "user@example.com",
    couponCode: "SAVE10",
  });
  assert.strictEqual(res.discount, 5);

  // REQ-CHECKOUT-1: Expired coupon MUST be rejected
  assert.throws(
    () => {
      processCheckout({
        orderId: "ORD-2",
        items,
        state: "CA",
        customerEmail: "user@example.com",
        couponCode: "SUMMER20",
      });
    },
    (err: Error) => err.message.includes("EXPIRED_COUPON")
  );

  console.log("✅ All compliant tests passed!");
}

runTests();
