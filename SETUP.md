# FounderBox Setup Instructions

## Authentication Setup with Supabase

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new account
2. Create a new project
3. Wait for the project to be set up

### 2. Get Your Supabase Credentials

1. Go to your project dashboard
2. Navigate to Settings > API
3. Copy your Project URL and anon/public key

### 3. Set Up Environment Variables

Create a `.env.local` file in your project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Configure Supabase Authentication

1. Go to Authentication > Settings in your Supabase dashboard
2. Add your site URL to the Site URL field (e.g., `http://localhost:3000`)
3. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/dashboard`

### 5. Enable Email Authentication

1. Go to Authentication > Providers in your Supabase dashboard
2. Make sure Email provider is enabled
3. Configure email templates if needed

### 6. Run the Application

```bash
pnpm dev
```

## Features

### Landing Page (`/`)
- Beautiful hero section with call-to-action
- Features showcase
- Testimonials
- Pricing plans
- Professional footer

### Authentication
- **Sign Up** (`/signup`) - Create new account with email verification
- **Login** (`/login`) - Sign in to existing account
- **Protected Routes** - Dashboard requires authentication

### Dashboard (`/dashboard`)
- Welcome message with user's name
- Quick stats overview
- Proposal generator with live preview
- Sign out functionality

### Proposal Generator
- All existing features from the original app
- Theme customization
- Image and text editing
- PDF preview and generation
- Agency branding

## File Structure

```
app/
├── page.tsx                 # Landing page
├── login/
│   └── page.tsx            # Login page
├── signup/
│   └── page.tsx            # Signup page
├── dashboard/
│   └── page.tsx            # Protected dashboard
├── auth/
│   └── callback/
│       └── route.ts        # Auth callback handler
└── api/
    └── generate-pdf/
        └── route.ts        # PDF generation API

lib/
├── supabase.ts             # Supabase client
├── schemas.ts              # Form validation
├── templates.ts            # Industry templates
├── themes.ts               # Theme configurations
└── pdf-templates.ts        # PDF generation

components/
├── PitchForm.tsx           # Proposal form
├── PDFPreview.tsx          # PDF preview modal
├── ThemeSelector.tsx       # Theme selection
├── AgencyConfig.tsx        # Agency configuration
└── Navigation.tsx          # Navigation component

middleware.ts               # Route protection
```

## Security Features

- **Route Protection** - Middleware prevents unauthorized access
- **Session Management** - Automatic session handling
- **Email Verification** - Required for new accounts
- **Secure Logout** - Proper session cleanup

## User Flow

1. **Landing Page** → User sees the product and pricing
2. **Sign Up** → User creates account with email verification
3. **Email Verification** → User clicks link in email
4. **Dashboard** → User accesses all tools
5. **Proposal Creation** → User creates and customizes proposals
6. **PDF Generation** → User downloads professional PDFs

## Next Steps

1. Set up your Supabase project
2. Add environment variables
3. Test the authentication flow
4. Customize the landing page content
5. Add more tools to the dashboard
6. Deploy to production


