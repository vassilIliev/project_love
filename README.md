# Valentine Link 💝

A web app that sells personalized St. Valentine invitations as shareable links. Create a unique link, share it with your special someone, and watch them try (and fail) to click "No"!

## Features

- **Interactive Demo** — Try the invitation UI on the landing page (no payment needed)
- **Runaway "No" Button** — The NO button dodges the cursor, making it impossible to refuse!
- **Confetti Celebration** — Clicking YES triggers a confetti explosion and reveals the Valentine details
- **Stripe Payments** — Secure checkout via Stripe to create paid invitation links
- **Shareable Links** — Each paid invitation gets a unique, unguessable URL + QR code
- **Mobile Friendly** — Responsive design that works beautifully on all devices

## Tech Stack

- **Next.js 14+** (App Router) with TypeScript
- **Tailwind CSS** for styling
- **Prisma ORM** with SQLite (local) / PostgreSQL (production)
- **Stripe Checkout** for payments
- **canvas-confetti** for celebration effects

## Getting Started

### Prerequisites

- Node.js 20+
- A [Stripe account](https://dashboard.stripe.com/register) (free to create)

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Required variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Database connection string. Use `file:./dev.db` for local SQLite |
| `APP_URL` | Your app's base URL (e.g. `http://localhost:3000`) |
| `STRIPE_SECRET_KEY` | Your Stripe secret key (starts with `sk_test_` or `sk_live_`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key |
| `STRIPE_PRICE_ID` | *(Optional)* A pre-created Stripe Price ID. If not set, a dynamic $2.99 price is used |

### 3. Set up the database

```bash
npx prisma migrate dev
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Payment Flow

1. User fills in the form on the landing page
2. A **draft** invitation is created in the database
3. User is redirected to **Stripe Checkout**
4. After successful payment, the `/success` page:
   - Verifies the Stripe session server-side
   - Marks the invitation as **ACTIVE**
   - Displays the shareable link + QR code
5. The recipient opens `/v/{id}` and sees the personalized invitation

### Why `/success` verification instead of webhooks?

For simplicity, this app verifies payment on the success page redirect by checking `session.payment_status === "paid"` server-side. This is sufficient for most use cases.

For production robustness, you should **also** set up a Stripe webhook:

1. Create a webhook endpoint at `/api/webhooks/stripe`
2. Listen for `checkout.session.completed` events
3. Activate the invitation in the webhook handler
4. Set the webhook secret in `STRIPE_WEBHOOK_SECRET`

This ensures invitations are activated even if the user closes the browser before reaching `/success`.

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Set the environment variables in Vercel dashboard
4. For production, switch `DATABASE_URL` to a PostgreSQL connection string (e.g. from [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app))
5. Update `APP_URL` to your production domain
6. Update the Prisma schema provider to `postgresql` for production

## Project Structure

```
src/
├── app/
│   ├── api/checkout/route.ts   # Stripe checkout API
│   ├── cancel/page.tsx         # Payment cancel page
│   ├── success/page.tsx        # Post-payment success page
│   ├── v/[id]/page.tsx         # Invitation page
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   └── globals.css             # Global styles
├── components/
│   ├── sections/               # Landing page sections
│   ├── ConfettiButton.tsx      # YES button with confetti
│   ├── RunawayButton.tsx       # NO button that dodges cursor
│   ├── InvitationCard.tsx      # Core invitation UI
│   ├── CreateForm.tsx          # Invitation creation form
│   ├── CopyLinkButton.tsx      # Copy-to-clipboard button
│   └── FloatingHearts.tsx      # Background animation
├── lib/
│   ├── db.ts                   # Prisma client singleton
│   └── stripe.ts               # Stripe client
prisma/
├── schema.prisma               # Database schema
└── migrations/                 # Database migrations
```

## License

MIT
