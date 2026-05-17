# Kalsuq

Kalsuq is a premium, high-performance e-commerce platform designed for the Ethiopian market. Built with a focus on editorial aesthetics and robust system architecture, the platform facilitates the sale of curated fashion and handcrafted goods while providing a seamless, secure checkout experience.

## System Architecture

The application is built on a modern, serverless-ready web stack:

*   **Framework:** Next.js 14 (App Router)
*   **Language:** TypeScript
*   **Database:** PostgreSQL
*   **ORM:** Prisma
*   **State Management:** Zustand (Client-side), React Context
*   **Styling:** Tailwind CSS, Framer Motion (Micro-interactions)
*   **Payments:** Chapa API Integration
*   **Media Management:** Cloudinary
*   **Observability:** Sentry

## Core Modules

*   **Storefront:** High-conversion, mobile-responsive shopping interface with multi-language support (English and Amharic). Includes an optimized cart drawer and variant-specific inventory checking.
*   **Checkout Pipeline:** Secure, guest-checkout optimized flow. Payments are processed via Chapa, utilizing asynchronous server-to-server webhooks to guarantee transactional integrity.
*   **Admin Dashboard:** Role-based access controlled (RBAC) portal for managing inventory, viewing financial analytics, and processing orders.
*   **Partner Network:** A built-in affiliate portal allowing partners to generate referral links, track conversion metrics, and monitor commission payouts.

## Security & Production Hardening

The application has been heavily audited and hardened for enterprise deployment:
*   **Authentication:** Custom JWT-based stateless authentication. Passwords are cryptographically hashed using `bcrypt` (cost factor 12).
*   **Rate Limiting:** Serverless-safe, in-memory rate limiting applied to critical mutation endpoints (Login, Partner Application, Checkout) to mitigate brute-force and volumetric attacks.
*   **Atomic Transactions:** Inventory stock decrementation and order generation are executed within Prisma atomic transactions to prevent race conditions during high-traffic events.
*   **Idempotency:** Payment webhook handlers implement idempotency checks to prevent double-counting of commissions or duplicated order confirmations.
*   **Data Privacy:** Personally Identifiable Information (PII) is automatically scrubbed from server logs before transmission to monitoring services.

## Development Setup

### Prerequisites
*   Node.js 18.x or later
*   PostgreSQL database (local or cloud-provisioned)
*   Chapa Merchant Account
*   Cloudinary Account

### Initialization

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-org/kalsuq.git
    cd kalsuq
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Duplicate the example environment file and populate all cryptographic secrets and connection URIs.
    ```bash
    cp .env.example .env
    ```

4.  **Database Provisioning:**
    Synchronize the Prisma schema with your PostgreSQL instance.
    ```bash
    npx prisma db push
    ```

5.  **Start Development Server:**
    ```bash
    npm run dev
    ```

### Bootstrapping the Admin Account

The system is designed with a "locked-by-default" administrative setup. To create the initial master administrator account:

1.  Ensure `SETUP_SECRET` is defined in your `.env` file.
2.  Transmit a POST request to the setup endpoint. Example using `curl`:

    ```bash
    curl -X POST http://localhost:3000/api/setup \
      -H "Content-Type: application/json" \
      -H "x-setup-secret: YOUR_SETUP_SECRET" \
      -d '{"email":"admin@kalsuq.com", "password":"StrongPassword123!", "name":"Master Admin"}'
    ```

3.  Once the first administrator is created, the setup route permanently disables itself to prevent unauthorized access.

## License

Copyright © 2026 Kalsuq. All Rights Reserved.
Unauthorized copying, modification, or distribution of this software is strictly prohibited.
