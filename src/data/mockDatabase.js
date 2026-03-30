// Mock Database - Simulating enriched data intelligence

export const businessCategories = [
  { id: 'restaurant', label: { en: 'Restaurant', hi: 'रेस्तरां', ta: 'உணவகம்' } },
  { id: 'retail', label: { en: 'Retail Shop', hi: 'खुदरा दुकान', ta: 'சில்லறை கடை' } },
  { id: 'salon', label: { en: 'Salon & Spa', hi: 'सैलून और स्पा', ta: 'அழகு நிலையம்' } },
  { id: 'gym', label: { en: 'Gym & Fitness', hi: 'जिम और फिटनेस', ta: 'உடற்பயிற்சி' } },
  { id: 'medical', label: { en: 'Medical Clinic', hi: 'चिकित्सा क्लिनिक', ta: 'மருத்துவ நிலையம்' } },
  { id: 'education', label: { en: 'Education & Training', hi: 'शिक्षा और प्रशिक्षण', ta: 'கல்வி' } },
  { id: 'professional', label: { en: 'Professional Services', hi: 'व्यावसायिक सेवाएं', ta: 'தொழில்முறை சேவைகள்' } },
  { id: 'automotive', label: { en: 'Automotive', hi: 'ऑटोमोटिव', ta: 'வாகனம்' } }
];

export const subscriptionPlans = [
  {
    id: 'starter',
    name: { en: 'Starter Growth', hi: 'स्टार्टर ग्रोथ', ta: 'தொடக்க வளர்ச்சி' },
    price: 149999,
    currency: '₹',
    period: { en: 'month', hi: 'महीना', ta: 'மாதம்' },
    features: [
      { en: 'Basic Analytics Dashboard', hi: 'बेसिक एनालिटिक्स डैशबोर्ड', ta: 'அடிப்படை பகுப்பாய்வு' },
      { en: 'Competitor Benchmarking (5 competitors)', hi: '5 प्रतिस्पर्धी बेंचमार्किंग', ta: '5 போட்டியாளர் ஒப்பீடு' },
      { en: 'Social Media Setup Guidance', hi: 'सोशल मीडिया सेटअप गाइडेंस', ta: 'சமூக ஊடக வழிகாட்டி' },
      { en: 'Monthly Performance Report', hi: 'मासिक प्रदर्शन रिपोर्ट', ta: 'மாதாந்திர அறிக்கை' },
      { en: 'Email Support', hi: 'ईमेल सपोर्ट', ta: 'மின்னஞ்சல் ஆதரவு' }
    ],
    recommended: false
  },
  {
    id: 'professional',
    name: { en: 'Professional Scale', hi: 'प्रोफेशनल स्केल', ta: 'தொழில்முறை அளவு' },
    price: 349999,
    currency: '₹',
    period: { en: 'month', hi: 'महीना', ta: 'மாதம்' },
    features: [
      { en: 'Advanced Analytics + AI Insights', hi: 'एडवांस्ड एनालिटिक्स + AI इनसाइट्स', ta: 'மேம்பட்ட பகுப்பாய்வு + AI' },
      { en: 'Unlimited Competitor Analysis', hi: 'असीमित प्रतिस्पर्धी विश्लेषण', ta: 'வரம்பற்ற போட்டியாளர் பகுப்பாய்வு' },
      { en: 'Automated Marketing Campaigns', hi: 'स्वचालित मार्केटिंग अभियान', ta: 'தானியங்கு சந்தைப்படுத்தல்' },
      { en: 'Lead Capture & CRM Integration', hi: 'लीड कैप्चर और CRM इंटीग्रेशन', ta: 'வாடிக்கையாளர் பிடிப்பு' },
      { en: 'Weekly Strategy Calls', hi: 'साप्ताहिक रणनीति कॉल', ta: 'வாராந்திர உத்தி அழைப்புகள்' },
      { en: 'Priority Support (24/7)', hi: 'प्राथमिकता सपोर्ट (24/7)', ta: 'முன்னுரிமை ஆதரவு (24/7)' }
    ],
    recommended: true
  },
  {
    id: 'enterprise',
    name: { en: 'Enterprise Domination', hi: 'एंटरप्राइज डोमिनेशन', ta: 'நிறுவன ஆதிக்கம்' },
    price: 499999,
    currency: '₹',
    period: { en: 'month', hi: 'महीना', ta: 'மாதம்' },
    features: [
      { en: 'Everything in Professional', hi: 'प्रोफेशनल में सब कुछ', ta: 'தொழில்முறையில் அனைத்தும்' },
      { en: 'Custom AI Growth Models', hi: 'कस्टम AI ग्रोथ मॉडल्स', ta: 'தனிப்பயன் AI வளர்ச்சி' },
      { en: 'Multi-location Management', hi: 'मल्टी-लोकेशन मैनेजमेंट', ta: 'பல இட மேலாண்மை' },
      { en: 'White-label Solutions', hi: 'व्हाइट-लेबल सॉल्यूशंस', ta: 'வெள்ளை லேபிள்' },
      { en: 'Dedicated Account Manager', hi: 'समर्पित खाता प्रबंधक', ta: 'பிரத்யேக கணக்கு மேலாளர்' },
      { en: 'Revenue Growth Guarantee (4x)', hi: 'राजस्व वृद्धि गारंटी (4x)', ta: 'வருவாய் வளர்ச்சி உத்தரவாதம் (4x)' }
    ],
    recommended: false
  }
];

// Mock competitor data for different categories
export const competitorDatabase = {
  restaurant: [
    { name: 'Tandoor Palace', score: 87, website: true, socialMedia: 4, reviews: 450, monthlyVisits: 12000 },
    { name: 'Spice Garden', score: 82, website: true, socialMedia: 3, reviews: 320, monthlyVisits: 8500 },
    { name: 'Royal Biryani House', score: 78, website: false, socialMedia: 2, reviews: 180, monthlyVisits: 5200 },
    { name: 'Curry Express', score: 75, website: true, socialMedia: 3, reviews: 250, monthlyVisits: 6800 },
    { name: 'Mumbai Masala', score: 71, website: false, socialMedia: 1, reviews: 95, monthlyVisits: 3100 }
  ],
  retail: [
    { name: 'Fashion Hub', score: 85, website: true, socialMedia: 4, reviews: 380, monthlyVisits: 15000 },
    { name: 'Style Point', score: 79, website: true, socialMedia: 3, reviews: 290, monthlyVisits: 9200 },
    { name: 'Trendy Boutique', score: 73, website: false, socialMedia: 2, reviews: 145, monthlyVisits: 4500 },
    { name: 'Metro Store', score: 68, website: true, socialMedia: 2, reviews: 180, monthlyVisits: 5800 },
    { name: 'Local Market', score: 62, website: false, socialMedia: 1, reviews: 67, monthlyVisits: 2100 }
  ],
  salon: [
    { name: 'Glamour Studio', score: 88, website: true, socialMedia: 4, reviews: 520, monthlyVisits: 18000 },
    { name: 'Beauty Lounge', score: 81, website: true, socialMedia: 3, reviews: 340, monthlyVisits: 11000 },
    { name: 'Shine & Glow', score: 76, website: false, socialMedia: 2, reviews: 210, monthlyVisits: 6500 },
    { name: 'Quick Cuts', score: 70, website: false, socialMedia: 1, reviews: 125, monthlyVisits: 3800 },
    { name: 'Style Bar', score: 66, website: true, socialMedia: 2, reviews: 155, monthlyVisits: 4200 }
  ]
};

// Generate initial analytics data
export const generateAnalyticsData = (userScore) => {
  const baseScore = userScore || 45; // Default low score for new businesses
  
  return {
    digitalPresence: {
      overall: baseScore,
      website: baseScore < 50 ? 0 : baseScore - 10,
      socialMedia: baseScore < 50 ? 20 : baseScore - 5,
      searchVisibility: baseScore < 50 ? 15 : baseScore,
      onlineReviews: baseScore < 50 ? 10 : baseScore - 15
    },
    traffic: {
      monthly: [
        { month: 'Oct', visits: 120, leads: 5 },
        { month: 'Nov', visits: 150, leads: 8 },
        { month: 'Dec', visits: 180, leads: 12 },
        { month: 'Jan', visits: 210, leads: 15 },
        { month: 'Feb', visits: 280, leads: 22 },
        { month: 'Mar', visits: 350, leads: 30 }
      ],
      sources: [
        { name: 'Direct', value: 35, color: '#6366f1' },
        { name: 'Search', value: 25, color: '#8b5cf6' },
        { name: 'Social', value: 20, color: '#ec4899' },
        { name: 'Referral', value: 15, color: '#f59e0b' },
        { name: 'Other', value: 5, color: '#6b7280' }
      ]
    },
    socialMedia: {
      platforms: [
        { name: 'Instagram', followers: 1200, engagement: 4.5, posts: 45 },
        { name: 'Facebook', followers: 850, engagement: 3.2, posts: 32 },
        { name: 'LinkedIn', followers: 420, engagement: 2.8, posts: 18 },
        { name: 'Twitter', followers: 380, engagement: 2.1, posts: 28 }
      ],
      growth: [
        { week: 'W1', followers: 2450 },
        { week: 'W2', followers: 2520 },
        { week: 'W3', followers: 2680 },
        { week: 'W4', followers: 2850 }
      ]
    },
    geoInsights: {
      topCities: [
        { city: 'Mumbai', percentage: 35, leads: 45 },
        { city: 'Pune', percentage: 25, leads: 32 },
        { city: 'Bangalore', percentage: 20, leads: 28 },
        { city: 'Delhi', percentage: 12, leads: 15 },
        { city: 'Hyderabad', percentage: 8, leads: 10 }
      ],
      radius: { '5km': 45, '10km': 30, '15km': 15, '20km+': 10 }
    }
  };
};

// Recommendation engine
export const generateRecommendations = (businessData, analyticsData) => {
  const recommendations = [];
  const score = analyticsData.digitalPresence.overall;
  
  if (score < 50) {
    recommendations.push({
      priority: 'critical',
      category: 'website',
      title: { en: 'Establish Online Presence', hi: 'ऑनलाइन उपस्थिति स्थापित करें', ta: 'இணைய இருப்பை நிறுவுங்கள்' },
      description: { 
        en: 'Your business has minimal digital footprint. Create a professional website to establish credibility.',
        hi: 'आपके व्यवसाय की डिजिटल उपस्थिति न्यूनतम है। विश्वसनीयता स्थापित करने के लिए एक पेशेवर वेबसाइट बनाएं।',
        ta: 'உங்கள் வணிகத்திற்கு குறைந்த டிஜிட்டல் இருப்பு உள்ளது. நம்பகத்தன்மையை நிறுவ ஒரு தொழில்முறை இணையதளத்தை உருவாக்கவும்.'
      },
      impact: '60% increase in customer trust',
      timeline: '2-3 weeks'
    });
    
    recommendations.push({
      priority: 'high',
      category: 'social',
      title: { en: 'Setup Social Media Profiles', hi: 'सोशल मीडिया प्रोफाइल सेटअप करें', ta: 'சமூக ஊடக சுயவிவரங்களை அமைக்கவும்' },
      description: { 
        en: 'Create profiles on Instagram, Facebook, and Google Business to reach local customers.',
        hi: 'स्थानीय ग्राहकों तक पहुंचने के लिए Instagram, Facebook और Google Business पर प्रोफाइल बनाएं।',
        ta: 'உள்ளூர் வாடிக்கையாளர்களை அடைய Instagram, Facebook மற்றும் Google வணிகத்தில் சுயவிவரங்களை உருவாக்கவும்.'
      },
      impact: '40% increase in local discovery',
      timeline: '1 week'
    });
  }
  
  if (score >= 50 && score < 70) {
    recommendations.push({
      priority: 'medium',
      category: 'seo',
      title: { en: 'Improve Search Rankings', hi: 'सर्च रैंकिंग में सुधार करें', ta: 'தேடல் தரவரிசையை மேம்படுத்துங்கள்' },
      description: { 
        en: 'Optimize your website for local SEO to appear in top search results.',
        hi: 'शीर्ष खोज परिणामों में दिखाई देने के लिए अपनी वेबसाइट को स्थानीय SEO के लिए अनुकूलित करें।',
        ta: 'உயர் தேடல் முடிவுகளில் தோன்ற உங்கள் இணையதளத்தை உள்ளூர் SEO க்கு மேம்படுத்துங்கள்.'
      },
      impact: '35% increase in organic traffic',
      timeline: '4-6 weeks'
    });
    
    recommendations.push({
      priority: 'medium',
      category: 'reviews',
      title: { en: 'Build Review Strategy', hi: 'समीक्षा रणनीति बनाएं', ta: 'மதிப்பாய்வு மூலோபாயத்தை உருவாக்குங்கள்' },
      description: { 
        en: 'Encourage satisfied customers to leave reviews. Target 50+ reviews in 3 months.',
        hi: 'संतुष्ट ग्राहकों को समीक्षा छोड़ने के लिए प्रोत्साहित करें। 3 महीनों में 50+ समीक्षाओं का लक्ष्य रखें।',
        ta: 'திருப்தியான வாடிக்கையாளர்களை மதிப்புரைகள் இடும்படி ஊக்குவிக்கவும். 3 மாதங்களில் 50+ மதிப்புரைகள் இலக்கு.'
      },
      impact: '28% boost in conversion rate',
      timeline: '3 months'
    });
  }
  
  if (score >= 70) {
    recommendations.push({
      priority: 'low',
      category: 'automation',
      title: { en: 'Enable Marketing Automation', hi: 'मार्केटिंग ऑटोमेशन सक्षम करें', ta: 'சந்தைப்படுத்தல் தானியங்குவை இயக்குங்கள்' },
      description: { 
        en: 'Set up automated campaigns to nurture leads and maximize conversions.',
        hi: 'लीड को पोषित करने और रूपांतरण को अधिकतम करने के लिए स्वचालित अभियान सेट करें।',
        ta: 'வாடிக்கையாளர்களை வளர்க்க மற்றும் மாற்றங்களை அதிகரிக்க தானியங்கு பிரச்சாரங்களை அமைக்கவும்.'
      },
      impact: '45% increase in lead quality',
      timeline: '2-4 weeks'
    });
  }
  
  return recommendations;
};

// Growth journey steps
export const growthJourneySteps = [
  {
    id: 1,
    title: { en: 'Digital Foundation', hi: 'डिजिटल नींव', ta: 'டிஜிட்டல் அடித்தளம்' },
    description: { 
      en: 'Establish your online presence with website and business profiles',
      hi: 'वेबसाइट और व्यवसाय प्रोफाइल के साथ अपनी ऑनलाइन उपस्थिति स्थापित करें',
      ta: 'இணையதளம் மற்றும் வணிக சுயவிவரங்களுடன் உங்கள் இணைய இருப்பை நிறுவவும்'
    },
    tasks: [
      { id: 'website', label: { en: 'Launch Professional Website', hi: 'पेशेवर वेबसाइट लॉन्च करें', ta: 'தொழில்முறை இணையதளத்தை தொடங்குங்கள்' } },
      { id: 'google', label: { en: 'Setup Google Business Profile', hi: 'Google Business प्रोफाइल सेटअप करें', ta: 'Google வணிக சுயவிவரத்தை அமைக்கவும்' } },
      { id: 'social', label: { en: 'Create Social Media Accounts', hi: 'सोशल मीडिया खाते बनाएं', ta: 'சமூக ஊடக கணக்குகளை உருவாக்குங்கள்' } }
    ]
  },
  {
    id: 2,
    title: { en: 'Content & Visibility', hi: 'सामग्री और दृश्यता', ta: 'உள்ளடக்கம் மற்றும் தெரிவுநிலை' },
    description: { 
      en: 'Build content strategy and improve search visibility',
      hi: 'सामग्री रणनीति बनाएं और खोज दृश्यता में सुधार करें',
      ta: 'உள்ளடக்க மூலோபாயத்தை உருவாக்கி தேடல் தெரிவுநிலையை மேம்படுத்துங்கள்'
    },
    tasks: [
      { id: 'seo', label: { en: 'Optimize for Local SEO', hi: 'स्थानीय SEO के लिए अनुकूलन', ta: 'உள்ளூர் SEO க்கு மேம்படுத்துங்கள்' } },
      { id: 'content', label: { en: 'Publish Regular Content', hi: 'नियमित सामग्री प्रकाशित करें', ta: 'வழக்கமான உள்ளடக்கத்தை வெளியிடுங்கள்' } },
      { id: 'reviews', label: { en: 'Generate Customer Reviews', hi: 'ग्राहक समीक्षाएं उत्पन्न करें', ta: 'வாடிக்கையாளர் மதிப்புரைகளை உருவாக்குங்கள்' } }
    ]
  },
  {
    id: 3,
    title: { en: 'Lead Generation', hi: 'लीड जेनरेशन', ta: 'வாடிக்கையாளர் உருவாக்கம்' },
    description: { 
      en: 'Implement systems to capture and nurture leads',
      hi: 'लीड कैप्चर और पोषित करने के लिए सिस्टम लागू करें',
      ta: 'வாடிக்கையாளர்களைப் பிடிக்க மற்றும் வளர்க்க அமைப்புக்களை செயல்படுத்துங்கள்'
    },
    tasks: [
      { id: 'forms', label: { en: 'Setup Lead Capture Forms', hi: 'लीड कैप्चर फॉर्म सेटअप करें', ta: 'வாடிக்கையாளர் பிடிப்பு படிவங்களை அமைக்கவும்' } },
      { id: 'chatbot', label: { en: 'Enable AI Chatbot', hi: 'AI चैटबॉट सक्षम करें', ta: 'AI chatbot ஐ இயக்குங்கள்' } },
      { id: 'email', label: { en: 'Launch Email Campaigns', hi: 'ईमेल अभियान लॉन्च करें', ta: 'மின்னஞ்சல் பிரச்சாரங்களை தொடங்குங்கள்' } }
    ]
  },
  {
    id: 4,
    title: { en: 'Marketing Automation', hi: 'मार्केटिंग ऑटोमेशन', ta: 'சந்தைப்படுத்தல் தானியங்கு' },
    description: { 
      en: 'Automate marketing and engagement workflows',
      hi: 'मार्केटिंग और एंगेजमेंट वर्कफ़्लो को स्वचालित करें',
      ta: 'சந்தைப்படுத்தல் மற்றும் ஈடுபாடு பணிப்பாய்வுகளை தானியங்குவாக்குங்கள்'
    },
    tasks: [
      { id: 'automation', label: { en: 'Setup Campaign Automation', hi: 'कैंपेन ऑटोमेशन सेटअप करें', ta: 'பிரச்சார தானியங்குவாக்கத்தை அமைக்கவும்' } },
      { id: 'retargeting', label: { en: 'Enable Retargeting Ads', hi: 'रीटार्गेटिंग विज्ञापन सक्षम करें', ta: 'மறுஇலக்கு விளம்பரங்களை இயக்குங்கள்' } },
      { id: 'analytics', label: { en: 'Track Performance Metrics', hi: 'प्रदर्शन मेट्रिक्स ट्रैक करें', ta: 'செயல்திறன் அளவீடுகளைக் கண்காணிக்கவும்' } }
    ]
  },
  {
    id: 5,
    title: { en: 'Scale & Optimize', hi: 'स्केल और अनुकूलन', ta: 'அளவிடுதல் மற்றும் மேம்படுத்தல்' },
    description: { 
      en: 'Optimize conversion rates and scale revenue growth',
      hi: 'रूपांतरण दरों को अनुकूलित करें और राजस्व वृद्धि को स्केल करें',
      ta: 'மாற்ற விகிதங்களை மேம்படுத்தி வருவாய் வளர்ச்சியை அளவிடுங்கள்'
    },
    tasks: [
      { id: 'ab-testing', label: { en: 'Run A/B Testing', hi: 'A/B टेस्टिंग चलाएं', ta: 'A/B சோதனையை இயக்குங்கள்' } },
      { id: 'expansion', label: { en: 'Expand to New Markets', hi: 'नए बाजारों में विस्तार करें', ta: 'புதிய சந்தைகளுக்கு விரிவாக்குங்கள்' } },
      { id: 'revenue', label: { en: 'Achieve 4x Revenue Growth', hi: '4x राजस्व वृद्धि प्राप्त करें', ta: '4x வருவாய் வளர்ச்சியை அடையுங்கள்' } }
    ]
  }
];
