import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, Share2, MapPin, ArrowRight, SkipForward,
  Check, TrendingUp, X, ChevronRight, Eye,
  Layout, Upload, ShoppingCart,
  Phone, Clock, Star, Mic, MicOff,
  Play, ExternalLink, Video, Sparkles,
  Palette, MonitorSmartphone, Image
} from 'lucide-react';
import { useApp } from '../context/AppContext';

/* ══════════════════════════════════════════════════════════
   WEBSITE TEMPLATES
   ══════════════════════════════════════════════════════════ */
const websiteTemplates = [
  { id: 1, name: 'Modern Starter', category: 'General', color: '#0d886f', desc: 'Clean minimal layout' },
  { id: 2, name: 'Restaurant Pro', category: 'Food', color: '#b45309', desc: 'Menu + reservation ready' },
  { id: 3, name: 'Salon Elegance', category: 'Beauty', color: '#9333ea', desc: 'Booking-focused design' },
  { id: 4, name: 'Retail Express', category: 'Retail', color: '#dc2626', desc: 'Product showcase grid' },
  { id: 5, name: 'Service Hub', category: 'Services', color: '#1e2f52', desc: 'Service listing layout' },
  { id: 6, name: 'Portfolio Studio', category: 'Creative', color: '#0369a1', desc: 'Visual portfolio style' },
  { id: 7, name: 'Healthcare Plus', category: 'Health', color: '#059669', desc: 'Appointment booking' },
  { id: 8, name: 'Education First', category: 'Education', color: '#7c3aed', desc: 'Course catalog layout' },
  { id: 9, name: 'Local Market', category: 'Retail', color: '#ea580c', desc: 'Multi-vendor layout' },
  { id: 10, name: 'Fitness Zone', category: 'Health', color: '#0f172a', desc: 'Class schedule + plans' },
  { id: 11, name: 'Hotel Grand', category: 'Hospitality', color: '#854d0e', desc: 'Room booking system' },
  { id: 12, name: 'Auto Works', category: 'Services', color: '#374151', desc: 'Service request forms' },
  { id: 13, name: 'Tech Solutions', category: 'Tech', color: '#1d4ed8', desc: 'SaaS landing page' },
  { id: 14, name: 'Wedding Bliss', category: 'Events', color: '#be185d', desc: 'Event gallery layout' },
  { id: 15, name: 'Grocery Fresh', category: 'Food', color: '#16a34a', desc: 'Product + delivery' },
];

/* ─── Category → Template auto-mapping ─── */
const categoryTemplateMap = {
  restaurant: 2, retail: 4, salon: 3, gym: 10, medical: 7,
  education: 8, professional: 5, automotive: 12, hotel: 11,
};

/* ─── STT language map ─── */
const sttLangMap = { en: 'en-IN', hi: 'hi-IN', ta: 'ta-IN', kn: 'kn-IN', te: 'te-IN', ml: 'ml-IN' };

/* ─── Category-specific form configurations ─── */
const categoryFormConfigs = {
  restaurant: {
    title: 'Restaurant Details', icon: '🍽️',
    fields: [
      { key: 'description', label: 'Business Description', placeholder: 'Tell customers about your restaurant, ambiance, and what makes you special...', multiline: true },
      { key: 'tagline', label: 'Tagline', placeholder: 'e.g., Authentic flavors since 1995' },
      { key: 'cuisineType', label: 'Cuisine Type', placeholder: 'e.g., North Indian, Chinese, Italian, Multi-cuisine' },
      { key: 'specialties', label: 'Specialties / Signature Dishes', placeholder: 'e.g., Hyderabadi Biryani, Butter Chicken' },
      { key: 'seatingCapacity', label: 'Seating Capacity', placeholder: 'e.g., 50 indoor, 20 outdoor' },
      { key: 'phone', label: 'Phone', placeholder: 'Contact number' },
      { key: 'email', label: 'Email', placeholder: 'restaurant@email.com', type: 'email' },
      { key: 'address', label: 'Address', placeholder: 'Full restaurant address' },
      { key: 'hours', label: 'Business Hours', placeholder: 'e.g., Mon-Sun: 11 AM - 11 PM' },
    ],
    uploads: [
      { key: 'menuPhotos', label: 'Menu Card Photos', desc: 'Upload your menu cards so customers can browse', icon: '📋' },
      { key: 'foodPhotos', label: 'Food & Restaurant Photos', desc: 'Best dishes, interior, exterior photos', icon: '📸' },
    ],
    toggles: [
      { key: 'delivery', label: 'Home Delivery Available' },
      { key: 'takeaway', label: 'Takeaway Available' },
      { key: 'reservation', label: 'Table Reservation' },
    ],
  },
  hotel: {
    title: 'Hotel & Hospitality Details', icon: '🏨',
    fields: [
      { key: 'description', label: 'Hotel Description', placeholder: 'Describe your hotel, heritage, and unique experience...', multiline: true },
      { key: 'tagline', label: 'Tagline', placeholder: 'e.g., Your home away from home' },
      { key: 'roomTypes', label: 'Room Types & Pricing', placeholder: 'e.g., Deluxe - ₹3000, Suite - ₹8000', multiline: true },
      { key: 'amenities', label: 'Amenities', placeholder: 'e.g., Pool, Gym, Spa, Restaurant, WiFi' },
      { key: 'checkinTime', label: 'Check-in / Check-out', placeholder: 'e.g., Check-in: 2 PM, Check-out: 11 AM' },
      { key: 'starRating', label: 'Star Rating', placeholder: 'e.g., 4-Star, 5-Star, Boutique' },
      { key: 'phone', label: 'Phone', placeholder: 'Reservation contact' },
      { key: 'email', label: 'Email', placeholder: 'reservations@hotel.com', type: 'email' },
      { key: 'address', label: 'Address', placeholder: 'Full hotel address' },
      { key: 'hours', label: 'Reception Hours', placeholder: 'e.g., 24/7' },
    ],
    uploads: [
      { key: 'menuPhotos', label: 'Restaurant Menu Card', desc: 'In-house restaurant or room service menu', icon: '🍽️' },
      { key: 'roomPhotos', label: 'Hotel & Room Photos', desc: 'Rooms, lobby, pool, facilities', icon: '🏨' },
    ],
    toggles: [
      { key: 'parking', label: 'Parking Available' },
      { key: 'inRestaurant', label: 'In-house Restaurant' },
      { key: 'spa', label: 'Spa & Wellness' },
      { key: 'pool', label: 'Swimming Pool' },
    ],
  },
  salon: {
    title: 'Salon & Spa Details', icon: '💇',
    fields: [
      { key: 'description', label: 'Salon Description', placeholder: 'Describe your salon, vibe, and expertise...', multiline: true },
      { key: 'tagline', label: 'Tagline', placeholder: 'e.g., Where beauty meets perfection' },
      { key: 'services', label: 'Services Offered', placeholder: 'e.g., Haircut, Coloring, Facial, Bridal Makeup', multiline: true },
      { key: 'priceRange', label: 'Price Range', placeholder: 'e.g., Haircut from ₹200, Facial from ₹500' },
      { key: 'specialists', label: 'Specialists / Staff', placeholder: 'e.g., 3 senior stylists, 2 beauty experts' },
      { key: 'phone', label: 'Phone', placeholder: 'Booking contact' },
      { key: 'email', label: 'Email', placeholder: 'salon@email.com', type: 'email' },
      { key: 'address', label: 'Address', placeholder: 'Full salon address' },
      { key: 'hours', label: 'Business Hours', placeholder: 'e.g., Tue-Sun: 10 AM - 8 PM (Closed Monday)' },
    ],
    uploads: [
      { key: 'salonPhotos', label: 'Salon Photos', desc: 'Interior, seating, work stations', icon: '💇' },
      { key: 'portfolioPhotos', label: 'Work Portfolio', desc: 'Before/after, hairstyles, makeup looks', icon: '📸' },
    ],
    toggles: [
      { key: 'homeService', label: 'Home Service Available' },
      { key: 'appointment', label: 'Online Booking' },
    ],
  },
  gym: {
    title: 'Gym & Fitness Details', icon: '💪',
    fields: [
      { key: 'description', label: 'Gym Description', placeholder: 'Describe your gym, training philosophy, and facilities...', multiline: true },
      { key: 'tagline', label: 'Tagline', placeholder: 'e.g., Transform your body, transform your life' },
      { key: 'equipment', label: 'Equipment Available', placeholder: 'e.g., Treadmills, Cross-trainers, Free weights' },
      { key: 'classes', label: 'Classes Offered', placeholder: 'e.g., Yoga, Zumba, CrossFit, Boxing' },
      { key: 'membershipPlans', label: 'Membership Plans', placeholder: 'e.g., Monthly ₹1500, Annual ₹12000', multiline: true },
      { key: 'trainers', label: 'Trainers', placeholder: 'e.g., 5 certified personal trainers' },
      { key: 'phone', label: 'Phone', placeholder: 'Contact number' },
      { key: 'email', label: 'Email', placeholder: 'gym@email.com', type: 'email' },
      { key: 'address', label: 'Address', placeholder: 'Full gym address' },
      { key: 'hours', label: 'Gym Hours', placeholder: 'e.g., Mon-Sat: 5 AM - 10 PM' },
    ],
    uploads: [
      { key: 'gymPhotos', label: 'Gym & Equipment Photos', desc: 'Training area, equipment, facilities', icon: '💪' },
    ],
    toggles: [
      { key: 'personalTraining', label: 'Personal Training' },
      { key: 'trialSession', label: 'Free Trial Session' },
    ],
  },
  medical: {
    title: 'Medical Clinic Details', icon: '🏥',
    fields: [
      { key: 'description', label: 'Clinic Description', placeholder: 'Describe your clinic, specialties, and care philosophy...', multiline: true },
      { key: 'tagline', label: 'Tagline', placeholder: 'e.g., Caring for your health, always' },
      { key: 'specializations', label: 'Specializations', placeholder: 'e.g., General Medicine, Pediatrics, Dermatology' },
      { key: 'doctors', label: 'Doctors & Staff', placeholder: 'e.g., Dr. Sharma (MBBS, MD) - General Medicine', multiline: true },
      { key: 'insuranceAccepted', label: 'Insurance Accepted', placeholder: 'e.g., Star Health, ICICI Lombard' },
      { key: 'phone', label: 'Phone', placeholder: 'Appointment number' },
      { key: 'email', label: 'Email', placeholder: 'clinic@email.com', type: 'email' },
      { key: 'address', label: 'Address', placeholder: 'Full clinic address' },
      { key: 'hours', label: 'Clinic Hours', placeholder: 'e.g., Mon-Sat: 9 AM - 1 PM, 5 PM - 9 PM' },
    ],
    uploads: [
      { key: 'clinicPhotos', label: 'Clinic Photos', desc: 'Reception, consulting rooms, facilities', icon: '🏥' },
    ],
    toggles: [
      { key: 'emergency', label: '24/7 Emergency' },
      { key: 'onlineConsult', label: 'Online Consultation' },
      { key: 'homeVisit', label: 'Home Visit Available' },
    ],
  },
  education: {
    title: 'Education & Training Details', icon: '📚',
    fields: [
      { key: 'description', label: 'Institute Description', placeholder: 'Describe your institute, methodology, and achievements...', multiline: true },
      { key: 'tagline', label: 'Tagline', placeholder: 'e.g., Empowering minds, shaping futures' },
      { key: 'courses', label: 'Courses / Programs', placeholder: 'e.g., Spoken English, Computer Science, NEET Coaching', multiline: true },
      { key: 'faculty', label: 'Faculty Info', placeholder: 'e.g., 10+ experienced teachers, IIT alumni' },
      { key: 'certifications', label: 'Certifications / Affiliations', placeholder: 'e.g., ISO Certified, Affiliated to XYZ University' },
      { key: 'phone', label: 'Phone', placeholder: 'Admission contact' },
      { key: 'email', label: 'Email', placeholder: 'info@institute.com', type: 'email' },
      { key: 'address', label: 'Address', placeholder: 'Full institute address' },
      { key: 'hours', label: 'Operating Hours', placeholder: 'e.g., Mon-Sat: 8 AM - 6 PM' },
    ],
    uploads: [
      { key: 'institutePhotos', label: 'Institute Photos', desc: 'Classrooms, labs, campus', icon: '📚' },
    ],
    toggles: [
      { key: 'onlineClasses', label: 'Online Classes' },
      { key: 'placement', label: 'Placement Assistance' },
      { key: 'freeTrial', label: 'Free Demo Class' },
    ],
  },
  professional: {
    title: 'Professional Services Details', icon: '💼',
    fields: [
      { key: 'description', label: 'Business Description', placeholder: 'Describe your services, expertise, and why clients choose you...', multiline: true },
      { key: 'tagline', label: 'Tagline', placeholder: 'e.g., Expert solutions for your business' },
      { key: 'services', label: 'Services Offered', placeholder: 'e.g., Tax Filing, Legal Consulting, IT Solutions', multiline: true },
      { key: 'experience', label: 'Experience', placeholder: 'e.g., 15+ years, 500+ clients served' },
      { key: 'team', label: 'Team Members', placeholder: 'e.g., 5 senior consultants, 10 associates' },
      { key: 'phone', label: 'Phone', placeholder: 'Contact number' },
      { key: 'email', label: 'Email', placeholder: 'contact@business.com', type: 'email' },
      { key: 'address', label: 'Address', placeholder: 'Office address' },
      { key: 'hours', label: 'Business Hours', placeholder: 'e.g., Mon-Fri: 9 AM - 6 PM' },
    ],
    uploads: [
      { key: 'officePhotos', label: 'Office / Portfolio Photos', desc: 'Office, team, projects', icon: '💼' },
    ],
    toggles: [
      { key: 'freeConsult', label: 'Free Consultation' },
      { key: 'onlineService', label: 'Online Service Available' },
    ],
  },
  automotive: {
    title: 'Automotive Details', icon: '🚗',
    fields: [
      { key: 'description', label: 'Business Description', placeholder: 'Describe your automotive business and services...', multiline: true },
      { key: 'tagline', label: 'Tagline', placeholder: 'e.g., Your trusted auto care partner' },
      { key: 'services', label: 'Services Offered', placeholder: 'e.g., Oil Change, Brake Repair, AC Service', multiline: true },
      { key: 'brandsServiced', label: 'Brands Serviced', placeholder: 'e.g., All brands, Maruti, Hyundai, Honda' },
      { key: 'phone', label: 'Phone', placeholder: 'Contact number' },
      { key: 'email', label: 'Email', placeholder: 'garage@email.com', type: 'email' },
      { key: 'address', label: 'Address', placeholder: 'Workshop address' },
      { key: 'hours', label: 'Business Hours', placeholder: 'e.g., Mon-Sat: 8 AM - 7 PM' },
    ],
    uploads: [
      { key: 'workshopPhotos', label: 'Workshop Photos', desc: 'Service area, equipment, team', icon: '🚗' },
    ],
    toggles: [
      { key: 'pickupDrop', label: 'Pickup & Drop Service' },
      { key: 'emergency', label: 'Roadside Assistance' },
    ],
  },
  retail: {
    title: 'Retail Shop Details', icon: '🛍️',
    fields: [
      { key: 'description', label: 'Shop Description', placeholder: 'Describe your shop, product range, and uniqueness...', multiline: true },
      { key: 'tagline', label: 'Tagline', placeholder: 'e.g., Quality products at best prices' },
      { key: 'productCategories', label: 'Product Categories', placeholder: 'e.g., Electronics, Clothing, Groceries' },
      { key: 'brands', label: 'Brands Available', placeholder: 'e.g., Samsung, Nike, Local artisan products' },
      { key: 'phone', label: 'Phone', placeholder: 'Contact number' },
      { key: 'email', label: 'Email', placeholder: 'shop@email.com', type: 'email' },
      { key: 'address', label: 'Address', placeholder: 'Full shop address' },
      { key: 'hours', label: 'Shop Hours', placeholder: 'e.g., Mon-Sat: 10 AM - 9 PM' },
    ],
    uploads: [
      { key: 'productPhotos', label: 'Product Photos', desc: 'Best-selling products, new arrivals', icon: '📦' },
      { key: 'storePhotos', label: 'Store Photos', desc: 'Store interior, display, exterior', icon: '🏪' },
    ],
    toggles: [
      { key: 'delivery', label: 'Home Delivery' },
      { key: 'onlineOrdering', label: 'Online Ordering' },
      { key: 'returns', label: 'Easy Returns' },
    ],
  },
};

/* ─── Category-specific domain recommendations ─── */
const categoryDomainInfo = {
  restaurant: {
    recommended: '.com', reason: 'Most food businesses use .com — builds instant trust with online customers.',
    options: [{ ext: '.com', price: 899, note: 'Most popular' }, { ext: '.in', price: 499, note: 'Great for local eateries' }, { ext: '.co.in', price: 349, note: 'Budget-friendly' }, { ext: '.shop', price: 299, note: 'Food delivery focus' }],
  },
  hotel: {
    recommended: '.com', reason: 'Hotels get international bookings — .com gives global credibility.',
    options: [{ ext: '.com', price: 899, note: 'Best for international guests' }, { ext: '.in', price: 499, note: 'Domestic tourism' }, { ext: '.co.in', price: 349, note: 'Cost-effective' }, { ext: '.hotel', price: 1299, note: 'Premium hotel domain' }],
  },
  salon: {
    recommended: '.in', reason: 'Local salons benefit from .in — shows you\'re proudly local.',
    options: [{ ext: '.in', price: 499, note: 'Best for local salons' }, { ext: '.com', price: 899, note: 'Plan to expand' }, { ext: '.co.in', price: 349, note: 'Budget-friendly' }, { ext: '.beauty', price: 999, note: 'Premium beauty' }],
  },
  gym: {
    recommended: '.com', reason: 'Fitness brands grow fast — .com gives room to scale.',
    options: [{ ext: '.com', price: 899, note: 'Best for fitness' }, { ext: '.in', price: 499, note: 'Great for local' }, { ext: '.fitness', price: 999, note: 'Fitness-specific' }, { ext: '.co.in', price: 349, note: 'Cost-effective' }],
  },
  medical: {
    recommended: '.com', reason: 'Patients trust .com for healthcare — signals professionalism.',
    options: [{ ext: '.com', price: 899, note: 'Most trusted' }, { ext: '.in', price: 499, note: 'For local clinics' }, { ext: '.health', price: 1499, note: 'Premium health' }, { ext: '.org', price: 799, note: 'Non-profit clinics' }],
  },
  education: {
    recommended: '.org', reason: 'Educational institutions use .org — signals credibility & academic trust.',
    options: [{ ext: '.org', price: 799, note: 'Best for education' }, { ext: '.com', price: 899, note: 'Commercial training' }, { ext: '.in', price: 499, note: 'Local institutes' }, { ext: '.edu.in', price: 149, note: 'Official education' }],
  },
  professional: {
    recommended: '.com', reason: 'Professional services need .com for business credibility.',
    options: [{ ext: '.com', price: 899, note: 'Industry standard' }, { ext: '.in', price: 499, note: 'India focus' }, { ext: '.co', price: 1499, note: 'Modern business' }, { ext: '.io', price: 2499, note: 'Tech consultants' }],
  },
  automotive: {
    recommended: '.com', reason: 'Auto businesses using .com get more search visibility.',
    options: [{ ext: '.com', price: 899, note: 'Best for auto' }, { ext: '.in', price: 499, note: 'Local workshops' }, { ext: '.co.in', price: 349, note: 'Budget-friendly' }, { ext: '.auto', price: 899, note: 'Auto-specific' }],
  },
  retail: {
    recommended: '.shop', reason: 'Retail businesses benefit from .shop — tells customers you sell online.',
    options: [{ ext: '.shop', price: 299, note: 'Best for retail' }, { ext: '.com', price: 899, note: 'Universal trust' }, { ext: '.in', price: 499, note: 'Local shops' }, { ext: '.store', price: 199, note: 'Budget e-commerce' }],
  },
};

/* ─── Social platforms with video tutorials ─── */
const socialPlatforms = [
  { id: 'instagram', name: 'Instagram', icon: '📸', color: 'bg-gradient-to-r from-purple-50 to-pink-50 border-pink-200', textColor: 'text-pink-700', videoId: 'sE0sdEnMRiE', videoTitle: 'How to Create Instagram Business Account' },
  { id: 'facebook', name: 'Facebook', icon: '📘', color: 'bg-blue-50 border-blue-200', textColor: 'text-blue-700', videoId: 'EYgKPSC32Po', videoTitle: 'How to Create Facebook Business Page' },
  { id: 'x', name: 'X (Twitter)', icon: '🐦', color: 'bg-gray-50 border-gray-300', textColor: 'text-gray-800', videoId: 'PD3bIZc_9lE', videoTitle: 'How to Create X (Twitter) Account' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: 'bg-sky-50 border-sky-200', textColor: 'text-sky-700', videoId: 'ZgPgI0YLMEw', videoTitle: 'How to Create LinkedIn Business Page' },
  { id: 'youtube', name: 'YouTube', icon: '🎬', color: 'bg-red-50 border-red-200', textColor: 'text-red-700', videoId: 'dx2LzTkd_6w', videoTitle: 'How to Create YouTube Channel' },
  { id: 'whatsapp', name: 'WhatsApp Business', icon: '💬', color: 'bg-green-50 border-green-200', textColor: 'text-green-700', videoId: null, videoTitle: null },
];

/* ─── AI Build animation steps ─── */
const aiBuildSteps = [
  { text: 'Analyzing your business data...', icon: '🔍' },
  { text: 'Selecting brand colors & fonts...', icon: '🎨' },
  { text: 'Building navigation bar...', icon: '🏗️' },
  { text: 'Creating hero section...', icon: '✨' },
  { text: 'Adding services showcase...', icon: '📋' },
  { text: 'Building photo gallery...', icon: '📸' },
  { text: 'Setting up contact section...', icon: '📧' },
  { text: 'Optimizing for mobile...', icon: '📱' },
  { text: 'Final touches & SEO setup...', icon: '🚀' },
];

/* ══════════════════════════════════════════════════════════
   VOICE INPUT COMPONENT
   ══════════════════════════════════════════════════════════ */
const VoiceInput = ({ value, onChange, placeholder, multiline, type, lang = 'en' }) => {
  const [listening, setListening] = useState(false);
  const recRef = useRef(null);

  const toggle = () => {
    if (listening) { recRef.current?.stop(); setListening(false); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = sttLangMap[lang] || 'en-IN';
    rec.onresult = (e) => {
      const t = e.results[0][0].transcript;
      onChange(value ? value + ' ' + t : t);
      setListening(false);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  };

  const Tag = multiline ? 'textarea' : 'input';
  return (
    <div className="relative">
      <Tag value={value} onChange={e => onChange(e.target.value)} type={!multiline ? (type || 'text') : undefined}
        placeholder={placeholder} rows={multiline ? 3 : undefined}
        className={`w-full px-3 py-2 pr-10 bg-navy-50 border border-navy-100 rounded-lg text-sm text-navy-800 placeholder-navy-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 ${multiline ? 'resize-none' : ''}`} />
      <button type="button" onClick={toggle}
        className={`absolute right-2 ${multiline ? 'top-2' : 'top-1/2 -translate-y-1/2'} p-1.5 rounded-lg transition-all ${
          listening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-navy-100 text-navy-400 hover:bg-teal-100 hover:text-teal-600'
        }`}>
        {listening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   FILE UPLOAD AREA (prototype - visual only)
   ══════════════════════════════════════════════════════════ */
const FileUploadArea = ({ label, desc, icon, uploaded, onUpload }) => (
  <div onClick={onUpload}
    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
      uploaded ? 'border-teal-400 bg-teal-50/50' : 'border-navy-200 hover:border-teal-400 hover:bg-teal-50/30'
    }`}>
    {uploaded ? (
      <div className="flex items-center justify-center gap-2">
        <Check className="w-5 h-5 text-teal-600" />
        <p className="text-xs font-semibold text-teal-700">Files uploaded successfully</p>
      </div>
    ) : (
      <>
        <span className="text-2xl block mb-1">{icon}</span>
        <p className="text-xs font-semibold text-navy-700">{label}</p>
        <p className="text-[10px] text-navy-400 mt-0.5">{desc}</p>
        <div className="flex items-center justify-center gap-1 mt-2 text-[10px] text-teal-600 font-semibold">
          <Upload className="w-3 h-3" /> Click to upload
        </div>
      </>
    )}
  </div>
);

/* ══════════════════════════════════════════════════════════
   TEMPLATE AUTO-PREVIEW POPUP
   ══════════════════════════════════════════════════════════ */
const TemplateAutoPreviewPopup = ({ open, onConfirm, template, categoryName }) => {
  if (!open || !template) return null;
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy-950/50 backdrop-blur-sm p-4">
        <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }}
          className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">

          {/* Header */}
          <div className="p-5 border-b border-navy-100 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: template.color + '20' }}>
              <Sparkles className="w-7 h-7" style={{ color: template.color }} />
            </motion.div>
            <h2 className="text-lg font-bold text-navy-900">Perfect Match Found!</h2>
            <p className="text-xs text-navy-400 mt-1">
              Based on your <span className="font-semibold text-navy-600">{categoryName}</span> business, we picked the best template
            </p>
          </div>

          {/* Template Preview */}
          <div className="flex-1 overflow-y-auto p-5">
            <div className="bg-navy-50 rounded-xl overflow-hidden border border-navy-100">
              <div className="h-8 bg-white border-b border-navy-100 flex items-center px-3 gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <div className="flex-1 mx-8 h-4 bg-navy-50 rounded text-[9px] text-navy-400 flex items-center justify-center">yourbusiness.com</div>
              </div>
              <div className="p-6">
                <div className="rounded-xl p-8 mb-4 text-center" style={{ backgroundColor: template.color + '15' }}>
                  <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: template.color }}>
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-navy-900 mb-1">Your Business Name</h3>
                  <p className="text-xs text-navy-500">Welcome to our {categoryName?.toLowerCase()} business</p>
                  <button className="mt-3 px-4 py-1.5 text-xs font-semibold text-white rounded-lg" style={{ backgroundColor: template.color }}>Contact Us</button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {['Our Services', 'About Us', 'Contact'].map((s, i) => (
                    <div key={i} className="bg-white rounded-lg border border-navy-100 p-4 text-center">
                      <div className="w-8 h-8 rounded-lg mx-auto mb-2" style={{ backgroundColor: template.color + '20' }} />
                      <p className="text-xs font-semibold text-navy-700">{s}</p>
                      <p className="text-[10px] text-navy-400 mt-1">Sample content</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Template Info */}
            <div className="mt-4 flex items-center gap-3 p-3 rounded-lg border border-navy-100 bg-white">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: template.color }}>
                <Layout className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-navy-800">{template.name}</p>
                <p className="text-[11px] text-navy-400">{template.desc} &middot; {template.category}</p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-teal-100 text-teal-700">AUTO-SELECTED</span>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-navy-100 bg-navy-50/50">
            <button onClick={onConfirm}
              className="w-full py-3 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors flex items-center justify-center gap-2">
              Looks Great! Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ══════════════════════════════════════════════════════════
   CATEGORY-SPECIFIC BUSINESS INFO POPUP
   ══════════════════════════════════════════════════════════ */
const CategoryBusinessInfoPopup = ({ open, onClose, onSave, businessData, category, lang }) => {
  const config = categoryFormConfigs[category] || categoryFormConfigs.professional;
  const initFields = {};
  config.fields.forEach(f => {
    if (f.key === 'address') initFields[f.key] = businessData?.businessAddress || '';
    else if (f.key === 'phone') initFields[f.key] = businessData?.phone || '';
    else if (f.key === 'description') initFields[f.key] = businessData?.businessName ? `Welcome to ${businessData.businessName}` : '';
    else initFields[f.key] = '';
  });
  const initToggles = {};
  (config.toggles || []).forEach(t => { initToggles[t.key] = false; });

  const [fields, setFields] = useState(initFields);
  const [toggles, setToggles] = useState(initToggles);
  const [uploads, setUploads] = useState({});

  if (!open) return null;

  const updateField = (key, val) => setFields(prev => ({ ...prev, [key]: val }));

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy-950/50 backdrop-blur-sm p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
          className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>

          <div className="flex items-center justify-between p-5 border-b border-navy-100">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{config.icon}</span>
              <div>
                <h2 className="text-base font-bold text-navy-900">{config.title}</h2>
                <p className="text-xs text-navy-400 mt-0.5">This will appear on your website &middot; Use 🎤 to speak</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-navy-50 rounded-lg"><X className="w-5 h-5 text-navy-400" /></button>
          </div>

          <form onSubmit={e => { e.preventDefault(); onSave({ fields, toggles, uploads }); }}
            className="flex-1 overflow-y-auto p-5 space-y-3">

            {/* Dynamic fields with voice input */}
            {config.fields.map(f => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-navy-700 mb-1">{f.label}</label>
                <VoiceInput value={fields[f.key] || ''} onChange={v => updateField(f.key, v)}
                  placeholder={f.placeholder} multiline={f.multiline} type={f.type} lang={lang} />
              </div>
            ))}

            {/* File uploads */}
            {config.uploads && config.uploads.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-2 mt-2">📷 Photos & Media</label>
                <div className={`grid gap-3 ${config.uploads.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  {config.uploads.map(u => (
                    <FileUploadArea key={u.key} label={u.label} desc={u.desc} icon={u.icon}
                      uploaded={uploads[u.key]}
                      onUpload={() => setUploads(prev => ({ ...prev, [u.key]: true }))} />
                  ))}
                </div>
              </div>
            )}

            {/* Toggles */}
            {config.toggles && config.toggles.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-2 mt-2">Features & Services</label>
                <div className="flex flex-wrap gap-2">
                  {config.toggles.map(t => (
                    <button key={t.key} type="button" onClick={() => setToggles(prev => ({ ...prev, [t.key]: !prev[t.key] }))}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        toggles[t.key] ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-navy-600 border-navy-200 hover:border-teal-400'
                      }`}>
                      {toggles[t.key] && <Check className="w-3 h-3 inline mr-1" />}{t.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Logo upload */}
            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1">Logo Upload</label>
              <FileUploadArea label="Business Logo" desc="Upload your brand logo (optional)" icon="🎨"
                uploaded={uploads.logo} onUpload={() => setUploads(prev => ({ ...prev, logo: true }))} />
            </div>

            <button type="submit"
              className="w-full py-2.5 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 transition-colors mt-4 flex items-center justify-center gap-2">
              Save & Build Website <Sparkles className="w-3.5 h-3.5" />
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ══════════════════════════════════════════════════════════
   AI BUILDING PREVIEW POPUP
   ══════════════════════════════════════════════════════════ */
const AIBuildingPreviewPopup = ({ open, onComplete, template, businessName }) => {
  const [phase, setPhase] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [previewSections, setPreviewSections] = useState(0);

  useEffect(() => {
    if (!open) { setPhase(0); setShowPreview(false); setPreviewSections(0); return; }
    if (phase < aiBuildSteps.length) {
      const t = setTimeout(() => setPhase(p => p + 1), 1000);
      return () => clearTimeout(t);
    } else if (!showPreview) {
      const t = setTimeout(() => setShowPreview(true), 400);
      return () => clearTimeout(t);
    }
  }, [open, phase]);

  useEffect(() => {
    if (!showPreview) return;
    if (previewSections < 5) {
      const t = setTimeout(() => setPreviewSections(p => p + 1), 600);
      return () => clearTimeout(t);
    }
  }, [showPreview, previewSections]);

  if (!open) return null;
  const color = template?.color || '#0d886f';
  const name = businessName || 'Your Business';

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy-950/60 backdrop-blur-md p-4">
        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
          className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">

          <div className="p-5 border-b border-navy-100 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-teal-600 animate-pulse" />
              <h2 className="text-lg font-bold text-navy-900">
                {showPreview ? 'Your Website is Ready!' : 'AI is Building Your Website...'}
              </h2>
              <Sparkles className="w-5 h-5 text-teal-600 animate-pulse" />
            </div>
            <p className="text-xs text-navy-400">
              {showPreview ? 'Preview your brand new website below' : 'Sit back while we create something amazing'}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {!showPreview ? (
              /* Build Steps Animation */
              <div className="max-w-md mx-auto space-y-2.5">
                {aiBuildSteps.map((step, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: i <= phase ? 1 : 0.25, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 py-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      i < phase ? 'bg-teal-100' : i === phase ? 'bg-teal-600' : 'bg-navy-100'
                    }`}>
                      {i < phase ? <Check className="w-4 h-4 text-teal-600" /> : i === phase ? <span className="onboard-spinner-sm-white" /> : <span className="text-sm">{step.icon}</span>}
                    </div>
                    <p className={`text-sm ${i <= phase ? 'text-navy-700 font-semibold' : 'text-navy-400'}`}>{step.text}</p>
                  </motion.div>
                ))}
                <div className="mt-4 bg-navy-50 rounded-lg p-3">
                  <div className="h-1.5 bg-navy-200 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-teal-600 rounded-full" initial={{ width: '0%' }}
                      animate={{ width: `${(phase / aiBuildSteps.length) * 100}%` }} transition={{ duration: 0.5 }} />
                  </div>
                  <p className="text-[10px] text-navy-400 mt-1.5 text-center">{Math.round((phase / aiBuildSteps.length) * 100)}% complete</p>
                </div>
              </div>
            ) : (
              /* Website Preview */
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="bg-navy-50 rounded-xl overflow-hidden border border-navy-100">
                  {/* Browser chrome */}
                  <div className="h-9 bg-white border-b border-navy-100 flex items-center px-3 gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    <div className="flex-1 mx-6 h-5 bg-navy-50 rounded flex items-center justify-center text-[10px] text-navy-400">
                      🔒 {name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com
                    </div>
                  </div>

                  {/* Navbar */}
                  {previewSections >= 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="flex items-center justify-between px-6 py-3 bg-white border-b border-navy-100">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: color }}>
                          <Globe className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-xs font-bold text-navy-800">{name}</span>
                      </div>
                      <div className="flex gap-4 text-[10px] text-navy-500 font-medium">
                        <span>Home</span><span>Services</span><span>About</span><span>Contact</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Hero */}
                  {previewSections >= 1 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="p-8 text-center" style={{ backgroundColor: color + '10' }}>
                      <h3 className="text-xl font-bold text-navy-900 mb-2">{name}</h3>
                      <p className="text-xs text-navy-500 max-w-xs mx-auto mb-4">Experience the best services tailored just for you</p>
                      <button className="px-5 py-2 text-xs font-bold text-white rounded-lg" style={{ backgroundColor: color }}>Get Started</button>
                    </motion.div>
                  )}

                  {/* Services */}
                  {previewSections >= 2 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="p-6">
                      <h4 className="text-sm font-bold text-navy-800 mb-3 text-center">Our Services</h4>
                      <div className="grid grid-cols-3 gap-3">
                        {['Service 1', 'Service 2', 'Service 3'].map((s, i) => (
                          <div key={i} className="bg-white rounded-lg border border-navy-100 p-3 text-center">
                            <div className="w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: color + '20' }}>
                              <Star className="w-4 h-4" style={{ color }} />
                            </div>
                            <p className="text-[10px] font-semibold text-navy-700">{s}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Gallery */}
                  {previewSections >= 3 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="px-6 pb-4">
                      <h4 className="text-sm font-bold text-navy-800 mb-3 text-center">Gallery</h4>
                      <div className="grid grid-cols-4 gap-2">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="aspect-square bg-navy-200 rounded-lg flex items-center justify-center">
                            <Image className="w-4 h-4 text-navy-400" />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Contact */}
                  {previewSections >= 4 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="px-6 pb-3">
                      <div className="rounded-lg p-4 text-center" style={{ backgroundColor: color + '10' }}>
                        <h4 className="text-sm font-bold text-navy-800 mb-1">Get in Touch</h4>
                        <p className="text-[10px] text-navy-500">We'd love to hear from you</p>
                        <div className="flex justify-center gap-4 mt-2 text-[10px] text-navy-500">
                          <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> Call Us</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Visit Us</span>
                          <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Website</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Footer */}
                  {previewSections >= 5 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="px-6 py-3 text-center border-t border-navy-100">
                      <p className="text-[9px] text-navy-400">© 2026 {name}. Powered by LeadFlexUp</p>
                    </motion.div>
                  )}
                </div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                  className="mt-4 bg-teal-50 border border-teal-200 rounded-lg p-3 text-center">
                  <p className="text-sm font-bold text-teal-800">✨ Your website looks amazing!</p>
                  <p className="text-[10px] text-teal-600 mt-0.5">Now let's get you a domain and publish it</p>
                </motion.div>

                <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                  onClick={onComplete}
                  className="w-full mt-4 py-3 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors flex items-center justify-center gap-2">
                  Publish My Website <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ══════════════════════════════════════════════════════════
   DOMAIN PURCHASE POPUP (enhanced)
   ══════════════════════════════════════════════════════════ */
const DomainPurchasePopup = ({ open, onClose, onPurchase, businessName, category }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const slug = (businessName || 'mybusiness').toLowerCase().replace(/[^a-z0-9]/g, '');
  const domainInfo = categoryDomainInfo[category] || categoryDomainInfo.professional;

  const suggestedDomains = domainInfo.options.map(o => ({
    domain: `${slug}${o.ext}`,
    price: o.price,
    note: o.note,
    recommended: o.ext === domainInfo.recommended,
  }));

  const [selectedDomain, setSelectedDomain] = useState(suggestedDomains.find(d => d.recommended)?.domain || suggestedDomains[0].domain);
  if (!open) return null;

  const handlePurchase = async () => {
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 2500));
    setIsProcessing(false);
    setPurchased(true);
    setTimeout(() => onPurchase(selectedDomain), 1500);
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy-950/50 backdrop-blur-sm p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
          className="bg-white rounded-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>

          <div className="p-5 border-b border-navy-100">
            <h2 className="text-base font-bold text-navy-900">Publish Your Website</h2>
            <p className="text-xs text-navy-400 mt-0.5">Choose the perfect domain for your business</p>
          </div>

          <div className="p-5">
            {purchased ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                <div className="w-14 h-14 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm font-bold text-navy-900 mb-1">Domain Purchased & Website Published!</p>
                <p className="text-xs text-navy-400">{selectedDomain} is now linked to your profile</p>
              </motion.div>
            ) : (
              <>
                {/* Recommendation banner */}
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 mb-4">
                  <p className="text-xs text-teal-800 font-semibold">💡 Recommended for your business</p>
                  <p className="text-[10px] text-teal-600 mt-1">{domainInfo.reason}</p>
                </div>

                {/* Domain options */}
                <div className="space-y-2 mb-4">
                  {suggestedDomains.map(d => (
                    <button key={d.domain} onClick={() => setSelectedDomain(d.domain)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all text-left ${
                        selectedDomain === d.domain ? 'border-teal-500 bg-teal-50/50' : 'border-navy-100 hover:border-navy-200'
                      }`}>
                      <div className="flex items-center gap-2">
                        {selectedDomain === d.domain && <Check className="w-4 h-4 text-teal-600" />}
                        <div>
                          <p className="text-sm font-semibold text-navy-800">{d.domain}</p>
                          <p className="text-[9px] text-navy-400">{d.note}</p>
                          {d.recommended && <span className="text-[9px] font-bold text-teal-600">RECOMMENDED</span>}
                        </div>
                      </div>
                      <p className="text-sm font-bold text-navy-900">₹{d.price}<span className="text-[10px] text-navy-400 font-normal">/yr</span></p>
                    </button>
                  ))}
                </div>

                <p className="text-[10px] text-navy-400 mb-3">
                  Domain will be purchased and linked to your LeadFlexUp profile automatically. Website goes live within minutes!
                </p>

                <div className="flex gap-2">
                  <button onClick={onClose}
                    className="px-4 py-2.5 border border-navy-200 text-navy-600 text-xs font-semibold rounded-lg hover:bg-navy-50 transition-colors">
                    Cancel
                  </button>
                  <button onClick={handlePurchase} disabled={isProcessing}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg text-white transition-colors ${
                      isProcessing ? 'bg-navy-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'
                    }`}>
                    {isProcessing ? <><span className="onboard-spinner" /> Processing...</> : <><ShoppingCart className="w-3.5 h-3.5" /> Purchase & Publish — ₹{suggestedDomains.find(d => d.domain === selectedDomain)?.price}</>}
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ══════════════════════════════════════════════════════════
   SOCIAL MEDIA POPUP (redesigned)
   ══════════════════════════════════════════════════════════ */
const SocialMediaPopup = ({ open, onClose, onDone }) => {
  // Phase: 'mark' = mark which you have, 'action' = connect/create
  const [phase, setPhase] = useState('mark');
  const [ownership, setOwnership] = useState({}); // platformId → true (has) / false (doesn't have)
  const [statuses, setStatuses] = useState({}); // platformId → 'connected' | 'team_help' | 'creating'
  const [connecting, setConnecting] = useState(null);
  const [expandedVideo, setExpandedVideo] = useState(null);
  if (!open) return null;

  const markCount = Object.keys(ownership).length;
  const allMarked = markCount === socialPlatforms.length;
  const hasAccounts = socialPlatforms.filter(p => ownership[p.id] === true);
  const noAccounts = socialPlatforms.filter(p => ownership[p.id] === false);
  const allResolved = socialPlatforms.every(p => {
    if (ownership[p.id] === true) return statuses[p.id] === 'connected';
    if (ownership[p.id] === false) return statuses[p.id] === 'team_help' || statuses[p.id] === 'creating';
    return false;
  });

  const handleConnect = async (pid) => {
    setConnecting(pid);
    await new Promise(r => setTimeout(r, 1500));
    setStatuses(prev => ({ ...prev, [pid]: 'connected' }));
    setConnecting(null);
  };

  const handleTeamHelp = (pid) => setStatuses(prev => ({ ...prev, [pid]: 'team_help' }));
  const handleCreateSelf = (pid) => {
    setStatuses(prev => ({ ...prev, [pid]: 'creating' }));
    setExpandedVideo(pid);
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy-950/50 backdrop-blur-sm p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
          className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>

          <div className="flex items-center justify-between p-5 border-b border-navy-100">
            <div>
              <h2 className="text-base font-bold text-navy-900">
                {phase === 'mark' ? 'Your Social Media Accounts' : 'Set Up Your Accounts'}
              </h2>
              <p className="text-xs text-navy-400 mt-0.5">
                {phase === 'mark' ? 'Mark which accounts you already have' : 'Connect existing or create new accounts'}
              </p>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-navy-50 rounded-lg"><X className="w-5 h-5 text-navy-400" /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {phase === 'mark' ? (
              /* ── PHASE 1: Mark ownership ── */
              <div className="space-y-2">
                <p className="text-xs text-navy-600 font-medium mb-3">
                  Do you have accounts on these platforms? Toggle the ones you already have.
                </p>
                {socialPlatforms.map(p => (
                  <div key={p.id} className={`flex items-center justify-between p-3 rounded-xl border ${p.color}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{p.icon}</span>
                      <p className={`text-sm font-bold ${p.textColor}`}>{p.name}</p>
                    </div>
                    <button onClick={() => setOwnership(prev => {
                      const n = { ...prev };
                      if (n[p.id] === true) { n[p.id] = false; }
                      else if (n[p.id] === false) { delete n[p.id]; }
                      else { n[p.id] = true; }
                      return n;
                    })}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                        ownership[p.id] === true ? 'bg-teal-600 text-white' :
                        ownership[p.id] === false ? 'bg-red-100 text-red-600 border border-red-200' :
                        'bg-white text-navy-500 border border-navy-200'
                      }`}>
                      {ownership[p.id] === true ? '✓ I Have This' : ownership[p.id] === false ? '✗ Don\'t Have' : 'Tap to Mark'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              /* ── PHASE 2: Connect / Create ── */
              <div className="space-y-4">
                {/* Accounts user HAS */}
                {hasAccounts.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-navy-700 uppercase tracking-wider mb-2">Connect Your Accounts</h3>
                    <div className="space-y-2">
                      {hasAccounts.map(p => (
                        <div key={p.id} className={`rounded-xl border p-3 ${p.color}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{p.icon}</span>
                              <div>
                                <p className={`text-sm font-bold ${p.textColor}`}>{p.name}</p>
                                {statuses[p.id] === 'connected' && <p className="text-[10px] font-semibold text-teal-600">✓ Connected successfully</p>}
                              </div>
                            </div>
                            {statuses[p.id] !== 'connected' && (
                              <button onClick={() => handleConnect(p.id)} disabled={connecting === p.id}
                                className="px-4 py-1.5 bg-navy-700 text-white text-[11px] font-semibold rounded-lg hover:bg-navy-800 transition-colors">
                                {connecting === p.id ? 'Connecting...' : 'Connect'}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Accounts user DOESN'T have */}
                {noAccounts.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-navy-700 uppercase tracking-wider mb-2">Create New Accounts</h3>
                    <div className="space-y-2">
                      {noAccounts.map(p => (
                        <div key={p.id} className={`rounded-xl border p-3 ${p.color}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{p.icon}</span>
                              <div>
                                <p className={`text-sm font-bold ${p.textColor}`}>{p.name}</p>
                                {statuses[p.id] === 'team_help' && (
                                  <p className="text-[10px] font-semibold text-amber-600">📞 Our executive will reach out for setup</p>
                                )}
                                {statuses[p.id] === 'creating' && (
                                  <p className="text-[10px] font-semibold text-blue-600">📝 Pending — added to your TODO list</p>
                                )}
                              </div>
                            </div>
                            {!statuses[p.id] && (
                              <div className="flex gap-1.5">
                                <button onClick={() => handleTeamHelp(p.id)}
                                  className="px-2.5 py-1.5 bg-amber-100 text-amber-700 text-[10px] font-semibold rounded-lg border border-amber-200 hover:bg-amber-200 transition-colors">
                                  Get Team Help
                                </button>
                                <button onClick={() => handleCreateSelf(p.id)}
                                  className="px-2.5 py-1.5 bg-blue-100 text-blue-700 text-[10px] font-semibold rounded-lg border border-blue-200 hover:bg-blue-200 transition-colors">
                                  Create Myself
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Video Tutorial */}
                          {expandedVideo === p.id && p.videoId && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                              className="mt-3 pt-3 border-t border-navy-200/50">
                              <p className="text-[11px] text-navy-600 font-semibold mb-2 flex items-center gap-1">
                                <Play className="w-3 h-3" /> Watch: {p.videoTitle}
                              </p>
                              <div className="aspect-video w-full rounded-lg overflow-hidden bg-navy-100">
                                <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${p.videoId}`}
                                  title={p.videoTitle} frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen />
                              </div>
                              <p className="text-[10px] text-navy-400 mt-2">
                                Once created, come back to your profile to connect it. This task will be in your TODO list.
                              </p>
                            </motion.div>
                          )}
                          {statuses[p.id] === 'creating' && expandedVideo !== p.id && p.videoId && (
                            <button onClick={() => setExpandedVideo(p.id)}
                              className="mt-2 flex items-center gap-1 text-[10px] text-blue-600 font-semibold hover:text-blue-700">
                              <Video className="w-3 h-3" /> Watch Tutorial
                            </button>
                          )}
                          {/* WhatsApp - no video, just guide */}
                          {!p.videoId && statuses[p.id] === 'creating' && (
                            <div className="mt-2 pt-2 border-t border-navy-200/50">
                              <p className="text-[10px] text-navy-500">
                                Download WhatsApp Business from Play Store / App Store and set up with your business phone number.
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-navy-100">
            {phase === 'mark' ? (
              <button onClick={() => allMarked && setPhase('action')} disabled={!allMarked}
                className={`w-full py-2.5 text-xs font-semibold rounded-lg transition-colors ${
                  allMarked ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-navy-200 text-navy-400 cursor-not-allowed'
                }`}>
                {allMarked ? 'Continue' : `Mark all platforms (${markCount}/${socialPlatforms.length})`}
              </button>
            ) : (
              <button onClick={() => onDone(statuses)} disabled={!allResolved}
                className={`w-full py-2.5 text-xs font-semibold rounded-lg transition-colors ${
                  allResolved ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-navy-200 text-navy-400 cursor-not-allowed'
                }`}>
                {allResolved ? 'Continue' : 'Address all platforms to continue'}
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ══════════════════════════════════════════════════════════
   GOOGLE BUSINESS PROFILE POPUP (guide + video)
   ══════════════════════════════════════════════════════════ */
const GoogleProfilePopup = ({ open, onClose, onDone, businessData }) => {
  const [checkedSteps, setCheckedSteps] = useState({});
  if (!open) return null;

  const bName = businessData?.businessName || 'Your Business';

  const setupSteps = [
    { id: 1, text: 'Go to business.google.com and sign in' },
    { id: 2, text: 'Enter your business name and category' },
    { id: 3, text: 'Add your business location on the map' },
    { id: 4, text: 'Add contact details (phone, website)' },
    { id: 5, text: 'Upload business photos and logo' },
    { id: 6, text: 'Set your business hours' },
    { id: 7, text: 'Choose verification method' },
    { id: 8, text: 'Complete verification and publish' },
  ];

  const allChecked = setupSteps.every(s => checkedSteps[s.id]);

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy-950/50 backdrop-blur-sm p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
          className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>

          <div className="flex items-center justify-between p-5 border-b border-navy-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-navy-900">Google Business Profile Setup</h2>
                <p className="text-xs text-navy-400 mt-0.5">Complete guide to get found on Google</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-navy-50 rounded-lg"><X className="w-5 h-5 text-navy-400" /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Video Tutorial */}
            <div>
              <p className="text-xs font-bold text-navy-700 mb-2 flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-red-500" /> Watch Complete Setup Guide
              </p>
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-navy-100 border border-navy-200">
                <iframe className="w-full h-full"
                  src="https://www.youtube.com/embed/KPfjzL9oPiE"
                  title="Google Business Profile Setup Guide" frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen />
              </div>
            </div>

            {/* Step-by-step checklist */}
            <div>
              <p className="text-xs font-bold text-navy-700 mb-2">Step-by-Step Checklist</p>
              <div className="space-y-1.5">
                {setupSteps.map(s => (
                  <button key={s.id} onClick={() => setCheckedSteps(prev => ({ ...prev, [s.id]: !prev[s.id] }))}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg border text-left transition-all ${
                      checkedSteps[s.id] ? 'bg-teal-50 border-teal-200' : 'bg-white border-navy-100 hover:border-navy-200'
                    }`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      checkedSteps[s.id] ? 'bg-teal-600' : 'bg-navy-100'
                    }`}>
                      {checkedSteps[s.id] ? <Check className="w-3.5 h-3.5 text-white" /> : <span className="text-[10px] font-bold text-navy-400">{s.id}</span>}
                    </div>
                    <p className={`text-xs ${checkedSteps[s.id] ? 'text-teal-700 font-semibold line-through' : 'text-navy-700'}`}>{s.text}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800 font-semibold">💡 Pro Tip</p>
              <p className="text-[10px] text-blue-600 mt-1">
                Businesses with complete Google profiles get 5x more views. Fill in all details, add 10+ photos,
                and respond to reviews regularly for maximum visibility in local search.
              </p>
            </div>

            {/* Preview of how it will look */}
            <div className="bg-navy-50 rounded-xl border border-navy-100 overflow-hidden">
              <div className="h-24 bg-navy-200 relative flex items-center justify-center">
                <MapPin className="w-8 h-8 text-navy-400" />
                <div className="absolute bottom-2 right-2 bg-white rounded px-2 py-0.5 text-[9px] text-navy-500">Google Maps</div>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-bold text-navy-900">{bName}</h3>
                <div className="flex items-center gap-1 mt-1">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                  <span className="text-[10px] text-navy-400 ml-1">5.0 (New)</span>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-[10px] text-navy-500"><MapPin className="w-3 h-3" /> {businessData?.businessCity || 'Your City'}</div>
                  <div className="flex items-center gap-2 text-[10px] text-navy-500"><Clock className="w-3 h-3" /> Open now</div>
                  <div className="flex items-center gap-2 text-[10px] text-navy-500"><Phone className="w-3 h-3" /> {businessData?.phone || '+91 XXXXX XXXXX'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-navy-100 flex gap-2">
            <button onClick={onClose}
              className="px-4 py-2.5 border border-navy-200 text-navy-600 text-xs font-semibold rounded-lg hover:bg-navy-50 transition-colors">
              I'll Do This Later
            </button>
            <button onClick={onDone} disabled={!allChecked}
              className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-colors ${
                allChecked ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-navy-200 text-navy-400 cursor-not-allowed'
              }`}>
              {allChecked ? 'I\'ve Completed Setup — Continue' : `Complete all steps (${Object.values(checkedSteps).filter(Boolean).length}/${setupSteps.length})`}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ══════════════════════════════════════════════════════════
   MAIN ONBOARDING PAGE
   ══════════════════════════════════════════════════════════ */
export const OnboardingPage = () => {
  const navigate = useNavigate();
  const { currentUser, businessData, language, updateOnboardingTasks } = useApp();

  const category = businessData?.category || 'professional';
  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);

  // Main step state
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [skippedSteps, setSkippedSteps] = useState([]);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [allDone, setAllDone] = useState(false);

  // Website flow state
  const [autoTemplate, setAutoTemplate] = useState(null);
  const [showTemplatePreview, setShowTemplatePreview] = useState(false);
  const [templateConfirmed, setTemplateConfirmed] = useState(false);
  const [showBusinessInfo, setShowBusinessInfo] = useState(false);
  const [businessInfoSaved, setBusinessInfoSaved] = useState(false);
  const [showAiBuild, setShowAiBuild] = useState(false);
  const [aiBuildDone, setAiBuildDone] = useState(false);
  const [showDomain, setShowDomain] = useState(false);
  const [purchasedDomain, setPurchasedDomain] = useState(null);

  // Social state
  const [showSocialPopup, setShowSocialPopup] = useState(false);
  const [socialStatuses, setSocialStatuses] = useState(null);

  // Google state
  const [showGooglePopup, setShowGooglePopup] = useState(false);

  const totalSteps = 3;
  const stepIds = ['website', 'social_media', 'google_business'];
  const stepTitles = ['Build Your Website', 'Connect Social Media', 'Google Business Profile'];
  const stepDescs = [
    'AI will build a professional website for your business.',
    'Connect or create social media accounts to boost visibility.',
    'Set up your Google Business Profile for local search visibility.'
  ];
  const stepIcons = [Globe, Share2, MapPin];
  const stepColors = ['bg-navy-700', 'bg-teal-600', 'bg-blue-600'];

  // On mount: auto-select template based on category
  useEffect(() => {
    const tplId = categoryTemplateMap[category] || 1;
    const tpl = websiteTemplates.find(t => t.id === tplId);
    setAutoTemplate(tpl);
    if (currentStep === 0 && !templateConfirmed) {
      const timer = setTimeout(() => setShowTemplatePreview(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  // Website flow handlers (auto-chain)
  const handleTemplateConfirm = () => {
    setTemplateConfirmed(true);
    setShowTemplatePreview(false);
    setTimeout(() => setShowBusinessInfo(true), 400);
  };

  const handleBusinessInfoSave = (info) => {
    setBusinessInfoSaved(true);
    setShowBusinessInfo(false);
    setTimeout(() => setShowAiBuild(true), 400);
  };

  const handleAiBuildComplete = () => {
    setAiBuildDone(true);
    setShowAiBuild(false);
    setTimeout(() => setShowDomain(true), 400);
  };

  const handleDomainPurchase = (domain) => {
    setPurchasedDomain(domain);
    setShowDomain(false);
    markStepComplete('website');
  };

  const handleSocialDone = (statuses) => {
    setSocialStatuses(statuses);
    setShowSocialPopup(false);
    markStepComplete('social_media');
  };

  const handleGoogleDone = () => {
    setShowGooglePopup(false);
    markStepComplete('google_business');
  };

  const markStepComplete = (stepId) => {
    setCompletedSteps(prev => [...prev, stepId]);
    goNext();
  };

  const handleSkip = () => setShowSkipConfirm(true);
  const confirmSkip = () => {
    setSkippedSteps(prev => [...prev, stepIds[currentStep]]);
    setShowSkipConfirm(false);
    goNext();
  };

  const goNext = () => {
    if (currentStep < totalSteps - 1) setCurrentStep(prev => prev + 1);
    else finishOnboarding();
  };

  const finishOnboarding = () => {
    const tasks = stepIds.map((id, i) => ({
      id, title: stepTitles[i],
      completed: completedSteps.includes(id) || id === stepIds[currentStep],
      skipped: skippedSteps.includes(id),
    }));
    // Add pending social tasks
    if (socialStatuses) {
      socialPlatforms.forEach(p => {
        if (socialStatuses[p.id] === 'creating' || socialStatuses[p.id] === 'team_help') {
          tasks.push({
            id: `social_${p.id}`,
            title: `${socialStatuses[p.id] === 'team_help' ? 'Team setup' : 'Create'}: ${p.name}`,
            completed: false,
            skipped: false,
            pending: true,
            status: socialStatuses[p.id],
          });
        }
      });
    }
    if (typeof updateOnboardingTasks === 'function') updateOnboardingTasks(tasks);
    setAllDone(true);
  };

  // Website sub-step display
  const websiteSubSteps = [
    { key: 'template', label: 'Template Selected', desc: autoTemplate?.name || 'Auto-matched to your category', done: templateConfirmed },
    { key: 'info', label: 'Business Info Added', desc: 'Category-specific details collected', done: businessInfoSaved },
    { key: 'ai', label: 'AI Built Your Website', desc: 'No-code website generation', done: aiBuildDone },
    { key: 'domain', label: 'Website Published', desc: purchasedDomain || 'Domain & hosting setup', done: !!purchasedDomain },
  ];

  const resumeWebsiteFlow = () => {
    if (!templateConfirmed) setShowTemplatePreview(true);
    else if (!businessInfoSaved) setShowBusinessInfo(true);
    else if (!aiBuildDone) setShowAiBuild(true);
    else if (!purchasedDomain) setShowDomain(true);
  };

  /* ─── All Done Screen ─── */
  if (allDone) {
    return (
      <div className="min-h-screen bg-navy-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-24 h-24 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <TrendingUp className="w-12 h-12 text-white" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h1 className="text-2xl font-bold text-navy-900 mb-3">You're All Set!</h1>
            <p className="text-sm text-navy-400 mb-6">Your online presence journey has begun. Head to your dashboard to track your growth.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="bg-white rounded-xl border border-navy-100 p-5 mb-8 text-left">
            <h3 className="text-xs font-bold text-navy-700 uppercase tracking-wider mb-3">Setup Summary</h3>
            <div className="space-y-2.5">
              {stepIds.map((id, i) => {
                const done = completedSteps.includes(id);
                return (
                  <div key={id} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${done ? 'bg-teal-100' : 'bg-amber-100'}`}>
                      {done ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <SkipForward className="w-3 h-3 text-amber-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-navy-800">{stepTitles[i]}</p>
                      <p className="text-[10px] text-navy-400">{done ? 'Completed' : 'Skipped — available in your TODO list'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 px-8 py-3 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors shadow-sm">
            Go to Home <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const StepIcon = stepIcons[currentStep];

  return (
    <div className="min-h-screen bg-navy-50">
      {/* Header */}
      <div className="bg-white border-b border-navy-100">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-navy-700 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-navy-800">LeadFlexUp</span>
          </div>
          <span className="text-xs font-medium text-navy-400">Step {currentStep + 1} of {totalSteps}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-3xl mx-auto px-4 pt-6">
        <div className="flex gap-2 mb-8">
          {stepIds.map((_, i) => (
            <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
              completedSteps.includes(stepIds[i]) || skippedSteps.includes(stepIds[i])
                ? 'bg-teal-500'
                : i === currentStep ? 'bg-teal-300' : 'bg-navy-200'
            }`} />
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-3xl mx-auto px-4">
        <AnimatePresence mode="wait">
          <motion.div key={currentStep}
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35 }}>

            {/* Step Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className={`w-14 h-14 ${stepColors[currentStep]} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <StepIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy-900">{stepTitles[currentStep]}</h2>
                <p className="text-sm text-navy-400 mt-1">{stepDescs[currentStep]}</p>
              </div>
            </div>

            {/* ═══ Step 1: WEBSITE (auto-flow) ═══ */}
            {currentStep === 0 && (
              <>
                <div className="bg-white rounded-xl border border-navy-100 p-5 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-navy-700 uppercase tracking-wider">Auto-Setup Progress</h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-700">
                      {categoryLabel} Template
                    </span>
                  </div>
                  <div className="space-y-2">
                    {websiteSubSteps.map((item, i) => (
                      <div key={item.key}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                          item.done ? 'bg-teal-50 border-teal-200' : 'bg-white border-navy-100'
                        }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                            item.done ? 'bg-teal-600' : 'bg-navy-100'
                          }`}>
                            {item.done ? <Check className="w-4 h-4 text-white" /> : <span className="text-[10px] font-bold text-navy-400">{i + 1}</span>}
                          </div>
                          <div>
                            <p className={`text-sm font-semibold ${item.done ? 'text-teal-800' : 'text-navy-800'}`}>{item.label}</p>
                            <p className="text-[11px] text-navy-400">{item.desc}</p>
                          </div>
                        </div>
                        {item.done && <Check className="w-4 h-4 text-teal-600" />}
                      </div>
                    ))}
                  </div>

                  {/* Resume button if user closed a popup */}
                  {!websiteSubSteps.every(s => s.done) && (
                    <button onClick={resumeWebsiteFlow}
                      className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-navy-700 text-white text-sm font-semibold rounded-xl hover:bg-navy-800 transition-colors">
                      {templateConfirmed ? 'Continue Building' : 'Start Building'} <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {websiteSubSteps.every(s => s.done) ? (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-teal-50 rounded-xl border border-teal-200 p-5 text-center">
                    <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-sm font-bold text-teal-800 mb-1">Website Setup Complete!</p>
                    <p className="text-xs text-teal-600 mb-4">Your website is live at {purchasedDomain}</p>
                    <button onClick={() => markStepComplete('website')}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors">
                      Next Step <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                ) : (
                  <div className="flex items-center gap-3">
                    <p className="flex-1 text-xs text-navy-400">Complete all steps above or skip for now</p>
                    <button onClick={handleSkip}
                      className="flex items-center gap-1.5 px-4 py-2.5 border border-navy-200 text-navy-500 text-sm font-medium rounded-xl hover:bg-navy-50 transition-colors">
                      <SkipForward className="w-4 h-4" /> Skip
                    </button>
                  </div>
                )}
              </>
            )}

            {/* ═══ Step 2: SOCIAL MEDIA (redesigned) ═══ */}
            {currentStep === 1 && (
              <>
                <div className="bg-white rounded-xl border border-navy-100 p-5 mb-6">
                  <h3 className="text-xs font-bold text-navy-700 uppercase tracking-wider mb-4">Social Media Platforms</h3>
                  <p className="text-sm text-navy-500 mb-4">
                    Connect existing accounts or set up new ones. Mark which you have and we'll guide you through the rest.
                  </p>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {socialPlatforms.map(p => (
                      <div key={p.id} className={`flex items-center gap-2 p-2.5 rounded-lg border ${p.color}`}>
                        <span className="text-lg">{p.icon}</span>
                        <p className={`text-[11px] font-semibold ${p.textColor}`}>{p.name}</p>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setShowSocialPopup(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors">
                    Connect Social Media <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <p className="flex-1 text-xs text-navy-400">Social media drives 30% of local business discovery</p>
                  <button onClick={handleSkip}
                    className="flex items-center gap-1.5 px-4 py-2.5 border border-navy-200 text-navy-500 text-sm font-medium rounded-xl hover:bg-navy-50 transition-colors">
                    <SkipForward className="w-4 h-4" /> Skip
                  </button>
                </div>
              </>
            )}

            {/* ═══ Step 3: GOOGLE BUSINESS PROFILE ═══ */}
            {currentStep === 2 && (
              <>
                <div className="bg-white rounded-xl border border-navy-100 p-5 mb-6">
                  <h3 className="text-xs font-bold text-navy-700 uppercase tracking-wider mb-4">Complete Setup Guide</h3>
                  <p className="text-sm text-navy-500 mb-4">
                    Follow our step-by-step guide with video tutorial to set up your Google Business Profile.
                    This helps customers find you on Google Maps and local search.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-xs text-blue-800 font-semibold">📍 Why it matters</p>
                    <p className="text-[10px] text-blue-600 mt-1">
                      Businesses with Google profiles get 5x more views. 46% of all Google searches are looking for local info.
                    </p>
                  </div>
                  <div className="space-y-2 mb-4">
                    {['Watch setup video guide', 'Follow step-by-step checklist', 'Add photos & business hours', 'Verify and publish profile'].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-navy-600">
                        <div className="w-5 h-5 bg-navy-100 rounded-full flex items-center justify-center">
                          <span className="text-[9px] font-bold text-navy-400">{i + 1}</span>
                        </div>
                        {item}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setShowGooglePopup(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors">
                    Open Setup Guide <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <p className="flex-1 text-xs text-navy-400">You can complete this later from your profile</p>
                  <button onClick={handleSkip}
                    className="flex items-center gap-1.5 px-4 py-2.5 border border-navy-200 text-navy-500 text-sm font-medium rounded-xl hover:bg-navy-50 transition-colors">
                    <SkipForward className="w-4 h-4" /> Skip
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ─── POPUPS ─── */}
      <TemplateAutoPreviewPopup open={showTemplatePreview} onConfirm={handleTemplateConfirm}
        template={autoTemplate} categoryName={categoryLabel} />

      <CategoryBusinessInfoPopup open={showBusinessInfo} onClose={() => setShowBusinessInfo(false)}
        onSave={handleBusinessInfoSave} businessData={businessData} category={category} lang={language} />

      <AIBuildingPreviewPopup open={showAiBuild} onComplete={handleAiBuildComplete}
        template={autoTemplate} businessName={businessData?.businessName} />

      <DomainPurchasePopup open={showDomain} onClose={() => setShowDomain(false)}
        onPurchase={handleDomainPurchase} businessName={businessData?.businessName} category={category} />

      <SocialMediaPopup open={showSocialPopup} onClose={() => setShowSocialPopup(false)}
        onDone={handleSocialDone} />

      <GoogleProfilePopup open={showGooglePopup} onClose={() => setShowGooglePopup(false)}
        onDone={handleGoogleDone} businessData={businessData} />

      {/* Skip Confirmation */}
      <AnimatePresence>
        {showSkipConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/40 backdrop-blur-sm p-4"
            onClick={() => setShowSkipConfirm(false)}>
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }}
              className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-navy-900">Skip this step?</h3>
                <button onClick={() => setShowSkipConfirm(false)} className="p-1 hover:bg-navy-50 rounded-lg">
                  <X className="w-4 h-4 text-navy-400" />
                </button>
              </div>
              <p className="text-xs text-navy-500 mb-4">
                This step will be permanently available in your TODO section. You can complete it later from your profile.
              </p>
              <div className="flex gap-2">
                <button onClick={() => setShowSkipConfirm(false)}
                  className="flex-1 px-4 py-2 border border-navy-200 text-navy-600 text-xs font-semibold rounded-lg hover:bg-navy-50 transition-colors">
                  Go Back
                </button>
                <button onClick={confirmSkip}
                  className="flex-1 px-4 py-2 bg-navy-700 text-white text-xs font-semibold rounded-lg hover:bg-navy-800 transition-colors">
                  Skip Anyway
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spinner CSS */}
      <style>{`
        .onboard-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: obspin 0.6s linear infinite;
          display: inline-block;
        }
        .onboard-spinner-sm {
          width: 10px; height: 10px;
          border: 2px solid rgba(13,136,111,0.2);
          border-top-color: #0d886f;
          border-radius: 50%;
          animation: obspin 0.6s linear infinite;
          display: inline-block;
        }
        .onboard-spinner-sm-white {
          width: 10px; height: 10px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: obspin 0.6s linear infinite;
          display: inline-block;
        }
        @keyframes obspin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
