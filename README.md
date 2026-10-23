# Myco PRD-Aware Engineering Validation & Merge Protection Demo

This repository demonstrates **Myco's PRD-aware requirements validation system**. Myco inspects proposed code changes in pull requests, maps them to product requirements and acceptance criteria from PRD documents, Jira, and Confluence, runs deterministic and semantic verification, and enforces fail-closed branch protection.

---

## 📋 Product Requirements Documentation

The official requirements for this service are specified in:
- **[Order Checkout PRD (PRD-CHECKOUT-2026)](docs/PRD.md)**

### Key Requirements & Traceability

| Requirement ID | Summary | Severity | Traceability | Acceptance Criteria |
|---|---|---|---|---|
| **`REQ-CHECKOUT-1`** | Coupon Code Validation & Expiry Verification | **Mandatory** | `PROJ-101-AC-1` | Expired coupons rejected (`EXPIRED_COUPON`); unit tests required |
| **`REQ-CHECKOUT-2`** | State Sales Tax Calculation | **Mandatory** | `PROJ-101-AC-2` | Accurate state rates (CA: 8.25%, NY: 8.875%, DE/OR: 0%); unit tests required |
| **`REQ-CHECKOUT-3`** | Asynchronous Receipt Email Dispatch | **Recommended** | `PROJ-101-AC-3` | Non-blocking background event dispatch |

---

## 🛠️ Application Architecture & Intentional Baseline Gaps

The demo application implements an e-commerce checkout service in `src/checkout.ts`.

- **Intentional Baseline Gap:** The initial baseline implementation in `main` contains an intentional omission: `processCheckout` calculates percentage discounts but neglects to check coupon expiration dates against current time, allowing expired coupons like `SUMMER20` to be applied.
- **Verification Scenarios:**
  - **Compliant PR:** Implements coupon expiry validation, rejects expired coupons, and includes automated tests. -> **Myco Check: PASS (Merge Allowed)**
  - **Non-compliant PR:** Modifies checkout logic without verifying coupon expiration or removes required test coverage. -> **Myco Check: FAIL (Merge Blocked)**

---

## 🔒 GitHub Secrets & Required Permissions

### GitHub Workflow Permissions

The CI workflow `.github/workflows/myco-prd-validation.yml` requires the following permissions:

```yaml
permissions:
  contents: read          # Read PR code and repository docs
  pull-requests: write    # Post inline reviews and PR status comments
  checks: write           # Publish GitHub Check runs
  statuses: write         # Publish commit statuses (myco/prd-validation)
```

### GitHub Secrets Configuration

To connect live Jira or Confluence instances, configure the following secrets in **Settings → Secrets and variables → Actions**:

| Secret Name | Description | Required For |
|---|---|---|
| `GITHUB_TOKEN` | Automatically provided by GitHub Actions | GitHub Checks & PR comments |
| `JIRA_BASE_URL` | Base URL (e.g. `https://mycompany.atlassian.net`) | Jira Cloud integration |
| `JIRA_TOKEN` | Jira API token (or Personal Access Token) | Jira Cloud integration |
| `JIRA_EMAIL` | Account email associated with the token | Jira Basic auth |
| `CONFLUENCE_BASE_URL` | Base URL (e.g. `https://mycompany.atlassian.net/wiki`) | Confluence Cloud integration |
| `CONFLUENCE_TOKEN` | Confluence API token | Confluence Cloud integration |
| `CONFLUENCE_EMAIL` | Account email associated with the token | Confluence Basic auth |

*Note: For local or deterministic testing, Myco uses the repository PRD fixture in `docs/PRD.md` without requiring external secrets.*

---

## 🛡️ Enforcing Merge Protection via Branch Protection

To prevent pull requests from merging when mandatory PRD requirements fail:

1. Navigate to **Settings → Branches** in the GitHub repository.
2. Under **Branch protection rules**, click **Add branch protection rule**.
3. In **Branch name pattern**, enter `main`.
4. Enable **Require a pull request before merging**.
5. Enable **Require status checks to pass before merging**:
   - In the search bar, search for and select **`Myco PRD Validation`** and **`myco/prd-validation`**.
6. Check **Require branches to be up to date before merging**.
7. Click **Save changes**.

When enabled, GitHub will disable the "Merge pull request" button whenever Myco reports a `FAIL` status.
