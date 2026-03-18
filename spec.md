# Nigeria Artisan Marketplace

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Artisan/worker profile system with skills, portfolio, location (Nigerian city/state), rates, availability
- Service discovery: search and filter artisans by category, location, and rating
- Hiring system: customers send job requests; artisans accept/decline; artisans can post job listings
- Payment system: customers pay through platform; platform owner earns configurable commission
- Reviews & ratings: customers review and rate artisans post-job
- Artisan dashboard: manage jobs, view earnings, edit profile
- Customer dashboard: manage requests, view payment history
- Admin panel: manage users, monitor transactions, set commission rate, view platform earnings
- In-app messaging between customers and artisans
- Nigerian skill categories: plumbing, electrical, tailoring, carpentry, painting, welding, hair styling, makeup artistry, photography, catering, cleaning, auto repair, and more
- Demo/sample artisan profiles and categories

### Modify
N/A

### Remove
N/A

## Implementation Plan

### Backend (Motoko)
- User roles: admin, artisan, customer
- Artisan profiles: name, bio, skills[], category, city, state, rate, availability, portfolio images, rating, reviewCount
- Job requests: id, customerId, artisanId, title, description, budget, status (pending/accepted/declined/completed/cancelled), timestamps
- Job listings (by artisans to hire workers): id, artisanId, title, description, budget, category, status
- Payments: id, jobId, customerId, artisanId, amount, commissionRate, platformFee, status, timestamp
- Reviews: id, jobId, reviewerId, artisanId, rating, comment, timestamp
- Messages: id, senderId, receiverId, content, timestamp, read
- Platform config: commissionRate (admin-settable)
- Seed data: sample artisan profiles across Nigerian cities

### Frontend
- Landing page: hero, featured artisans, categories grid, how-it-works, testimonials
- Artisan listing/search page: filters by category, city/state, rating
- Artisan profile page: portfolio, reviews, hire button
- Artisan dashboard: jobs, earnings, profile editor
- Customer dashboard: requests, payment history, messaging
- Admin panel: users table, transactions table, commission settings, earnings summary
- In-app messaging UI
- Authorization: role-based (admin/artisan/customer)
