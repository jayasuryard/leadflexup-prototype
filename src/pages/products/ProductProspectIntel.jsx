import { Telescope, Search, MapPin, TrendingUp, Target, Eye } from 'lucide-react';
import { ProductPageTemplate } from './ProductPageTemplate';

const features = [
  { icon: Search, title: 'Intent Signals', desc: 'Detect people actively searching for businesses like yours in real-time.' },
  { icon: MapPin, title: 'Geo-Targeting', desc: 'Find prospects within your service radius who need what you offer.' },
  { icon: TrendingUp, title: 'Buying Behavior', desc: 'AI identifies patterns that indicate high purchase probability.' },
  { icon: Target, title: 'Competitor Visitors', desc: 'Reach people visiting or reviewing your competitors.' },
  { icon: Eye, title: 'Social Listening', desc: 'Monitor social posts asking for recommendations in your category.' },
  { icon: Telescope, title: 'Lead Enrichment', desc: 'Auto-enrich prospects with contact info, preferences, and history.' },
];

const benefits = [
  'Find customers before they find your competitors',
  'Target only high-intent prospects — no wasted effort',
  'AI does the research, you close the deals',
  'Hyper-local targeting within your service area',
  'See estimated deal value for every prospect',
  'Automated outreach to warm leads saves hours daily',
];

export const ProductProspectIntel = () => (
  <ProductPageTemplate
    icon={Telescope}
    title="Prospect Intelligence"
    tagline="Find Customers Before They Find You"
    description="AI-powered prospect discovery that identifies people actively looking for businesses like yours. Real-time intent signals from search, social, and review platforms."
    color="bg-rose-50 text-rose-600"
    features={features}
    benefits={benefits}
    cta="Discover untapped prospects now"
  />
);
