import { Zap, Mail, MessageCircle, Clock, GitBranch, Bell } from 'lucide-react';
import { ProductPageTemplate } from './ProductPageTemplate';

const features = [
  { icon: GitBranch, title: 'Visual Workflow Builder', desc: 'Drag-and-drop automation flows — no coding or technical skills needed.' },
  { icon: Mail, title: 'Email Campaigns', desc: 'Automated email sequences triggered by customer actions.' },
  { icon: MessageCircle, title: 'WhatsApp Automation', desc: 'Send booking confirmations, reminders, and offers on WhatsApp.' },
  { icon: Clock, title: 'Smart Scheduling', desc: 'Time-based triggers send messages when customers are most active.' },
  { icon: Bell, title: 'Lead Notifications', desc: 'Instant alerts when a new lead comes in so you never miss one.' },
  { icon: Zap, title: 'Multi-Channel', desc: 'Orchestrate across email, SMS, WhatsApp, and social in one flow.' },
];

const benefits = [
  'Save 15+ hours per week on repetitive marketing tasks',
  'Never miss a follow-up with automatic lead nurturing',
  'Send the right message at the right time automatically',
  'Convert more leads while you sleep',
  'Pre-built templates for common Indian business scenarios',
  'Works even if you have zero technical background',
];

export const ProductAutomation = () => (
  <ProductPageTemplate
    icon={Zap}
    title="Marketing Automation"
    tagline="Work Smarter, Not Harder"
    description="Automate your marketing workflows — from lead capture to follow-ups to campaigns. Set it once and let it run 24/7 while you focus on your business."
    color="bg-amber-50 text-amber-600"
    features={features}
    benefits={benefits}
    cta="Automate your first workflow today"
  />
);
