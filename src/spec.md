# Specification

## Summary
**Goal:** Build an Internet Computer on-chain e-library seat booking system with Internet Identity login, role-based access control, 2-hour slot bookings, and separate Admin/User dashboards.

**Planned changes:**
- Add Internet Identity authentication (sign in/out) and use caller Principal for all protected backend actions.
- Implement on-chain user records with roles (Admin, Research Scholar, General Student) and enforce role-based access control; Admin can assign/change roles.
- Create on-chain configuration and seat management with defaults (120 total seats, 20 research-reserved) and an Admin UI to update seats/reserved count.
- Implement 2-hour slot generation from admin-configurable library operating hours and enforce one active booking per user at a time.
- Implement booking rules: no double-booking same seat+slot; General Students cannot book research-reserved seats; Research Scholars can book any available seat type.
- Add availability/query endpoints and UI to show seats per date/slot, reflecting bookability based on the signed-in user’s role.
- Build Admin Dashboard: view users/roles, change roles, view all bookings, cancel any booking, configure seats and library timings.
- Build User Dashboard: browse dates/slots/seats, book, cancel own bookings, and view booking history.
- Ensure production-ready IC deployment defaults and secure initialization (no hardcoded admin secrets).
- Create a clean, responsive React + TypeScript + Tailwind UI with an English-only, student-friendly theme that is not blue/purple-dominant and hides admin navigation for non-admin users.

**User-visible outcome:** Users can sign in with Internet Identity, view seat availability by 2-hour slot, book/cancel seats within role rules, and see booking history; Admins can manage roles, view/cancel all bookings, and configure seats and library operating hours.
