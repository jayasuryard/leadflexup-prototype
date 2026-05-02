import { Users, UserPlus, Filter, Phone, Tag, BarChart3 } from 'lucide-react';
import { ProductPageTemplate } from './ProductPageTemplate';

const features = [
  { icon: UserPlus, title: 'Auto Lead Capture', desc: 'Capture leads from website forms, WhatsApp, calls, and social DMs.' },
  { icon: Filter, title: 'Smart Pipeline', desc: 'Visual Kanban board tracks every lead from first contact to conversion.' },
  { icon: Tag, title: 'Lead Scoring', desc: 'AI scores leads by intent, engagement, and conversion probability.' },
  { icon: Phone, title: 'One-Click Follow-up', desc: 'Call, WhatsApp, or email any lead directly from the dashboard.' },
  { icon: BarChart3, title: 'Conversion Analytics', desc: 'See which sources bring the best leads and highest conversion rates.' },
  { icon: Users, title: 'Team Collaboration', desc: 'Assign leads to team members with notes and deadline tracking.' },
];

const benefits = [
  'Never lose a potential customer again',
  'Know exactly which leads are ready to buy',
  'Follow up faster than your competitors',
  'Track every interaction in one place',
  'Automated reminders prevent leads from going cold',
  'Close deals 2x faster with organized pipeline',
];

export const ProductLeadManager = () => (
  <ProductPageTemplate
    icon={Users}
    title="Lead Manager"
    tagline="Capture, Nurture & Convert"
    description="Every lead from every channel in one powerful CRM. Score, prioritize, and convert prospects into paying customers with AI-powered insights."
    color="bg-teal-50 text-teal-600"
    features={features}
    benefits={benefits}
    cta="Start capturing more leads"
  />
);
