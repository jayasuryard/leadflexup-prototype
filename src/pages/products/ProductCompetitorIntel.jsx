import { Trophy, BarChart3, Eye, Target, TrendingUp, MapPin } from 'lucide-react';
import { ProductPageTemplate } from './ProductPageTemplate';

const features = [
  { icon: Trophy, title: 'Live Leaderboard', desc: 'See exactly where you rank against every competitor in your area.' },
  { icon: BarChart3, title: 'Score Comparison', desc: 'Compare digital presence scores across website, social, SEO & reviews.' },
  { icon: Eye, title: 'Strategy Tracking', desc: 'Monitor what competitors are doing — new posts, ads, offers, reviews.' },
  { icon: MapPin, title: 'Geo-Mapping', desc: 'Visual map showing competitor locations, density, and your coverage gaps.' },
  { icon: TrendingUp, title: 'Gap Analysis', desc: 'AI identifies exactly where competitors are weak and you can win.' },
  { icon: Target, title: 'Alert System', desc: 'Get notified when competitors launch campaigns or gain reviews.' },
];

const benefits = [
  'Know exactly what your competitors are doing online',
  'Find gaps in the market before anyone else',
  'Learn from competitor strategies — replicate what works',
  'Stay ahead with real-time competitive alerts',
  'Data-backed positioning against your market',
  'Turn competitor weaknesses into your strengths',
];

export const ProductCompetitorIntel = () => (
  <ProductPageTemplate
    icon={Trophy}
    title="Competitor Intelligence"
    tagline="Track & Outperform Your Market"
    description="Real-time competitive analysis with live leaderboards, gap identification, and strategic insights. Know exactly where you stand and how to win."
    color="bg-orange-50 text-orange-600"
    features={features}
    benefits={benefits}
    cta="See how you compare to competitors"
  />
);
