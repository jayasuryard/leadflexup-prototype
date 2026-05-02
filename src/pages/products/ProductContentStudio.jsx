import { Palette, Image, FileText, Video, Sparkles, Calendar } from 'lucide-react';
import { ProductPageTemplate } from './ProductPageTemplate';

const features = [
  { icon: Sparkles, title: 'AI Content Writer', desc: 'Generate posts, captions, and blogs in your brand voice with one click.' },
  { icon: Image, title: 'Design Templates', desc: '200+ editable templates for social posts, stories, and ads.' },
  { icon: Calendar, title: 'Content Calendar', desc: 'Plan and schedule posts across all platforms from one dashboard.' },
  { icon: Video, title: 'Video & Reels', desc: 'Create short-form video scripts and storyboards for Instagram & YouTube.' },
  { icon: FileText, title: 'Blog Generator', desc: 'SEO-optimized blog posts written in minutes, not hours.' },
  { icon: Palette, title: 'Brand Kit', desc: 'Save your colors, fonts, and logos for consistent branding everywhere.' },
];

const benefits = [
  'Create a month of content in one afternoon',
  'AI understands your business and audience',
  'Multi-language content for regional markets',
  'Auto-resize for every platform (FB, IG, LinkedIn, etc.)',
  'Never run out of content ideas again',
  'Consistent posting schedule grows followers 3x faster',
];

export const ProductContentStudio = () => (
  <ProductPageTemplate
    icon={Palette}
    title="Content Studio"
    tagline="AI-Powered Content Creation"
    description="Create stunning social media posts, blogs, and marketing content in minutes using AI that understands your brand, audience, and local market."
    color="bg-purple-50 text-purple-600"
    features={features}
    benefits={benefits}
    cta="Create your first post with AI"
  />
);
