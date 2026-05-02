import { Globe, Palette, Layout, Smartphone, Zap, Search } from 'lucide-react';
import { ProductPageTemplate } from './ProductPageTemplate';

const features = [
  { icon: Layout, title: 'Drag & Drop Builder', desc: 'No coding needed. Build beautiful pages with our visual editor.' },
  { icon: Palette, title: 'Professional Templates', desc: '50+ industry-specific templates designed for Indian businesses.' },
  { icon: Smartphone, title: 'Mobile Responsive', desc: 'Every site looks perfect on phones, tablets, and desktops.' },
  { icon: Search, title: 'Built-in SEO', desc: 'Automatic meta tags, sitemaps, and schema markup for Google rankings.' },
  { icon: Zap, title: 'Fast Loading', desc: 'Optimized for Indian internet speeds — loads in under 2 seconds.' },
  { icon: Globe, title: 'Custom Domain', desc: 'Connect your own domain or get a free subdomain to start.' },
];

const benefits = [
  'Go from zero to a live website in under 10 minutes',
  'No technical skills or coding knowledge required',
  'Built-in contact forms capture leads automatically',
  'WhatsApp chat widget connects customers instantly',
  'Google My Business integration for local SEO',
  'Multi-language support for regional audiences',
];

export const ProductWebsiteBuilder = () => (
  <ProductPageTemplate
    icon={Globe}
    title="Website Builder"
    tagline="Your Online Presence, Instantly"
    description="Build a professional, mobile-responsive website in minutes — no coding, no designers, no hassle. Optimized for Indian businesses and local SEO."
    color="bg-emerald-50 text-emerald-600"
    features={features}
    benefits={benefits}
    cta="Build your website in 10 minutes"
  />
);
