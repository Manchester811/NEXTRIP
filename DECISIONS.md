# Technical Decisions

## 1. Motion instead of a second animation system

**Choice:** Keep the existing `motion` dependency and use it for page, form, card, payment and confirmation transitions.

**Why:** The project already included Motion, so this avoids unnecessary dependencies and keeps interactions consistent.

**Trade-off:** Some advanced animation patterns require more component-level code than pure CSS.

## 2. Separate authentication state from credentials

**Choice:** Persist only safe user/session information and an optional remembered email. Never persist a plaintext password.

**Why:** Browser storage is not an appropriate place for raw passwords. A real deployment should delegate credential storage/authentication to a trusted provider.

**Trade-off:** The demo cannot restore a password after refresh, which is intentional and safer.

## 3. Separate bookings from transactions

**Choice:** Store booking records and transaction records independently.

**Why:** Payment state has its own lifecycle and should not be conflated with the ticket itself. This makes failed, pending and refunded transactions possible without corrupting booking state.

**Trade-off:** The production backend will need relational IDs/foreign keys and server-side transaction handling to make this robust across devices.
