import { Inbox, Mail, MessageCircle, Phone, Globe, Sparkles } from 'lucide-react';
import { ProductPageTemplate } from './ProductPageTemplate';

const features = [
  { icon: Inbox, title: 'All Channels, One View', desc: 'Email, WhatsApp, Instagram DMs, Facebook messages, and SMS in one inbox.' },
  { icon: Sparkles, title: 'AI Smart Replies', desc: 'Get AI-suggested responses based on message context and your tone.' },
  { icon: MessageCircle, title: 'WhatsApp Business', desc: 'Manage WhatsApp conversations with templates and quick replies.' },
  { icon: Globe, title: 'Social DMs', desc: 'Reply to Instagram and Facebook messages without switching apps.' },
  { icon: Phone, title: 'Call & SMS Logs', desc: 'Missed calls and SMS automatically logged with customer context.' },
  { icon: Mail, title: 'Email Integration', desc: 'Connect Gmail, Outlook, or any email for seamless communication.' },
];

const benefits = [
  'Never miss a customer message across any channel',
  'Reply 5x faster with AI-suggested responses',
  'All conversation history in one timeline per customer',
  'Assign conversations to team members easily',
  'Priority inbox surfaces urgent messages first',
  'Works on mobile — respond from anywhere',
];

export const ProductInbox = () => (
  <ProductPageTemplate
    icon={Inbox}
    title="Unified Inbox"
    tagline="All Messages, One Place"
    description="Stop switching between 6 different apps. Every customer message — WhatsApp, email, Instagram DMs, Facebook, SMS — in one beautiful, AI-powered inbox."
    color="bg-indigo-50 text-indigo-600"
    features={features}
    benefits={benefits}
    cta="Unify your messages today"
  />
);
