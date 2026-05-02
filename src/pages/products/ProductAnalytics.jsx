import { BarChart3, TrendingUp, Eye, Target, Globe, PieChart } from 'lucide-react';
import { ProductPageTemplate } from './ProductPageTemplate';

const features = [
  { icon: BarChart3, title: 'Digital Presence Score', desc: 'Get a comprehensive 0-100 score across website, social, search, and reviews.' },
  { icon: TrendingUp, title: 'Trend Analysis', desc: 'Track how your digital presence improves week over week with visual charts.' },
  { icon: Eye, title: 'Traffic Insights', desc: 'See where your visitors come from — organic, social, direct, or referral.' },
  { icon: Target, title: 'Conversion Tracking', desc: 'Monitor leads generated, calls received, and direction requests from listings.' },
  { icon: Globe, title: 'Multi-Platform View', desc: 'Unified metrics from Google, Facebook, Instagram, and review sites.' },
  { icon: PieChart, title: 'Custom Reports', desc: 'Export beautiful PDF reports to share with partners or investors.' },
];

const benefits = [
  'Know exactly where you stand digitally — no guesswork',
  'Identify which channels bring the most customers',
  'Track ROI on every marketing effort automatically',
  'Benchmark against competitors in your area',
  'Get alerts when metrics drop below thresholds',
  'Data-driven decisions instead of gut feelings',
];

export const ProductAnalytics = () => (
  <ProductPageTemplate
    icon={BarChart3}
    title="Analytics Dashboard"
    tagline="Real-time Digital Intelligence"
    description="Complete digital presence scoring with website health, social media performance, search visibility, and online reviews — all in one beautiful dashboard."
    color="bg-blue-50 text-blue-600"
    features={features}
    benefits={benefits}
    cta="Start tracking your digital presence today"
  />
);
