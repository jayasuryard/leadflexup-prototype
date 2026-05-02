import { Mic, Phone, MessageCircle, Clock, Globe, Sparkles } from 'lucide-react';
import { ProductPageTemplate } from './ProductPageTemplate';

const features = [
  { icon: Mic, title: 'Natural Conversations', desc: 'AI understands Indian accents and languages — Hindi, Tamil, Kannada & more.' },
  { icon: Phone, title: 'Call Handling', desc: 'Answer customer calls 24/7, take bookings, and provide info automatically.' },
  { icon: MessageCircle, title: 'Voice Commands', desc: 'Manage your business hands-free — check leads, schedule posts, get reports.' },
  { icon: Globe, title: 'Multi-Language', desc: 'Serves customers in 6+ Indian languages seamlessly.' },
  { icon: Clock, title: '24/7 Availability', desc: 'Never miss a customer call — AI handles enquiries round the clock.' },
  { icon: Sparkles, title: 'Smart Escalation', desc: 'Complex queries automatically routed to you with full context.' },
];

const benefits = [
  'Never miss a customer call even when you\'re busy',
  'Handles bookings, inquiries, and FAQs automatically',
  'Speaks your customers\' language — literally',
  'Frees up 3+ hours daily from phone calls',
  'Professional experience for every caller',
  'Learns your business and improves over time',
];

export const ProductVoiceAgent = () => (
  <ProductPageTemplate
    icon={Mic}
    title="AI Voice Agent"
    tagline="Your 24/7 Business Assistant"
    description="An AI-powered voice agent that answers calls, handles bookings, and serves customers in multiple Indian languages — so you never miss a business opportunity."
    color="bg-sky-50 text-sky-600"
    features={features}
    benefits={benefits}
    cta="Activate your AI voice agent"
  />
);
