# NEXTRIP

NEXTRIP is a multi-modal travel booking interface for buses, trains, flights, cabs, metro and ferries.

## What was built

- Premium responsive travel-booking UI with Motion transitions.
- Search and multi-modal result browsing.
- Trip details and seat selection flow.
- Passenger details and validation.
- Demo payment/transaction lifecycle with transaction IDs.
- Digital ticket confirmation and print/save-to-PDF flow.
- Bookings history with upcoming/completed/cancelled tabs and cancellation.
- Login/register experience with remembered email and secure separation of credentials from browser storage.
- Profile and account-security surface.
- Existing admin dashboard retained and polished by the project design system.

## Architecture

```text
React UI
  ├── Pages / Routes
  ├── Reusable UI + transport cards
  ├── Motion interactions
  └── Services
       ├── authStore (session/user state)
       └── bookingStore (bookings + transactions)

Future production integrations:
  Auth provider → Supabase/Auth0/etc.
  Payment provider → Stripe/Razorpay/etc.
  Database → PostgreSQL/Supabase
```

## Results / metrics

- 13+ customer/admin routes in the application shell.
- 6 transport modes represented in the search/result system.
- 3 demo payment methods: UPI, Card and Wallet.
- 4 booking states/categories exposed to users: all, upcoming, completed and cancelled.
- Reduced-motion support is preserved globally.

These are implementation metrics, not production traffic or conversion metrics.

## Decisions

See [`DECISIONS.md`](./DECISIONS.md) for the main technical choices and trade-offs.
