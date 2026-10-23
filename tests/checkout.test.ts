import * as assert from "assert";
import { processCheckout, calculateTax, calculateSubtotal } from "../src/checkout";

function runTests() {
  console.log("Running baseline checkout tests...");

  // Test 1: Subtotal calculation
  const items = [
    { name: "Widget", price: 20, quantity: 2 },
    { name: "Gadget", price: 10, quantity: 1 },
  ];
  const subtotal = calculateSubtotal(items);
  assert.strictEqual(subtotal, 50);

  // Test 2: Tax calculation CA
  const caTax = calculateTax(100, "CA");
  assert.strictEqual(caTax, 8.25);

  // Test 3: Standard checkout
  const res = processCheckout({
    orderId: "ORD-1",
    items,
    state: "CA",
    customerEmail: "user@example.com",
    couponCode: "SAVE10",
  });

  assert.strictEqual(res.subtotal, 50);
  assert.strictEqual(res.discount, 5);
  assert.strictEqual(res.taxableAmount, 45);

  console.log("✅ All baseline tests passed!");
}

runTests();
