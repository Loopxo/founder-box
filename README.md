# FounderBox 🚀

**The Complete Founder Toolkit - Free, Open Source, and Community-Driven**

FounderBox is a comprehensive suite of tools designed specifically for entrepreneurs and founders. From proposal generation to social media content, we provide everything you need to accelerate your business growth.

## ✨ Features

### 🎯 Core Tools
- **Proposal Generator** - Create stunning, professional proposals with customizable themes
- **Cold Email Templates** - High-converting email templates for outreach
- **Contract Templates** - Legal contract templates for clients and partnerships
- **Invoice Generator** - Professional invoice templates with automatic calculations
- **SEO Content** - SEO-optimized content templates for blogs and websites
- **Sales Copy** - High-converting sales copy for your products/services
- **Social Media Content** - Engaging social media content for all platforms
- **Competitive Analysis** - Analyze your competition and market positioning

### 🎨 Design Features
- **Multiple Themes** - Dark Luxe, Minimal Elegance, Geometric Futurism, Corporate Modern, Magazine Style
- **Custom Branding** - Add your logo, company details, and custom colors
- **Interactive Preview** - Full preview with real-time customization
- **PDF Export** - High-quality PDF generation with professional layouts

### 🔐 Authentication
- **Supabase Integration** - Secure user authentication and management
- **Protected Routes** - Dashboard access requires authentication
- **User Profiles** - Personalized experience for each user

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account (free tier available)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/founder-box.git
cd founder-box
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Set Up Supabase

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Settings > API to get your credentials

#### Configure Environment Variables
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Development Server
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + Custom Components
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **PDF Generation**: Puppeteer
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React

## 📁 Project Structure

```
founder-box/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Protected dashboard pages
│   ├── login/            # Authentication pages
│   └── signup/
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── ...               # Feature-specific components
├── lib/                  # Utility functions and configurations
│   ├── templates.ts      # Industry templates
│   ├── themes.ts         # Theme configurations
│   ├── pdf-templates.ts  # PDF generation logic
│   └── supabase.ts       # Supabase client
├── public/               # Static assets
└── templates/            # Industry-specific templates
```

## 🎨 Customization

### Adding New Themes
1. Edit `lib/themes.ts`
2. Add your theme configuration
3. Update the theme selector component

### Adding New Industries
1. Edit `lib/templates.ts`
2. Add industry-specific content
3. Update the form schemas

### Customizing PDF Templates
1. Edit `lib/pdf-templates.ts`
2. Modify HTML structure and styling
3. Update CSS variables for theme integration

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |

### Supabase Setup

1. **Enable Email Auth** in Authentication > Providers
2. **Configure Email Templates** in Authentication > Email Templates
3. **Set up Row Level Security** for your tables (if using database)

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commits
- Add tests for new features
- Update documentation

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ by founders, for founders
- Inspired by the challenges of growing a business
- Powered by the open-source community

## 📞 Support

- **Documentation**: [docs.founderbox.com](https://docs.founderbox.com)
- **Issues**: [GitHub Issues](https://github.com/your-username/founder-box/issues)
- **Discord**: [Join our community](https://discord.gg/founderbox)
- **Email**: support@founderbox.com

## 🗺️ Roadmap

- [ ] Team collaboration features
- [ ] Advanced analytics dashboard
- [ ] API for third-party integrations
- [ ] Mobile app (React Native)
- [ ] AI-powered content suggestions
- [ ] Multi-language support
- [ ] Advanced customization options

---

**Made with ❤️ by the FounderBox community**
