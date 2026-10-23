# Product Requirements Document (PRD): Checkout & Payment Engine

- **Document ID:** PRD-CHECKOUT-2026
- **Status:** Approved
- **Version:** 1.2.0
- **Target Release:** v1.0.0
- **Traceability References:** Jira [PROJ-101], Confluence [CONF-ORDER-42]

---

## 1. Executive Summary

This document specifies the checkout, discount calculation, and state taxation engine for the demo e-commerce platform. All pull requests modifying checkout or discount behavior MUST satisfy the acceptance criteria detailed below.

---

## 2. Requirements & Acceptance Criteria

### [REQ-CHECKOUT-1] Coupon Code Validation & Expiry Verification
- **Severity:** Mandatory
- **Priority:** Critical
- **Traceability ID:** PROJ-101-AC-1
- **Description:** The system must validate coupon codes before applying any discounts to the order subtotal. Expired or unknown coupons must be rejected immediately with an error.
- **Acceptance Criteria:**
  - Must reject expired coupons with an explicit error (`EXPIRED_COUPON`).
  - Must reject unknown coupon codes with an error (`INVALID_COUPON`).
  - Must apply percentage discounts accurately to positive order amounts.
  - Verification: Automated unit tests MUST verify expired coupon rejection.

### [REQ-CHECKOUT-2] State Sales Tax Calculation
- **Severity:** Mandatory
- **Priority:** High
- **Traceability ID:** PROJ-101-AC-2
- **Description:** Sales tax must be computed on the post-discount subtotal using state rate rules.
- **Acceptance Criteria:**
  - California (CA) orders must be taxed at 8.25% (0.0825).
  - New York (NY) orders must be taxed at 8.875% (0.08875).
  - Tax exempt states (e.g. DE, OR) must have 0% tax.
  - Verification: Automated unit tests MUST test multiple state rates and zero-tax states.

### [REQ-CHECKOUT-3] Asynchronous Receipt Email Dispatch
- **Severity:** Recommended
- **Priority:** Medium
- **Traceability ID:** PROJ-101-AC-3
- **Description:** Upon completed checkout, an order receipt email job should be queued asynchronously.
- **Acceptance Criteria:**
  - Enqueue email receipt event with orderId and customer email.
  - Failures in email dispatch must not abort or roll back successful checkout.

---

## 3. Merge Policy & Verification Gate

Myco validates all PRs against this PRD. A PR CANNOT merge if:
1. Any mandatory requirement (`REQ-CHECKOUT-1`, `REQ-CHECKOUT-2`) is unimplemented or violates acceptance criteria.
2. Required unit tests for coupon expiry or tax calculations are missing.
3. Connected Jira or Confluence requirement checks are inconclusive due to credential gaps.
