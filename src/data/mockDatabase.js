// Mock Database - Simulating enriched data intelligence

export const businessCategories = [
  { id: 'restaurant', label: { en: 'Restaurant', hi: 'u0930u0947u0938u094du0924u0930u093eu0902', ta: 'u0b89u0ba3u0bb5u0b95u0baeu0bcd', kn: 'u0cb0u0cc6u0cb8u0ccdu0c9fu0ccbu0cb0u0cc6u0c82u0c9fu0ccd', te: 'u0c30u0c46u0c38u0c4du0c1fu0c3eu0c30u0c46u0c02u0c1fu0c4d', ml: 'u0d31u0d46u0d38u0d4du0d31u0d4du0d31u0d4bu0d31u0d28u0d4du0d31u0d4d' , icon: '🍽️' }, icon: 'U0001F37DUFE0F' },
  { id: 'retail', label: { en: 'Retail Shop', hi: 'खुदरा दुकान', ta: 'சில்லறை கடை', kn: 'ಚಿಲ್ಲರೆ ಅಂಗಡಿ', te: 'రిటైల్ షాప్', ml: 'റീട്ടെയിൽ ഷോപ്പ്' , icon: '🛍️' } },
  { id: 'salon', label: { en: 'Salon & Spa', hi: 'सैलून और स्पा', ta: 'அழகு நிலையம்', kn: 'ಸಲೂನ್ ಮತ್ತು ಸ್ಪಾ', te: 'సెలూన్ & స్పా', ml: 'സലൂൺ & സ്പാ' , icon: '💇' } },
  { id: 'gym', label: { en: 'Gym & Fitness', hi: 'जिम और फिटनेस', ta: 'உடற்பயிற்சி', kn: 'ಜಿಮ್ ಮತ್ತು ಫಿಟ್ನೆಸ್', te: 'జిమ్ & ఫిట్‌నెస్', ml: 'ജിം & ഫിറ്റ്നസ്' , icon: '💪' } },
  { id: 'medical', label: { en: 'Medical Clinic', hi: 'चिकित्सा क्लिनिक', ta: 'மருத்துவ நிலையம்', kn: 'ವೈದ್ಯಕೀಯ ಕ್ಲಿನಿಕ್', te: 'మెడికల్ క్లినిక్', ml: 'മെഡിക്കൽ ക്ലിനിക്' , icon: '🏥' } },
  { id: 'education', label: { en: 'Education & Training', hi: 'शिक्षा और प्रशिक्षण', ta: 'கல்வி', kn: 'ಶಿಕ್ಷಣ ಮತ್ತು ತರಬೇತಿ', te: 'విద్య & శిక్షణ', ml: 'വിദ്യാഭ്യാസം & പരിശീലനം' , icon: '📚' } },
  { id: 'professional', label: { en: 'Professional Services', hi: 'व्यावसायिक सेवाएं', ta: 'தொழில்முறை சேவைகள்', kn: 'ವೃತ್ತಿಪರ ಸೇವೆಗಳು', te: 'ప్రొఫెషనల్ సేవలు', ml: 'പ്രൊഫഷണൽ സേവനങ്ങൾ' , icon: '💼' } },
  { id: 'automotive', label: { en: 'Automotive', hi: 'ऑटोमोटिव', ta: 'வாகனம்', kn: 'ಆಟೋಮೋಟಿವ್', te: 'ఆటోమోటివ్', ml: 'ഓട്ടോമോട്ടീವ്' , icon: '🚗' } },
  { id: 'hotel', label: { en: 'Hotel & Hospitality', hi: 'होटल और आतिथ्य', ta: 'ஹோட்டல் & விருந்தோம்பல்', kn: 'ಹೋಟೆಲ್ & ಆತಿಥ್ಯ', te: 'హోటల్ & హాస్పిటాలిటీ', ml: 'ഹോട്ടൽ & ഹോസ്പിറ്റാലിറ്റി' , icon: '🏨' } }
];

export const subscriptionPlans = [
  {
    id: 'starter',
    name: { en: 'Starter Growth', hi: 'स्टार्टर ग्रोथ', ta: 'தொடக்க வளர்ச்சி', kn: 'ಸ್ಟಾರ್ಟರ್ ಬೆಳವಣಿಗೆ', te: 'స్టార్టర్ గ్రోత్', ml: 'സ്റ്റാർട്ടർ ഗ്രോത്ത്' },
    price: 499900,
    yearlyPrice: 459900,
    currency: '₹',
    period: { en: 'month', hi: 'महीना', ta: 'மாதம்', kn: 'ತಿಂಗಳು', te: 'నెల', ml: 'മാസം' },
    features: [
      { en: 'Basic Analytics Dashboard', hi: 'बेसिक एनालिटिक्स डैशबोर्ड', ta: 'அடிப்படை பகுப்பாய்வு', kn: 'ಮೂಲ ವಿಶ್ಲೇಷಣೆ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', te: 'బేసిక్ అనలిటిక్స్ డ్యాష్‌బోర్డ్', ml: 'ബേസിക് അനലിറ്റിക്സ് ഡാഷ്ബോർഡ്' },
      { en: 'Competitor Benchmarking (5 competitors)', hi: '5 प्रतिस्पर्धी बेंचमार्किंग', ta: '5 போட்டியாளர் ஒப்பீடு', kn: '5 ಪ್ರತಿಸ್ಪರ್ಧಿ ಬೆಂಚ್‌ಮಾರ್ಕಿಂಗ್', te: '5 పోటీదారుల బెంచ్‌మార్కింగ్', ml: '5 എതിരാളി ബെഞ്ച്മാർക്കിംഗ്' },
      { en: 'Social Media Setup Guidance', hi: 'सोशल मीडिया सेटअप गाइडेंस', ta: 'சமூக ஊடக வழிகாட்டி', kn: 'ಸೋಶಿಯಲ್ ಮೀಡಿಯಾ ಸೆಟಪ್ ಮಾರ್ಗದರ್ಶಿ', te: 'సోషల్ మీడియా సెటప్ గైడెన్స్', ml: 'സോഷ്യൽ മീഡിയ സെറ്റപ്പ് ഗൈഡൻസ്' },
      { en: 'Monthly Performance Report', hi: 'मासिक प्रदर्शन रिपोर्ट', ta: 'மாதாந்திர அறிக்கை', kn: 'ಮಾಸಿಕ ಕಾರ್ಯಕ್ಷಮತೆ ವರದಿ', te: 'నెలవారీ పనితీరు నివేదిక', ml: 'പ്രതിമാസ പ്രകടന റിപ്പോർട്ട്' },
      { en: 'Email Support', hi: 'ईमेल सपोर्ट', ta: 'மின்னஞ்சல் ஆதரவு', kn: 'ಇಮೇಲ್ ಬೆಂಬಲ', te: 'ఇమెయిల్ సపోర్ట్', ml: 'ഇമെയിൽ സപ്പോർട്ട്' }
    ],
    recommended: false
  },
  {
    id: 'professional',
    name: { en: 'Professional Scale', hi: 'प्रोफेशनल स्केल', ta: 'தொழில்முறை அளவு', kn: 'ವೃತ್ತಿಪರ ಸ್ಕೇಲ್', te: 'ప్రొఫెషనల్ స్కేల్', ml: 'പ്രൊഫഷണൽ സ്കെയിൽ' },
    price: 899900,
    yearlyPrice: 799900,
    currency: '₹',
    period: { en: 'month', hi: 'महीना', ta: 'மாதம்', kn: 'ತಿಂಗಳು', te: 'నెల', ml: 'മാസം' },
    features: [
      { en: 'Advanced Analytics + AI Insights', hi: 'एडवांस्ड एनालिटिक्स + AI इनसाइट्स', ta: 'மேம்பட்ட பகுப்பாய்வு + AI', kn: 'ಸುಧಾರಿತ ವಿಶ್ಲೇಷಣೆ + AI', te: 'అడ్వాన్స్డ్ అనలిటిక్స్ + AI', ml: 'അഡ്വാൻസ്ഡ് അനലിറ്റിക്സ് + AI' },
      { en: 'Unlimited Competitor Analysis', hi: 'असीमित प्रतिस्पर्धी विश्लेषण', ta: 'வரம்பற்ற போட்டியாளர் பகுப்பாய்வு', kn: 'ಅನಿಯಮಿತ ಪ್ರತಿಸ್ಪರ್ಧಿ ವಿಶ್ಲೇಷಣೆ', te: 'అపరిమిత పోటీదారుల విశ్లేషణ', ml: 'അൺലിമിറ്റഡ് എതിരാളി വിശകലനം' },
      { en: 'Automated Marketing Campaigns', hi: 'स्वचालित मार्केटिंग अभियान', ta: 'தானியங்கு சந்தைப்படுத்தல்', kn: 'ಸ್ವಯಂಚಾಲಿತ ಮಾರ್ಕೆಟಿಂಗ್', te: 'ఆటోమేటెడ్ మార్కెటింగ్', ml: 'ഓട്ടോമേറ്റഡ് മാർക്കറ്റിംഗ്' },
      { en: 'Lead Capture & CRM Integration', hi: 'लीड कैप्चर और CRM इंटीग्रेशन', ta: 'வாடிக்கையாளர் பிடிப்பு', kn: 'ಲೀಡ್ ಕ್ಯಾಪ್ಚರ್ & CRM', te: 'లీడ్ క్యాప్చర్ & CRM', ml: 'ലീഡ് ക്യാപ്ചർ & CRM' },
      { en: 'Weekly Strategy Calls', hi: 'साप्ताहिक रणनीति कॉल', ta: 'வாராந்திர உத்தி அழைப்புகள்', kn: 'ಸಾಪ್ತಾಹಿಕ ತಂತ್ರ ಕರೆಗಳು', te: 'వారపు స్ట్రాటజీ కాల్స్', ml: 'പ്രതിവാര സ്ട്രാറ്റജി കോളുകൾ' },
      { en: 'Priority Support (24/7)', hi: 'प्राथमिकता सपोर्ट (24/7)', ta: 'முன்னுரிமை ஆதரவு (24/7)', kn: 'ಆದ್ಯತೆ ಬೆಂಬಲ (24/7)', te: 'ప్రాధాన్య సపోర్ట్ (24/7)', ml: 'പ്രയോറിറ്റി സപ്പോർട്ട് (24/7)' }
    ],
    recommended: true
  },
  {
    id: 'enterprise',
    name: { en: 'Enterprise Domination', hi: 'एंटरप्राइज डोमिनेशन', ta: 'நிறுவன ஆதிக்கம்', kn: 'ಎಂಟರ್‌ಪ್ರೈಸ್ ಡಾಮಿನೇಶನ್', te: 'ఎంటర్‌ప్రైజ్ డామినేషన్', ml: 'എന്റർപ്രൈസ് ഡോമിനേഷൻ' },
    price: 1499900,
    yearlyPrice: 1259900,
    currency: '₹',
    period: { en: 'month', hi: 'महीना', ta: 'மாதம்', kn: 'ತಿಂಗಳು', te: 'నెల', ml: 'മാസം' },
    features: [
      { en: 'Everything in Professional', hi: 'प्रोफेशनल में सब कुछ', ta: 'தொழில்முறையில் அனைத்தும்', kn: 'ವೃತ್ತಿಪರದಲ್ಲಿ ಎಲ್ಲವೂ', te: 'ప్రొఫెషనల్‌లో అన్నీ', ml: 'പ്രൊഫഷണലിലെ എല്ലാം' },
      { en: 'Custom AI Growth Models', hi: 'कस्टम AI ग्रोथ मॉडल्स', ta: 'தனிப்பயன் AI வளர்ச்சி', kn: 'ಕಸ್ಟಮ್ AI ಬೆಳವಣಿಗೆ ಮಾದರಿಗಳು', te: 'కస్టమ్ AI గ్రోత్ మోడల్స్', ml: 'കസ്റ്റം AI ഗ്രോത്ത് മോഡലുകൾ' },
      { en: 'Multi-location Management', hi: 'मल्टी-लोकेशन मैनेजमेंट', ta: 'பல இட மேலாண்மை', kn: 'ಬಹು-ಸ್ಥಳ ನಿರ್ವಹಣೆ', te: 'మల్టీ-లొకేషన్ మేనేజ్‌మెంట్', ml: 'മൾട്ടി-ലൊക്കേഷൻ മാനേജ്മെന്റ്' },
      { en: 'White-label Solutions', hi: 'व्हाइट-लेबल सॉल्यूशंस', ta: 'வெள்ளை லேபிள்', kn: 'ವೈಟ್-ಲೇಬಲ್ ಪರಿಹಾರಗಳು', te: 'వైట్-లేబుల్ సొల్యూషన్స్', ml: 'വൈറ്റ്-ലേബൽ സൊല്യൂഷൻസ്' },
      { en: 'Dedicated Account Manager', hi: 'समर्पित खाता प्रबंधक', ta: 'பிரத்யேக கணக்கு மேலாளர்', kn: 'ಮೀಸಲಾದ ಖಾತೆ ನಿರ್ವಾಹಕ', te: 'డెడికేటెడ్ అకౌంట్ మేనేజర్', ml: 'ഡെഡിക്കേറ്റഡ് അക്കൗണ്ട് മാനേജർ' },
      { en: 'Revenue Growth Guarantee (4x)', hi: 'राजस्व वृद्धि गारंटी (4x)', ta: 'வருவாய் வளர்ச்சி உத்தரவாதம் (4x)', kn: 'ಆದಾಯ ಬೆಳವಣಿಗೆ ಗ್ಯಾರಂಟಿ (4x)', te: 'రెవెన్యూ గ్రోత్ గ్యారంటీ (4x)', ml: 'റവന്യൂ ഗ്രോത്ത് ഗ്യാരണ്ടി (4x)' }
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
    { name: 'Mumbai Masala', score: 71, website: false, socialMedia: 1, reviews: 95, monthlyVisits: 3100 },
    { name: 'Flavors of India', score: 68, website: true, socialMedia: 2, reviews: 210, monthlyVisits: 5800 },
    { name: 'Saffron Kitchen', score: 65, website: true, socialMedia: 2, reviews: 180, monthlyVisits: 4900 },
    { name: 'Golden Spoon', score: 62, website: false, socialMedia: 1, reviews: 140, monthlyVisits: 3800 },
    { name: 'Spice Route', score: 58, website: true, socialMedia: 2, reviews: 165, monthlyVisits: 4200 },
    { name: 'Tasty Bites', score: 55, website: false, socialMedia: 1, reviews: 110, monthlyVisits: 2900 }
  ],
  retail: [
    { name: 'Fashion Hub', score: 85, website: true, socialMedia: 4, reviews: 380, monthlyVisits: 15000 },
    { name: 'Style Point', score: 79, website: true, socialMedia: 3, reviews: 290, monthlyVisits: 9200 },
    { name: 'Trendy Boutique', score: 73, website: false, socialMedia: 2, reviews: 145, monthlyVisits: 4500 },
    { name: 'Metro Store', score: 68, website: true, socialMedia: 2, reviews: 180, monthlyVisits: 5800 },
    { name: 'Local Market', score: 62, website: false, socialMedia: 1, reviews: 67, monthlyVisits: 2100 },
    { name: 'Fashion Fiesta', score: 59, website: true, socialMedia: 2, reviews: 155, monthlyVisits: 4100 },
    { name: 'Urban Style', score: 56, website: true, socialMedia: 2, reviews: 130, monthlyVisits: 3600 },
    { name: 'Chic Boutique', score: 52, website: false, socialMedia: 1, reviews: 95, monthlyVisits: 2800 },
    { name: 'Style Studio', score: 48, website: true, socialMedia: 1, reviews: 110, monthlyVisits: 3200 },
    { name: 'Fashion Corner', score: 45, website: false, socialMedia: 1, reviews: 75, monthlyVisits: 2400 }
  ],
  salon: [
    { name: 'Glamour Studio', score: 88, website: true, socialMedia: 4, reviews: 520, monthlyVisits: 18000 },
    { name: 'Beauty Lounge', score: 81, website: true, socialMedia: 3, reviews: 340, monthlyVisits: 11000 },
    { name: 'Shine & Glow', score: 76, website: false, socialMedia: 2, reviews: 210, monthlyVisits: 6500 },
    { name: 'Quick Cuts', score: 70, website: false, socialMedia: 1, reviews: 125, monthlyVisits: 3800 },
    { name: 'Style Bar', score: 66, website: true, socialMedia: 2, reviews: 155, monthlyVisits: 4200 },
    { name: 'Elegance Salon', score: 63, website: true, socialMedia: 2, reviews: 190, monthlyVisits: 5200 },
    { name: 'Hair & Beauty Hub', score: 59, website: true, socialMedia: 2, reviews: 145, monthlyVisits: 4600 },
    { name: 'Makeover Studio', score: 56, website: false, socialMedia: 1, reviews: 120, monthlyVisits: 3500 },
    { name: 'Salon Express', score: 52, website: true, socialMedia: 1, reviews: 135, monthlyVisits: 3900 },
    { name: 'Beauty Paradise', score: 48, website: false, socialMedia: 1, reviews: 90, monthlyVisits: 2700 }
  ],
  gym: [
    { name: 'PowerHouse Gym', score: 86, website: true, socialMedia: 4, reviews: 480, monthlyVisits: 16000 },
    { name: 'FitZone', score: 80, website: true, socialMedia: 3, reviews: 350, monthlyVisits: 12000 },
    { name: 'Elite Fitness', score: 75, website: true, socialMedia: 3, reviews: 290, monthlyVisits: 9500 },
    { name: 'Body Sculpt Gym', score: 71, website: false, socialMedia: 2, reviews: 220, monthlyVisits: 7200 },
    { name: 'Iron Paradise', score: 67, website: true, socialMedia: 2, reviews: 195, monthlyVisits: 6100 },
    { name: 'Strength Zone', score: 63, website: true, socialMedia: 2, reviews: 165, monthlyVisits: 5400 },
    { name: 'Peak Performance', score: 59, website: false, socialMedia: 1, reviews: 140, monthlyVisits: 4700 },
    { name: 'Active Gym', score: 55, website: true, socialMedia: 2, reviews: 125, monthlyVisits: 4100 },
    { name: 'Fitness Factory', score: 51, website: false, socialMedia: 1, reviews: 100, monthlyVisits: 3300 },
    { name: 'Local Gym', score: 47, website: false, socialMedia: 1, reviews: 75, monthlyVisits: 2600 }
  ],
  medical: [
    { name: 'City Health Clinic', score: 89, website: true, socialMedia: 3, reviews: 560, monthlyVisits: 20000 },
    { name: 'MediCare Center', score: 83, website: true, socialMedia: 3, reviews: 410, monthlyVisits: 15000 },
    { name: 'Wellness Clinic', score: 78, website: true, socialMedia: 2, reviews: 320, monthlyVisits: 11000 },
    { name: 'Prime Healthcare', score: 73, website: true, socialMedia: 2, reviews: 270, monthlyVisits: 8800 },
    { name: 'Family Clinic', score: 68, website: false, socialMedia: 2, reviews: 210, monthlyVisits: 7100 },
    { name: 'HealthFirst Clinic', score: 64, website: true, socialMedia: 2, reviews: 185, monthlyVisits: 6200 },
    { name: 'Apollo Diagnostics', score: 60, website: true, socialMedia: 1, reviews: 155, monthlyVisits: 5400 },
    { name: 'Care Plus Clinic', score: 56, website: false, socialMedia: 1, reviews: 130, monthlyVisits: 4600 },
    { name: 'Quick Care', score: 52, website: true, socialMedia: 1, reviews: 110, monthlyVisits: 3900 },
    { name: 'Local Medical', score: 48, website: false, socialMedia: 1, reviews: 85, monthlyVisits: 3100 }
  ],
  education: [
    { name: 'Bright Future Academy', score: 84, website: true, socialMedia: 4, reviews: 430, monthlyVisits: 14000 },
    { name: 'Knowledge Hub', score: 78, website: true, socialMedia: 3, reviews: 320, monthlyVisits: 10500 },
    { name: 'Genius Classes', score: 73, website: true, socialMedia: 3, reviews: 260, monthlyVisits: 8700 },
    { name: 'Success Academy', score: 69, website: false, socialMedia: 2, reviews: 210, monthlyVisits: 7200 },
    { name: 'Study Point', score: 65, website: true, socialMedia: 2, reviews: 185, monthlyVisits: 6400 },
    { name: 'Excel Institute', score: 61, website: true, socialMedia: 2, reviews: 155, monthlyVisits: 5600 },
    { name: 'Learning Center', score: 57, website: false, socialMedia: 1, reviews: 130, monthlyVisits: 4800 },
    { name: 'Scholars Academy', score: 53, website: true, socialMedia: 1, reviews: 110, monthlyVisits: 4100 },
    { name: 'Tutorial Hub', score: 49, website: false, socialMedia: 1, reviews: 90, monthlyVisits: 3400 },
    { name: 'Basic Classes', score: 45, website: false, socialMedia: 1, reviews: 70, monthlyVisits: 2700 }
  ],
  professional: [
    { name: 'Elite Consultants', score: 87, website: true, socialMedia: 4, reviews: 490, monthlyVisits: 17000 },
    { name: 'Business Pro Services', score: 81, website: true, socialMedia: 3, reviews: 370, monthlyVisits: 13000 },
    { name: 'Prime Solutions', score: 76, website: true, socialMedia: 3, reviews: 300, monthlyVisits: 10000 },
    { name: 'Corporate Experts', score: 72, website: true, socialMedia: 2, reviews: 240, monthlyVisits: 8200 },
    { name: 'Strategy Partners', score: 68, website: false, socialMedia: 2, reviews: 200, monthlyVisits: 6900 },
    { name: 'Skill Builders', score: 64, website: true, socialMedia: 2, reviews: 175, monthlyVisits: 5900 },
    { name: 'Growth Advisors', score: 60, website: true, socialMedia: 2, reviews: 145, monthlyVisits: 5100 },
    { name: 'Business Hub', score: 56, website: false, socialMedia: 1, reviews: 120, monthlyVisits: 4400 },
    { name: 'Pro Services', score: 52, website: true, socialMedia: 1, reviews: 100, monthlyVisits: 3700 },
    { name: 'Local Consultancy', score: 48, website: false, socialMedia: 1, reviews: 75, monthlyVisits: 2900 }
  ],
  automotive: [
    { name: 'Premium Auto Care', score: 85, website: true, socialMedia: 4, reviews: 460, monthlyVisits: 15500 },
    { name: 'Speed Service Center', score: 79, website: true, socialMedia: 3, reviews: 340, monthlyVisits: 11500 },
    { name: 'Auto Works', score: 74, website: true, socialMedia: 3, reviews: 280, monthlyVisits: 9200 },
    { name: 'Car Care Pro', score: 70, website: false, socialMedia: 2, reviews: 220, monthlyVisits: 7500 },
    { name: 'Quick Fix Garage', score: 66, website: true, socialMedia: 2, reviews: 190, monthlyVisits: 6300 },
    { name: 'Master Mechanics', score: 62, website: true, socialMedia: 2, reviews: 160, monthlyVisits: 5500 },
    { name: 'Auto Solutions', score: 58, website: false, socialMedia: 1, reviews: 135, monthlyVisits: 4700 },
    { name: 'Repair Hub', score: 54, website: true, socialMedia: 1, reviews: 115, monthlyVisits: 4000 },
    { name: 'Service Station', score: 50, website: false, socialMedia: 1, reviews: 95, monthlyVisits: 3300 },
    { name: 'Local Garage', score: 46, website: false, socialMedia: 1, reviews: 70, monthlyVisits: 2600 }
  ],
  hotel: [
    { name: 'The Grand Palace Hotel', score: 95, website: true, socialMedia: 4, reviews: 2840, monthlyVisits: 85000, latOffset: 0.008, lngOffset: -0.012 },
    { name: 'Radiance Suites & Spa', score: 92, website: true, socialMedia: 4, reviews: 2100, monthlyVisits: 72000, latOffset: -0.006, lngOffset: 0.015 },
    { name: 'Hotel Majestic Inn', score: 89, website: true, socialMedia: 4, reviews: 1850, monthlyVisits: 64000, latOffset: 0.014, lngOffset: 0.005 },
    { name: 'Royal Orchid Residency', score: 87, website: true, socialMedia: 3, reviews: 1620, monthlyVisits: 58000, latOffset: -0.011, lngOffset: -0.008 },
    { name: 'Skyline Business Hotel', score: 84, website: true, socialMedia: 3, reviews: 1480, monthlyVisits: 52000, latOffset: 0.003, lngOffset: 0.019 },
    { name: 'The Emerald Resort', score: 82, website: true, socialMedia: 3, reviews: 1350, monthlyVisits: 47000, latOffset: -0.017, lngOffset: 0.003 },
    { name: 'Comfort Stay Hotels', score: 79, website: true, socialMedia: 3, reviews: 1120, monthlyVisits: 41000, latOffset: 0.009, lngOffset: -0.016 },
    { name: 'Golden Leaf Hotel', score: 76, website: true, socialMedia: 3, reviews: 980, monthlyVisits: 36000, latOffset: -0.004, lngOffset: 0.011 },
    { name: 'Heritage Haveli Hotel', score: 74, website: true, socialMedia: 2, reviews: 890, monthlyVisits: 32000, latOffset: 0.016, lngOffset: -0.007 },
    { name: 'BlueStar Lodge & Suites', score: 71, website: true, socialMedia: 2, reviews: 760, monthlyVisits: 28000, latOffset: -0.013, lngOffset: -0.014 },
    { name: 'Hotel Sunrise Point', score: 68, website: true, socialMedia: 2, reviews: 650, monthlyVisits: 24000, latOffset: 0.007, lngOffset: 0.013 },
    { name: 'Park Avenue Rooms', score: 65, website: true, socialMedia: 2, reviews: 540, monthlyVisits: 20000, latOffset: -0.009, lngOffset: 0.006 },
    { name: 'City Central Inn', score: 62, website: true, socialMedia: 2, reviews: 480, monthlyVisits: 17000, latOffset: 0.012, lngOffset: -0.004 },
    { name: 'Lakeview Budget Hotel', score: 58, website: true, socialMedia: 1, reviews: 390, monthlyVisits: 14000, latOffset: -0.015, lngOffset: 0.009 },
    { name: 'Hotel Sai Comfort', score: 55, website: false, socialMedia: 2, reviews: 320, monthlyVisits: 11000, latOffset: 0.005, lngOffset: -0.018 },
    { name: 'Green View Guest House', score: 52, website: false, socialMedia: 1, reviews: 280, monthlyVisits: 8500, latOffset: -0.018, lngOffset: -0.002 },
    { name: 'Travellers Nest Hotel', score: 48, website: false, socialMedia: 1, reviews: 210, monthlyVisits: 6200, latOffset: 0.011, lngOffset: 0.008 },
    { name: 'Budget Inn Express', score: 44, website: false, socialMedia: 1, reviews: 165, monthlyVisits: 4800, latOffset: -0.002, lngOffset: -0.011 },
    { name: 'Hotel New Bharat', score: 40, website: false, socialMedia: 1, reviews: 120, monthlyVisits: 3500, latOffset: 0.015, lngOffset: 0.002 },
    { name: 'Shree Krishna Lodge', score: 36, website: false, socialMedia: 1, reviews: 85, monthlyVisits: 2200, latOffset: -0.007, lngOffset: 0.017 },
    { name: 'Annapurna Guest House', score: 33, website: false, socialMedia: 0, reviews: 55, monthlyVisits: 1400, latOffset: 0.002, lngOffset: -0.009 },
    { name: 'Balaji Rooms & Stay', score: 30, website: false, socialMedia: 0, reviews: 30, monthlyVisits: 800, latOffset: -0.014, lngOffset: 0.007 }
  ]
};

// Generate initial analytics data
export const generateAnalyticsData = (userScore) => {
  const baseScore = userScore || 45; // Default low score for new businesses

  // Zero-state: brand new business with absolutely no online presence
  if (baseScore <= 5) {
    return {
      digitalPresence: {
        overall: baseScore,
        website: 0,
        socialMedia: 0,
        searchVisibility: 0,
        onlineReviews: 0
      },
      traffic: {
        monthly: [
          { month: 'Oct', visits: 0, leads: 0 },
          { month: 'Nov', visits: 0, leads: 0 },
          { month: 'Dec', visits: 0, leads: 0 },
          { month: 'Jan', visits: 0, leads: 0 },
          { month: 'Feb', visits: 0, leads: 0 },
          { month: 'Mar', visits: 0, leads: 0 }
        ],
        sources: [
          { name: 'Direct', value: 0, color: '#6366f1' },
          { name: 'Search', value: 0, color: '#8b5cf6' },
          { name: 'Social', value: 0, color: '#ec4899' },
          { name: 'Referral', value: 0, color: '#f59e0b' },
          { name: 'Other', value: 0, color: '#6b7280' }
        ]
      },
      socialMedia: {
        platforms: [
          { name: 'Instagram', followers: 0, engagement: 0, posts: 0 },
          { name: 'Facebook', followers: 0, engagement: 0, posts: 0 },
          { name: 'LinkedIn', followers: 0, engagement: 0, posts: 0 },
          { name: 'Twitter', followers: 0, engagement: 0, posts: 0 }
        ],
        growth: [
          { week: 'W1', followers: 0 },
          { week: 'W2', followers: 0 },
          { week: 'W3', followers: 0 },
          { week: 'W4', followers: 0 }
        ]
      },
      geoInsights: {
        topCities: [
          { city: 'Within 1 km', percentage: 0, leads: 0 },
          { city: '1-3 km', percentage: 0, leads: 0 },
          { city: '3-5 km', percentage: 0, leads: 0 },
          { city: '5-10 km', percentage: 0, leads: 0 },
          { city: '10+ km', percentage: 0, leads: 0 }
        ],
        radius: { '5km': 0, '10km': 0, '15km': 0, '20km+': 0 }
      }
    };
  }
  
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
      title: { en: 'Establish Online Presence', hi: 'ऑनलाइन उपस्थिति स्थापित करें', ta: 'இணைய இருப்பை நிறுவுங்கள்', kn: 'ಆನ್‌ಲೈನ್ ಉಪಸ್ಥಿತಿ ಸ್ಥಾಪಿಸಿ', te: 'ఆన్‌లైన్ ప్రెజెన్స్ ఏర్పాటు', ml: 'ഓൺലൈൻ സാന്നിധ്യം സ്ഥാപിക്കുക' },
      description: { 
        en: 'Your business has minimal digital footprint. Create a professional website to establish credibility.',
        hi: 'आपके व्यवसाय की डिजिटल उपस्थिति न्यूनतम है। विश्वसनीयता स्थापित करने के लिए एक पेशेवर वेबसाइट बनाएं।',
        ta: 'உங்கள் வணிகத்திற்கு குறைந்த டிஜிட்டல் இருப்பு உள்ளது. நம்பகத்தன்மையை நிறுவ ஒரு தொழில்முறை இணையதளத்தை உருவாக்கவும்.',
        kn: 'ನಿಮ್ಮ ವ್ಯಾಪಾರಕ್ಕೆ ಕನಿಷ್ಠ ಡಿಜಿಟಲ್ ಹೆಜ್ಜೆಗುರುತು ಇದೆ. ವಿಶ್ವಾಸಾರ್ಹತೆಯನ್ನು ಸ್ಥಾಪಿಸಲು ವೃತ್ತಿಪರ ವೆಬ್‌ಸೈಟ್ ರಚಿಸಿ.',
        te: 'మీ వ్యాపారానికి తక్కువ డిజిటల్ ఫుట్‌ప్రింట్ ఉంది. విశ్వసనీయత కోసం ప్రొఫెషనల్ వెబ్‌సైట్ సృష్టించండి.',
        ml: 'നിങ്ങളുടെ ബിസിനസിന് ഡിജിറ്റൽ സാന്നിധ്യം കുറവാണ്. വിശ്വാസ്യത സ്ഥാപിക്കാൻ പ്രൊഫഷണൽ വെബ്സൈറ്റ് നിർമ്മിക്കുക.'
      },
      impact: '60% increase in customer trust',
      timeline: '2-3 weeks'
    });
    
    recommendations.push({
      priority: 'high',
      category: 'social',
      title: { en: 'Setup Social Media Profiles', hi: 'सोशल मीडिया प्रोफाइल सेटअप करें', ta: 'சமூக ஊடக சுயவிவரங்களை அமைக்கவும்', kn: 'ಸೋಶಿಯಲ್ ಮೀಡಿಯಾ ಪ್ರೊಫೈಲ್ ಸೆಟಪ್', te: 'సోషల్ మీడియా ప్రొఫైల్ సెటప్', ml: 'സോഷ്യൽ മീഡിയ പ്രൊഫൈൽ സെറ്റപ്പ്' },
      description: { 
        en: 'Create profiles on Instagram, Facebook, and Google Business to reach local customers.',
        hi: 'स्थानीय ग्राहकों तक पहुंचने के लिए Instagram, Facebook और Google Business पर प्रोफाइल बनाएं।',
        ta: 'உள்ளூர் வாடிக்கையாளர்களை அடைய Instagram, Facebook மற்றும் Google வணிகத்தில் சுயவிவரங்களை உருவாக்கவும்.',
        kn: 'ಸ್ಥಳೀಯ ಗ್ರಾಹಕರನ್ನು ತಲುಪಲು Instagram, Facebook ಮತ್ತು Google Business ನಲ್ಲಿ ಪ್ರೊಫೈಲ್ ರಚಿಸಿ.',
        te: 'స్థానిక కస్టమర్లను చేరుకోవడానికి Instagram, Facebook మరియు Google Business లో ప్రొఫైల్స్ సృష్టించండి.',
        ml: 'ലോക്കൽ കസ്റ്റമർമാരെ എത്തിക്കാൻ Instagram, Facebook, Google Business-ൽ പ്രൊഫൈലുകൾ സൃഷ്ടിക്കുക.'
      },
      impact: '40% increase in local discovery',
      timeline: '1 week'
    });

    // Hotel-specific extra recommendations
    if (businessData && businessData.category === 'hotel') {
      recommendations.push({
        priority: 'critical',
        category: 'social',
        title: { en: 'List on OTA Platforms', hi: 'OTA प्लेटफॉर्म पर लिस्ट करें', ta: 'OTA தளங்களில் பதிவு செய்யுங்கள்', kn: 'OTA ಪ್ಲಾಟ್‌ಫಾರ್ಮ್‌ಗಳಲ್ಲಿ ಪಟ್ಟಿ ಮಾಡಿ', te: 'OTA ప్లాట్‌ఫార్మ్‌లలో లిస్ట్ చేయండి', ml: 'OTA പ്ലാറ്റ്ഫോമുകളിൽ ലിസ്റ്റ് ചെയ്യുക' },
        description: {
          en: 'Register on MakeMyTrip, Goibibo, Booking.com, and OYO to start getting online bookings. Your 22 competitors are already listed.',
          hi: 'ऑनलाइन बुकिंग शुरू करने के लिए MakeMyTrip, Goibibo, Booking.com और OYO पर रजिस्टर करें। आपके 22 प्रतिस्पर्धी पहले से सूचीबद्ध हैं।',
          ta: 'MakeMyTrip, Goibibo, Booking.com, OYO இல் பதிவு செய்யுங்கள். உங்கள் 22 போட்டியாளர்கள் ஏற்கனவே பட்டியலிடப்பட்டுள்ளனர்.',
          kn: 'MakeMyTrip, Goibibo, Booking.com, OYO ನಲ್ಲಿ ನೋಂದಾಯಿಸಿ. ನಿಮ್ಮ 22 ಪ್ರತಿಸ್ಪರ್ಧಿಗಳು ಈಗಾಗಲೇ ಪಟ್ಟಿಯಲ್ಲಿದ್ದಾರೆ.',
          te: 'MakeMyTrip, Goibibo, Booking.com, OYO లో రిజిస్టర్ చేయండి. మీ 22 పోటీదారులు ఇప్పటికే లిస్ట్ చేయబడ్డారు.',
          ml: 'MakeMyTrip, Goibibo, Booking.com, OYO-യിൽ രജിസ്റ്റർ ചെയ്യുക. നിങ്ങളുടെ 22 എതിരാളികൾ ഇതിനകം ലിസ്റ്റ് ചെയ്തിട്ടുണ്ട്.'
        },
        impact: '80% of hotel bookings happen via OTAs',
        timeline: '1-2 weeks'
      });
      recommendations.push({
        priority: 'high',
        category: 'reviews',
        title: { en: 'Get Google Hotel Pack Listing', hi: 'Google Hotel Pack लिस्टिंग प्राप्त करें', ta: 'Google Hotel Pack பட்டியலைப் பெறுங்கள்', kn: 'Google Hotel Pack ಪಟ್ಟಿ ಪಡೆಯಿರಿ', te: 'Google Hotel Pack లిస్టింగ్ పొందండి', ml: 'Google Hotel Pack ലിസ്റ്റിംഗ് നേടുക' },
        description: {
          en: 'Setup Google Business Profile with photos, rates, and amenities to appear in Google Hotel Pack search results. Currently invisible to online travelers.',
          hi: 'Google Hotel Pack सर्च रिजल्ट्स में दिखने के लिए फोटो, रेट्स और सुविधाओं के साथ Google Business Profile सेटअप करें।',
          ta: 'Google Hotel Pack தேடல் முடிவுகளில் தோன்ற புகைப்படங்கள், கட்டணங்கள், வசதிகளுடன் Google Business Profile அமைக்கவும்.',
          kn: 'Google Hotel Pack ಹುಡುಕಾಟ ಫಲಿತಾಂಶಗಳಲ್ಲಿ ಕಾಣಿಸಲು ಫೋಟೋಗಳು, ದರಗಳು, ಸೌಕರ್ಯಗಳೊಂದಿಗೆ Google Business Profile ಸೆಟಪ್ ಮಾಡಿ.',
          te: 'Google Hotel Pack సెర్చ్ ఫలితాలలో కనిపించడానికి ఫోటోలు, రేట్లు, అమెనిటీలతో Google Business Profile సెటప్ చేయండి.',
          ml: 'Google Hotel Pack സെർച്ച് ഫലങ്ങളിൽ കാണിക്കാൻ ഫോട്ടോകൾ, നിരക്കുകൾ, സൗകര്യങ്ങൾ ഉൾപ്പെടെ Google Business Profile സെറ്റപ്പ് ചെയ്യുക.'
        },
        impact: '55% increase in direct bookings',
        timeline: '1 week'
      });
    }
  }
  
  if (score >= 50 && score < 70) {
    recommendations.push({
      priority: 'medium',
      category: 'seo',
      title: { en: 'Improve Search Rankings', hi: 'सर्च रैंकिंग में सुधार करें', ta: 'தேடல் தரவரிசையை மேம்படுத்துங்கள்', kn: 'ಹುಡುಕಾಟ ಶ್ರೇಣಿ ಸುಧಾರಿಸಿ', te: 'శోధన ర్యాంకింగ్‌లు మెరుగుపరచండి', ml: 'സെർച്ച് റാങ്കിംഗ് മെച്ചപ്പെടുത്തുക' },
      description: { 
        en: 'Optimize your website for local SEO to appear in top search results.',
        hi: 'शीर्ष खोज परिणामों में दिखाई देने के लिए अपनी वेबसाइट को स्थानीय SEO के लिए अनुकूलित करें।',
        ta: 'உயர் தேடல் முடிவுகளில் தோன்ற உங்கள் இணையதளத்தை உள்ளூர் SEO க்கு மேம்படுத்துங்கள்.',
        kn: 'ಉನ್ನತ ಹುಡುಕಾಟ ಫಲಿತಾಂಶಗಳಲ್ಲಿ ಕಾಣಿಸಲು ಸ್ಥಳೀಯ SEO ಗಾಗಿ ವೆಬ್‌ಸೈಟ್ ಆಪ್ಟಿಮೈಜ್ ಮಾಡಿ.',
        te: 'టాప్ సెర్చ్ ఫలితాలలో కనిపించడానికి లోకల్ SEO కోసం వెబ్‌సైట్ ఆప్టిమైజ్ చేయండి.',
        ml: 'ടോപ്പ് സെർച്ച് ഫലങ്ങളിൽ കാണിക്കാൻ ലോക്കൽ SEO-യ്ക്കായി വെബ്സൈറ്റ് ഒപ്റ്റിമൈസ് ചെയ്യുക.'
      },
      impact: '35% increase in organic traffic',
      timeline: '4-6 weeks'
    });
    
    recommendations.push({
      priority: 'medium',
      category: 'reviews',
      title: { en: 'Build Review Strategy', hi: 'समीक्षा रणनीति बनाएं', ta: 'மதிப்பாய்வு மூலோபாயத்தை உருவாக்குங்கள்', kn: 'ವಿಮರ್ಶೆ ತಂತ್ರ ನಿರ್ಮಿಸಿ', te: 'రివ్యూ స్ట్రాటజీ నిర్మించండి', ml: 'റിവ്യൂ സ്ട്രാറ്റജി നിർമ്മിക്കുക' },
      description: { 
        en: 'Encourage satisfied customers to leave reviews. Target 50+ reviews in 3 months.',
        hi: 'संतुष्ट ग्राहकों को समीक्षा छोड़ने के लिए प्रोत्साहित करें। 3 महीनों में 50+ समीक्षाओं का लक्ष्य रखें।',
        ta: 'திருப்தியான வாடிக்கையாளர்களை மதிப்புரைகள் இடும்படி ஊக்குவிக்கவும். 3 மாதங்களில் 50+ மதிப்புரைகள் இலக்கு.',
        kn: 'ತೃಪ್ತ ಗ್ರಾಹಕರನ್ನು ವಿಮರ್ಶೆ ಬಿಡಲು ಪ್ರೋತ್ಸಾಹಿಸಿ. 3 ತಿಂಗಳಲ್ಲಿ 50+ ವಿಮರ್ಶೆಗಳ ಗುರಿ.',
        te: 'సంతృప్తి చెందిన కస్టమర్లను రివ్యూలు ఇవ్వమని ప్రోత్సహించండి. 3 నెలల్లో 50+ రివ్యూల లక్ష్యం.',
        ml: 'സംതൃപ്തരായ ഉപഭോക്താക്കളെ റിവ്യൂ നൽകാൻ പ്രോത്സാഹിപ്പിക്കുക. 3 മാസത്തിൽ 50+ റിവ്യൂകൾ ലക്ഷ്യം.'
      },
      impact: '28% boost in conversion rate',
      timeline: '3 months'
    });
  }
  
  if (score >= 70) {
    recommendations.push({
      priority: 'low',
      category: 'automation',
      title: { en: 'Enable Marketing Automation', hi: 'मार्केटिंग ऑटोमेशन सक्षम करें', ta: 'சந்தைப்படுத்தல் தானியங்குவை இயக்குங்கள்', kn: 'ಮಾರ್ಕೆಟಿಂಗ್ ಆಟೋಮೇಶನ್ ಸಕ್ರಿಯಗೊಳಿಸಿ', te: 'మార్కెటింగ్ ఆటోమేషన్ ఎనేబుల్ చేయండి', ml: 'മാർക്കറ്റിംഗ് ഓട്ടോമേഷൻ എനേബിൾ ചെയ്യുക' },
      description: { 
        en: 'Set up automated campaigns to nurture leads and maximize conversions.',
        hi: 'लीड को पोषित करने और रूपांतरण को अधिकतम करने के लिए स्वचालित अभियान सेट करें।',
        ta: 'வாடிக்கையாளர்களை வளர்க்க மற்றும் மாற்றங்களை அதிகரிக்க தானியங்கு பிரச்சாரங்களை அமைக்கவும்.',
        kn: 'ಲೀಡ್‌ಗಳನ್ನು ಪೋಷಿಸಲು ಮತ್ತು ಪರಿವರ್ತನೆಗಳನ್ನು ಗರಿಷ್ಠಗೊಳಿಸಲು ಸ್ವಯಂಚಾಲಿತ ಅಭಿಯಾನಗಳನ್ನು ಸೆಟಪ್ ಮಾಡಿ.',
        te: 'లీడ్‌లను పెంచడానికి మరియు కన్వర్షన్లను గరిష్టం చేయడానికి ఆటోమేటెడ్ క్యాంపెయిన్లు సెటప్ చేయండి.',
        ml: 'ലീഡുകളെ പരിപോഷിപ്പിക്കാനും കൺവേർഷനുകൾ പരമാവധിയാക്കാനും ഓട്ടോമേറ്റഡ് ക്യാമ്പെയിനുകൾ സെറ്റപ്പ് ചെയ്യുക.'
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
    title: { en: 'Digital Foundation', hi: 'डिजिटल नींव', ta: 'டிஜிட்டல் அடித்தளம்', kn: 'ಡಿಜಿಟಲ್ ಅಡಿಪಾಯ', te: 'డిజిటల్ ఫాండేషన్', ml: 'ഡിജിറ്റൽ ഫൗണ്ടേഷൻ' },
    description: { 
      en: 'Establish your online presence with website and business profiles',
      hi: 'वेबसाइट और व्यवसाय प्रोफाइल के साथ अपनी ऑनलाइन उपस्थिति स्थापित करें',
      ta: 'இணையதளம் மற்றும் வணிக சுயவிவரங்களுடன் உங்கள் இணைய இருப்பை நிறுவவும்',
      kn: 'ವೆಬ್‌ಸೈಟ್ ಮತ್ತು ವ್ಯಾಪಾರ ಪ್ರೊಫೈಲ್‌ಗಳೊಂದಿಗೆ ಆನ್‌ಲೈನ್ ಉಪಸ್ಥಿತಿ ಸ್ಥಾಪಿಸಿ',
      te: 'వెబ్‌సైట్ మరియు బిజినెస్ ప్రొఫైల్‌లతో ఆన్‌లైన్ ఉనికిని ఏర్పాటు చేయండి',
      ml: 'വെബ്സൈറ്റും ബിസിനസ് പ്രൊഫൈലുകളും ഉപയോഗിച്ച് ഓൺലൈൻ സാന്നിധ്യം സ്ഥാപിക്കുക'
    },
    tasks: [
      { id: 'website', label: { en: 'Launch Professional Website', hi: 'पेशेवर वेबसाइट लॉच करें', ta: 'தொழில்முறை இணையதளத்தை தொடங்குங்கள்', kn: 'ವೃತ್ತಿಪರ ವೆಬ್‌ಸೈಟ್ ಪ್ರಾರಂಭಿಸಿ', te: 'ప్రొఫెషనల్ వెబ్‌సైట్ లాంచ్', ml: 'പ്രൊഫഷണൽ വെബ്സൈറ്റ് ലോഞ്ച്' } },
      { id: 'google', label: { en: 'Setup Google Business Profile', hi: 'Google Business प्रोफाइल सेटअप करें', ta: 'Google வணிக சுயவிவரத்தை அமைக்கவும்', kn: 'Google Business ಪ್ರೊಫೈಲ್ ಸೆಟಪ್', te: 'Google Business ప్రొఫైల్ సెటప్', ml: 'Google Business പ്രൊഫൈൽ സെറ്റപ്പ്' } },
      { id: 'social', label: { en: 'Create Social Media Accounts', hi: 'सोशल मीडिया खाते बनाएं', ta: 'சமூக ஊடக கணக்குகளை உருவாக்குங்கள்', kn: 'ಸೋಶಿಯಲ್ ಮೀಡಿಯಾ ಖಾತೆಗಳನ್ನು ರಚಿಸಿ', te: 'సోషల్ మీడియా ఖాతాలు సృష్టించండి', ml: 'സോഷ്യൽ മീഡിയ അക്കൗണ്ടുകൾ സൃഷ്ടിക്കുക' } }
    ]
  },
  {
    id: 2,
    title: { en: 'Content & Visibility', hi: 'सामग्री और दृश्यता', ta: 'உள்ளடக்கம் மற்றும் தெரிவுநிலை', kn: 'ವಿಷಯ ಮತ್ತು ಗೋಚರತೆ', te: 'కంటెంట్ & విజిబిలిటీ', ml: 'കാണ്ടന്റ് & വിസിബിലിറ്റി' },
    description: { 
      en: 'Build content strategy and improve search visibility',
      hi: 'सामग्री रणनीति बनाएं और खोज दृश्यता में सुधार करें',
      ta: 'உள்ளடக்க மூலோபாயத்தை உருவாக்கி தேடல் தெரிவுநிலையை மேம்படுத்துங்கள்',
      kn: 'ವಿಷಯ ತಂತ್ರ ರಚಿಸಿ ಮತ್ತು ಹುಡುಕಾಟ ಗೋಚರತೆ ಸುಧಾರಿಸಿ',
      te: 'కంటెంట్ స్ట్రాటజీని నిర్మించండి మరియు సెర్చ్ విజిబిలిటీ మెరుగుపరచండి',
      ml: 'കാണ്ടന്റ് സ്ട്രാറ്റജി നിർമ്മിക്കുകയും സെർച്ച് വിസിബിലിറ്റി മെച്ചപ്പെടുത്തുക'
    },
    tasks: [
      { id: 'seo', label: { en: 'Optimize for Local SEO', hi: 'स्थानीय SEO के लिए अनुकूलन', ta: 'உள்ளூர் SEO க்கு மேம்படைத்துங்கள்', kn: 'ಸ್ಥಳೀಯ SEO ಗಾಗಿ ಆಪ್ಟಿಮೈಜ್', te: 'లోకల్ SEO కోసం ఆప్టిమైజ్', ml: 'ലോക്കൽ SEO-യ്ക്കായി ഒപ്റ്റിമൈസ്' } },
      { id: 'content', label: { en: 'Publish Regular Content', hi: 'नियमित सामग्री प्रकाशित करें', ta: 'வழக்கமான உள்ளடக்கத்தை வெளியிடுங்கள்', kn: 'ನಿಯಮಿತ ವಿಷಯ ಪ್ರಕಟಿಸಿ', te: 'క్రమం తప్పకుండా కంటెంట్ పబ్లిష్', ml: 'പതിവായി കാണ്ടന്റ് പ്രസിദ്ധീകരിക്കുക' } },
      { id: 'reviews', label: { en: 'Generate Customer Reviews', hi: 'ग्राहक समीक्षाएं उत्पन्न करें', ta: 'வாடிக்கையாளர் மதிப்புரைகளை உருவாக்குங்கள்', kn: 'ಗ್ರಾಹಕ ವಿಮರ್ಶೆಗಳನ್ನು ರಚಿಸಿ', te: 'కస్టమర్ రివ్యూలు జెనరేట్', ml: 'കസ്റ്റമർ റിവ്യൂകൾ ജനറേറ്റ്' } }
    ]
  },
  {
    id: 3,
    title: { en: 'Lead Generation', hi: 'लीड जेनरेशन', ta: 'வாடிக்கையாளர் உருவாக்கம்', kn: 'ಲೀಡ್ ಜನರೇಶನ್', te: 'లీడ్ జెనరేషన్', ml: 'ലീഡ് ജനറേഷൻ' },
    description: { 
      en: 'Implement systems to capture and nurture leads',
      hi: 'लीड कैप्चर और पोषित करने के लिए सिस्टम लागू करें',
      ta: 'வாடிக்கையாளர்களைப் பிடிக்க மற்றும் வளர்க்க அமைப்புக்களை செயல்படுத்துங்கள்',
      kn: 'ಲೀಡ್‌ಗಳನ್ನು ಸೆರೆಹಿಡಿಯಲು ಮತ್ತು ಪೋಷಿಸಲು ವ್ಯವಸ್ಥೆಗಳನ್ನು ಅನುಷ್ಠಾನಗೊಳಿಸಿ',
      te: 'లీడ్‌లను క్యాప్చర్ చేయడానికి మరియు పెంచడానికి వ్యవస్థలను అమలు చేయండి',
      ml: 'ലീഡുകളെ ക്യാപ്ചർ ചെയ്യാനും പരിപോഷിപ്പിക്കാനും സിസ്റ്റം നടപ്പിലാക്കുക'
    },
    tasks: [
      { id: 'forms', label: { en: 'Setup Lead Capture Forms', hi: 'लीड कैप्चर फॉर्म सेटअप करें', ta: 'வாடிக்கையாளர் பிடிப்பு படிவங்களை அமைக்கவும்', kn: 'ಲೀಡ್ ಕ್ಯಾಪ್ಚರ್ ಫಾರ್ಮ್ ಸೆಟಪ್', te: 'లీడ్ క్యాప్చర్ ఫార్మ్‌లు సెటప్', ml: 'ലീഡ് ക്യാപ്ചർ ഫോം സെറ്റപ്പ്' } },
      { id: 'chatbot', label: { en: 'Enable AI Chatbot', hi: 'AI चैटबॉट सक्षम करें', ta: 'AI chatbot ஐ இயக்குங்கள்', kn: 'AI ಚಾಟ್‌ಬಾಟ್ ಸಕ್ರಿಯಗೊಳಿಸಿ', te: 'AI చాట్‌బాట్ ఎనేబుల్', ml: 'AI ചാറ്റ്ബോട്ട് എനേബിൾ' } },
      { id: 'email', label: { en: 'Launch Email Campaigns', hi: 'ईमेल अभियान लॉच करें', ta: 'மின்னஞ்சல் பிரச்சாரங்களை தொடங்குங்கள்', kn: 'ಇಮೇಲ್ ಅಭಿಯಾನ ಪ್ರಾರಂಭಿಸಿ', te: 'ఇమెయిల్ క్యాంపెయిన్లు లాంచ్', ml: 'ഇമെയിൽ ക്യാമ്പെയിനുകൾ ലോഞ്ച്' } }
    ]
  },
  {
    id: 4,
    title: { en: 'Marketing Automation', hi: 'मार्केटिंग ऑटोमेशन', ta: 'சந்தைப்படுத்தல் தானியங்கு', kn: 'ಮಾರ್ಕೆಟಿಂಗ್ ಆಟೋಮೇಶನ್', te: 'మార్కెటింగ్ ఆటోమేషన్', ml: 'മാർക്കറ്റിംഗ് ഓട്ടോമേഷൻ' },
    description: { 
      en: 'Automate marketing and engagement workflows',
      hi: 'मार्केटिंग और एंगेजमेंट वर्कफ़्लो को स्वचालित करें',
      ta: 'சந்தைப்படுத்தல் மற்றும் ஈடுபாடு பணிப்பாய்வுகளை தானியங்குவாக்குங்கள்',
      kn: 'ಮಾರ್ಕೆಟಿಂಗ್ ಮತ್ತು ಎಂಗೇಜ್‌ಮೆಂಟ್ ವರ್ಕ್‌ಫ್ಲೋಗಳನ್ನು ಸ್ವಯಂಚಾಲಿತಗೊಳಿಸಿ',
      te: 'మార్కెటింగ్ మరియు ఎంగేజ్‌మెంట్ వర్క్‌ఫ్లోలను ఆటోమేట్ చేయండి',
      ml: 'മാർക്കറ്റിംഗും എൻഗേജ്മെന്റ് വർക്ക്ഫ്ലോകളും ഓട്ടോമേറ്റ് ചെയ്യുക'
    },
    tasks: [
      { id: 'automation', label: { en: 'Setup Campaign Automation', hi: 'कैंपेन ऑटोमेशन सेटअप करें', ta: 'பிரச்சார தானியங்குவாக்கத்தை அமைக்கவும்', kn: 'ಅಭಿಯಾನ ಆಟೋಮೇಶನ್ ಸೆಟಪ್', te: 'క్యాంపెయిన్ ఆటోమేషన్ సెటప్', ml: 'ക്യാംപെയിൻ ഓട്ടോമേഷൻ സെറ്റപ്പ്' } },
      { id: 'retargeting', label: { en: 'Enable Retargeting Ads', hi: 'रीटार्गेटिंग विज्ञापन सक्षम करें', ta: 'மறுஇலக்கு விளம்பரங்களை இயக்குங்கள்', kn: 'ರೀಟಾರ್ಗೆಟಿಂಗ್ ಜಾಹೀರಾತುಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ', te: 'రీటార్గెటింగ్ యాడ్‌లు ఎనేబుల్', ml: 'റീടാർഗട്ടിംഗ് ആഡ്സ് എനേബിൾ' } },
      { id: 'analytics', label: { en: 'Track Performance Metrics', hi: 'प्रदर्शन मेट्रिक्स ट्रैक करें', ta: 'செயல்திறன் அளவீடுகளைக் கண்காணிக்கவும்', kn: 'ಕಾರ್ಯಕ್ಷಮತೆ ಅಂಕಿಅಂಶಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ', te: 'పర్ఫార్మెన్స్ మెట్రిక్స్ ట్రాక్', ml: 'പർഫോമൻസ് മെട്രിക്സ് ട്രാക്ക്' } }
    ]
  },
  {
    id: 5,
    title: { en: 'Scale & Optimize', hi: 'स्केल और अनुकूलन', ta: 'அளவிடுதல் மற்றும் மேம்படுத்தல்', kn: 'ಸ್ಕೇಲ್ ಮತ್ತು ಆಪ್ಟಿಮೈಜ್', te: 'స్కేల్ & ఆప్టిమైజ్', ml: 'സ്കെയിൽ & ഒപ്റ്റിമൈസ്' },
    description: { 
      en: 'Optimize conversion rates and scale revenue growth',
      hi: 'रूपांतरण दरों को अनुकूलित करें और राजस्व वृद्धि को स्केल करें',
      ta: 'மாற்ற விகிதங்களை மேம்படுத்தி வருவாய் வளர்ச்சியை அளவிடுங்கள்',
      kn: 'ಪರಿವರ್ತನೆ ದರಗಳನ್ನು ಆಪ್ಟಿಮೈಜ್ ಮಾಡಿ ಆದಾಯ ಬೆಳವಣಿಗೆಯನ್ನು ಸ್ಕೇಲ್ ಮಾಡಿ',
      te: 'కన్వర్షన్ రేట్లను ఆప్టిమైజ్ చేయండి మరియు రెవెన్యూ గ్రోత్ను స్కేల్',
      ml: 'കൺവേർഷൻ റേറ്റുകൾ ഒപ്റ്റിമൈസ് ചെയ്ത് റവന്യൂ ഗ്രോത്ത് സ്കെയിൽ ചെയ്യുക'
    },
    tasks: [
      { id: 'ab-testing', label: { en: 'Run A/B Testing', hi: 'A/B टेस्टिंग चलाएं', ta: 'A/B சோதனையை இயக்குங்கள்', kn: 'A/B ಪರೀಕ್ಷೆ ನಡೆಸಿ', te: 'A/B టెస్టింగ్ రన్', ml: 'A/B ടെസ്റ്റിംഗ് നടത്തുക' } },
      { id: 'expansion', label: { en: 'Expand to New Markets', hi: 'नए बाजारों में विस्तार करें', ta: 'புதிய சந்தைகளுக்கு விரிவாக்குங்கள்', kn: 'ಹೊಸ ಮಾರುಕಟ್ಟೆಗಳಿಗೆ ವಿಸ್ತರಿಸಿ', te: 'కొత్త మార్కెట్లకు విస్తరించండి', ml: 'പുതിയ മാർക്കറ്റുകളിലേക്ക് വിസ്തരിക്കുക' } },
      { id: 'revenue', label: { en: 'Achieve 4x Revenue Growth', hi: '4x राजस्व वृद्धि प्राप्त करें', ta: '4x வருவாய் வளர்ச்சியை அடையுங்கள்', kn: '4x ಆದಾಯ ಬೆಳವಣಿಗೆ ಸಾಧಿಸಿ', te: '4x రెవెన్యూ గ్రోత్ సాధించండి', ml: '4x റவന്യൂ ഗ്രോത്ത് നേടുക' } }
    ]
  }
];

/* ══════════════════════════════════════════
   WEBSITE TEMPLATES (per business category)
   ══════════════════════════════════════════ */
export const websiteTemplates = {
  restaurant: [
    { id: 'rest-1', name: 'Spice & Dine', preview: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop', colors: ['#8B4513','#FFD700','#1a1a1a'], sections: ['hero','menu','gallery','reviews','contact','reservation'] },
    { id: 'rest-2', name: 'Cloud Kitchen', preview: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop', colors: ['#e63946','#f1faee','#457b9d'], sections: ['hero','specials','delivery','about','contact'] },
    { id: 'rest-3', name: 'Fine Dining', preview: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop', colors: ['#2d2d2d','#c9a96e','#ffffff'], sections: ['hero','chef','menu','ambience','reservation','events'] },
  ],
  retail: [
    { id: 'ret-1', name: 'ShopFront', preview: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop', colors: ['#1d3557','#e63946','#f1faee'], sections: ['hero','products','categories','offers','reviews','contact'] },
    { id: 'ret-2', name: 'Boutique', preview: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&h=400&fit=crop', colors: ['#6b4c3b','#f5e6d3','#2c2c2c'], sections: ['hero','collection','lookbook','testimonials','contact'] },
    { id: 'ret-3', name: 'Mart Express', preview: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&h=400&fit=crop', colors: ['#00b894','#fdcb6e','#2d3436'], sections: ['hero','deals','categories','delivery','contact'] },
  ],
  salon: [
    { id: 'sal-1', name: 'Glow Studio', preview: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop', colors: ['#d4a5a5','#392929','#ffffff'], sections: ['hero','services','pricing','gallery','booking','contact'] },
    { id: 'sal-2', name: 'Urban Cuts', preview: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&h=400&fit=crop', colors: ['#1a1a2e','#e94560','#f5f5f5'], sections: ['hero','services','team','portfolio','reviews','booking'] },
  ],
  gym: [
    { id: 'gym-1', name: 'FitForce', preview: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop', colors: ['#ff4757','#2f3542','#ffffff'], sections: ['hero','programs','trainers','pricing','gallery','contact'] },
  ],
  medical: [
    { id: 'med-1', name: 'HealthFirst', preview: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop', colors: ['#00b4d8','#0077b6','#ffffff'], sections: ['hero','services','doctors','hours','insurance','contact'] },
  ],
  education: [
    { id: 'edu-1', name: 'LearnHub', preview: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop', colors: ['#6c5ce7','#fdcb6e','#ffffff'], sections: ['hero','courses','faculty','testimonials','enrollment','contact'] },
  ],
  professional: [
    { id: 'pro-1', name: 'ConsultPro', preview: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop', colors: ['#2d3436','#0984e3','#dfe6e9'], sections: ['hero','services','portfolio','team','testimonials','contact'] },
  ],
  automotive: [
    { id: 'auto-1', name: 'AutoZone', preview: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop', colors: ['#e17055','#2d3436','#dfe6e9'], sections: ['hero','services','inventory','reviews','booking','contact'] },
  ],
  hotel: [
    { id: 'hotel-1', name: 'Grand Hospitality', preview: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop', colors: ['#1a1a2e','#c9a96e','#f5f5f5'], sections: ['hero','rooms','amenities','gallery','reviews','booking','contact'] },
    { id: 'hotel-2', name: 'Modern Stay', preview: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop', colors: ['#0c2461','#e58e26','#ffffff'], sections: ['hero','rooms','dining','spa','events','reviews','location'] },
    { id: 'hotel-3', name: 'Budget Comfort', preview: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop', colors: ['#2d3436','#00b894','#f8f9fa'], sections: ['hero','rooms','rates','facilities','nearby','booking','contact'] },
  ],
};

/* ══════════════════════════════════════════
   CONTENT TEMPLATES (Canva-style)
   ══════════════════════════════════════════ */
export const contentTemplates = [
  { id: 'ct-1', type: 'poster', name: 'Grand Opening', category: 'promotion', aspect: '1:1', thumb: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=300&fit=crop', colors: ['#e63946','#f1faee'], tags: ['launch','opening','celebration'] },
  { id: 'ct-2', type: 'poster', name: 'Festival Sale', category: 'promotion', aspect: '1:1', thumb: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=300&h=300&fit=crop', colors: ['#ff6b6b','#feca57'], tags: ['sale','diwali','festive'] },
  { id: 'ct-3', type: 'story', name: 'Daily Special', category: 'restaurant', aspect: '9:16', thumb: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=533&fit=crop', colors: ['#1a1a1a','#ff6348'], tags: ['food','daily','special'] },
  { id: 'ct-4', type: 'banner', name: 'Discount Banner', category: 'promotion', aspect: '16:9', thumb: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=338&fit=crop', colors: ['#6c5ce7','#00cec9'], tags: ['discount','offer','banner'] },
  { id: 'ct-5', type: 'poster', name: 'Customer Review', category: 'social', aspect: '1:1', thumb: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=300&fit=crop', colors: ['#0984e3','#ffffff'], tags: ['review','testimonial','trust'] },
  { id: 'ct-6', type: 'video', name: 'Product Showcase', category: 'product', aspect: '16:9', thumb: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=338&fit=crop', colors: ['#2d3436','#e17055'], tags: ['product','video','showcase'] },
  { id: 'ct-7', type: 'story', name: 'Behind The Scenes', category: 'social', aspect: '9:16', thumb: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=300&h=533&fit=crop', colors: ['#636e72','#b2bec3'], tags: ['bts','culture','team'] },
  { id: 'ct-8', type: 'poster', name: 'New Arrival', category: 'product', aspect: '4:5', thumb: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=375&fit=crop', colors: ['#fd79a8','#e84393'], tags: ['new','arrival','launch'] },
  { id: 'ct-9', type: 'carousel', name: 'Tips & Tricks', category: 'education', aspect: '1:1', thumb: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=300&fit=crop', colors: ['#00b894','#55efc4'], tags: ['tips','education','how-to'] },
  { id: 'ct-10', type: 'poster', name: 'Happy Customer', category: 'social', aspect: '1:1', thumb: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&h=300&fit=crop', colors: ['#fdcb6e','#e17055'], tags: ['happy','customer','ugc'] },
  { id: 'ct-11', type: 'video', name: 'Reel Template', category: 'social', aspect: '9:16', thumb: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=533&fit=crop', colors: ['#a29bfe','#6c5ce7'], tags: ['reel','trending','viral'] },
  { id: 'ct-12', type: 'banner', name: 'Hiring Post', category: 'business', aspect: '16:9', thumb: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&h=338&fit=crop', colors: ['#0984e3','#74b9ff'], tags: ['hiring','job','team'] },
];

/* ══════════════════════════════════════════
   LEAD DATABASE (ZoomInfo + 6Sense style)
   ══════════════════════════════════════════ */
const leadStages = ['new','contacted','qualified','proposal','negotiation','won','lost'];
const intentLevels = ['low','medium','high','surging'];
const buyerJourneyStages = ['awareness','consideration','decision','purchase'];
const channels = ['Website','Google Ads','Facebook','Instagram','Referral','Walk-in','WhatsApp','Email Campaign','LinkedIn','Cold Outreach'];

/* ── Hotel-specific lead generator ── */
const generateHotelLeadData = () => {
  const hotelCompanies = [
    { name: 'MakeMyTrip Corporate', domain: 'makemytrip.com', employees: 5200, revenue: '₹4800Cr', industry: 'OTA / Online Travel', city: 'Gurgaon', tech: ['Custom CRS','AWS','Salesforce'] },
    { name: 'Goibibo Business Travel', domain: 'goibibo.com', employees: 1800, revenue: '₹1200Cr', industry: 'OTA / Online Travel', city: 'Bangalore', tech: ['GCP','React','Elasticsearch'] },
    { name: 'Yatra.com Hotels Div', domain: 'yatra.com', employees: 900, revenue: '₹580Cr', industry: 'OTA / Online Travel', city: 'Gurgaon', tech: ['Azure','Custom PMS'] },
    { name: 'Cleartrip for Business', domain: 'cleartrip.com', employees: 650, revenue: '₹320Cr', industry: 'OTA / Online Travel', city: 'Mumbai', tech: ['AWS','Kubernetes'] },
    { name: 'Royal Events & Weddings', domain: 'royalevents.in', employees: 45, revenue: '₹6.5Cr', industry: 'Wedding Planning', city: 'Delhi', tech: ['Zoho CRM','Google Workspace'] },
    { name: 'Dreamz Wedding Planners', domain: 'dreamzweddings.co.in', employees: 28, revenue: '₹3.8Cr', industry: 'Wedding Planning', city: 'Jaipur', tech: ['WordPress','WhatsApp Business'] },
    { name: 'Shaadi Celebrations Co', domain: 'shaadicelebrations.com', employees: 35, revenue: '₹4.2Cr', industry: 'Wedding Planning', city: 'Hyderabad', tech: ['Canva','Instagram API'] },
    { name: 'Infosys Corporate Travel', domain: 'infosys.com', employees: 340000, revenue: '₹146000Cr', industry: 'IT / Corporate', city: 'Bangalore', tech: ['SAP Concur','Oracle'] },
    { name: 'TCS Conference Division', domain: 'tcs.com', employees: 614000, revenue: '₹225000Cr', industry: 'IT / Corporate', city: 'Mumbai', tech: ['SAP','ServiceNow'] },
    { name: 'Wipro Travel Desk', domain: 'wipro.com', employees: 250000, revenue: '₹90000Cr', industry: 'IT / Corporate', city: 'Bangalore', tech: ['SAP Concur','AWS'] },
    { name: 'Thomas Cook India', domain: 'thomascook.in', employees: 2200, revenue: '₹5500Cr', industry: 'Travel Agency', city: 'Mumbai', tech: ['Amadeus','Salesforce','Custom Portal'] },
    { name: 'Cox & Kings Holidays', domain: 'coxandkings.com', employees: 1100, revenue: '₹2800Cr', industry: 'Travel Agency', city: 'Mumbai', tech: ['Galileo','Custom CRM'] },
    { name: 'SOTC Travel', domain: 'sotc.in', employees: 800, revenue: '₹1500Cr', industry: 'Travel Agency', city: 'Mumbai', tech: ['Amadeus','Zoho'] },
    { name: 'Thrillophilia Adventures', domain: 'thrillophilia.com', employees: 180, revenue: '₹85Cr', industry: 'Experience Platform', city: 'Ahmedabad', tech: ['React','Node.js','PostgreSQL'] },
    { name: 'Zostel Backpackers', domain: 'zostel.com', employees: 320, revenue: '₹120Cr', industry: 'Hostel Chain', city: 'Jaipur', tech: ['Custom PMS','Stripe','React'] },
    { name: 'OYO Rooms Regional', domain: 'oyorooms.com', employees: 15000, revenue: '₹16000Cr', industry: 'Hotel Aggregator', city: 'Gurgaon', tech: ['Custom PMS','AWS','ML Stack'] },
    { name: 'FabHotels Division', domain: 'fabhotels.com', employees: 400, revenue: '₹280Cr', industry: 'Hotel Aggregator', city: 'Noida', tech: ['Python','GCP','Razorpay'] },
    { name: 'Treebo Hotels Partners', domain: 'treebo.com', employees: 500, revenue: '₹350Cr', industry: 'Hotel Chain', city: 'Bangalore', tech: ['Custom PMS','AWS','Angular'] },
    { name: 'Lemon Tree Procurement', domain: 'lemontreehotels.com', employees: 8000, revenue: '₹1800Cr', industry: 'Hotel Chain', city: 'Delhi', tech: ['Oracle Opera','Salesforce'] },
    { name: 'Kolkata Film Festival Board', domain: 'kff.gov.in', employees: 60, revenue: '₹12Cr', industry: 'Events & Conferences', city: 'Kolkata', tech: ['WordPress','Government Portal'] },
  ];

  const hotelContacts = [
    'Vikram Malhotra','Priyanka Singhania','Rajesh Mehra','Anita Deshmukh','Sunil Kapoor','Neha Bhatia',
    'Aakash Jain','Kavitha Nair','Sameer Patel','Ritu Agarwal','Harish Reddy','Simran Kaur',
    'Manish Tiwari','Deepa Iyer','Rohit Saxena','Anuradha Menon','Sanjay Gupta','Pooja Raghavan',
    'Amit Sharma','Divya Pillai',
  ];
  const hotelTitles = [
    'VP Partnerships','Hotel Relations Manager','Corporate Travel Manager','Wedding Coordinator','Business Development Head',
    'Procurement Manager','Travel Desk Manager','Events Director','Regional Manager','Supply Head',
    'Partner Relations Lead','Sr. Travel Consultant','Conference Organizer','Operations Head','Acquisitions Manager',
    'Revenue Manager','Key Account Manager','Hospitality Consultant','Channel Manager','Partnership Lead',
  ];

  return hotelCompanies.map((co, i) => {
    const stageIdx = Math.floor(Math.random() * leadStages.length);
    const intentIdx = Math.floor(Math.random() * intentLevels.length);
    const bjIdx = Math.floor(Math.random() * buyerJourneyStages.length);
    const channelIdx = Math.floor(Math.random() * channels.length);
    const intentScore = [22, 48, 72, 93][intentIdx];
    const fitScore = 40 + Math.floor(Math.random() * 55);
    const dealValue = Math.floor(Math.random() * 800000) + 75000;
    const daysAgo = Math.floor(Math.random() * 90);
    const lastActivity = Math.floor(Math.random() * 14);
    const touchpoints = Math.floor(Math.random() * 15) + 1;

    return {
      id: `lead-${i + 1}`,
      company: co,
      contact: {
        name: hotelContacts[i],
        title: hotelTitles[i],
        email: `${hotelContacts[i].split(' ')[0].toLowerCase()}@${co.domain}`,
        phone: `+91 ${9800000000 + Math.floor(Math.random() * 199999999)}`
      },
      stage: leadStages[stageIdx],
      intent: intentLevels[intentIdx],
      intentScore,
      fitScore,
      combinedScore: Math.round((intentScore * 0.6) + (fitScore * 0.4)),
      buyerJourney: buyerJourneyStages[bjIdx],
      channel: channels[channelIdx],
      dealValue,
      probability: stageIdx <= 1 ? 15 : stageIdx <= 3 ? 45 : stageIdx <= 4 ? 70 : stageIdx === 5 ? 100 : 0,
      weightedValue: Math.round(dealValue * (stageIdx <= 1 ? 0.15 : stageIdx <= 3 ? 0.45 : stageIdx <= 4 ? 0.7 : stageIdx === 5 ? 1 : 0)),
      createdDaysAgo: daysAgo,
      lastActivityDaysAgo: lastActivity,
      touchpoints,
      activities: [
        { type: 'page_view', label: 'Viewed room rates & packages', time: `${lastActivity}d ago` },
        { type: 'email', label: 'Opened partnership proposal', time: `${lastActivity + 1}d ago` },
        { type: 'download', label: 'Downloaded hotel brochure', time: `${lastActivity + 3}d ago` },
      ],
      signals: intentIdx >= 2
        ? ['Looking for bulk room bookings', 'Budget approved for Q1', 'Event date finalized', 'Comparing 3 hotel vendors']
        : ['Early research phase', 'Browsing options'],
    };
  });
};

export const generateLeadData = (category) => {
  // Hotel-specific leads: travel agencies, corporate clients, wedding planners, OTAs etc.
  if (category === 'hotel') {
    return generateHotelLeadData();
  }
  
  const companies = [
    { name: 'Apex Industries Pvt Ltd', domain: 'apexindustries.in', employees: 120, revenue: '₹8.5Cr', industry: 'Manufacturing', city: 'Pune', tech: ['SAP','Tally','WordPress'] },
    { name: 'Green Valley Organics', domain: 'greenvalleyorg.com', employees: 35, revenue: '₹2.1Cr', industry: 'Agriculture', city: 'Bangalore', tech: ['Shopify','Google Workspace'] },
    { name: 'Metro Healthcare', domain: 'metrohealthcare.in', employees: 250, revenue: '₹22Cr', industry: 'Healthcare', city: 'Mumbai', tech: ['Salesforce','AWS','HIS System'] },
    { name: 'Digital Dreams Studio', domain: 'digitaldreams.co.in', employees: 18, revenue: '₹95L', industry: 'Media', city: 'Hyderabad', tech: ['Adobe CC','Figma','Notion'] },
    { name: 'Bharat Textiles', domain: 'bharattextiles.com', employees: 450, revenue: '₹45Cr', industry: 'Textile', city: 'Surat', tech: ['Oracle ERP','Zoho'] },
    { name: 'QuickBite Foods', domain: 'quickbitefoods.in', employees: 80, revenue: '₹5.2Cr', industry: 'F&B', city: 'Delhi', tech: ['Zomato','Swiggy POS','Razorpay'] },
    { name: 'CloudNet Solutions', domain: 'cloudnetsol.com', employees: 65, revenue: '₹4.8Cr', industry: 'IT Services', city: 'Chennai', tech: ['AWS','GCP','Jira'] },
    { name: 'Royal Jewellers', domain: 'royaljewellers.in', employees: 25, revenue: '₹12Cr', industry: 'Retail', city: 'Jaipur', tech: ['Custom ERP','WhatsApp Business'] },
    { name: 'EduSpark Academy', domain: 'eduspark.edu.in', employees: 40, revenue: '₹1.8Cr', industry: 'Education', city: 'Kochi', tech: ['Moodle','Zoom','Google Classroom'] },
    { name: 'AutoServe Motors', domain: 'autoservemotors.com', employees: 55, revenue: '₹3.5Cr', industry: 'Automotive', city: 'Ahmedabad', tech: ['DMS System','Tally'] },
    { name: 'Sunrise Realty', domain: 'sunriserealty.in', employees: 30, revenue: '₹18Cr', industry: 'Real Estate', city: 'Gurgaon', tech: ['Salesforce','MagicBricks'] },
    { name: 'FreshMart Groceries', domain: 'freshmartgroceries.in', employees: 200, revenue: '₹15Cr', industry: 'Retail', city: 'Bangalore', tech: ['BigBasket API','SAP','Android POS'] },
    { name: 'Priya Constructions', domain: 'priyaconstructions.com', employees: 180, revenue: '₹35Cr', industry: 'Construction', city: 'Hyderabad', tech: ['Primavera','AutoCAD','Tally'] },
    { name: 'TechVista Labs', domain: 'techvistalabs.in', employees: 90, revenue: '₹7.2Cr', industry: 'IT Services', city: 'Pune', tech: ['Azure','Docker','React'] },
    { name: 'Nimbus Logistics', domain: 'nimbuslogistics.co.in', employees: 150, revenue: '₹12.5Cr', industry: 'Logistics', city: 'Mumbai', tech: ['Fleet Management','SAP TM'] },
    { name: 'Kaveri Pharma', domain: 'kaveripharma.in', employees: 320, revenue: '₹28Cr', industry: 'Pharma', city: 'Chennai', tech: ['Oracle ERP','LIMS'] },
  ];

  const contacts = [
    'Rajesh Kumar','Priya Sharma','Arun Patel','Deepika Nair','Vikram Singh','Ananya Rao',
    'Mohammed Irfan','Sneha Menon','Karthik Reddy','Lakshmi Iyer','Arjun Desai','Meera Joshi',
    'Rahul Gupta','Divya Krishnan','Suresh Babu','Pooja Agarwal',
  ];
  const titles = ['CEO','CTO','Marketing Head','Operations Manager','Founder','CFO','VP Sales','Product Manager','Growth Lead','Digital Head'];

  return companies.map((co, i) => {
    const stageIdx = Math.floor(Math.random() * leadStages.length);
    const intentIdx = Math.floor(Math.random() * intentLevels.length);
    const bjIdx = Math.floor(Math.random() * buyerJourneyStages.length);
    const channelIdx = Math.floor(Math.random() * channels.length);
    const intentScore = [22, 48, 72, 93][intentIdx];
    const fitScore = 40 + Math.floor(Math.random() * 55);
    const dealValue = Math.floor(Math.random() * 500000) + 50000;
    const daysAgo = Math.floor(Math.random() * 90);
    const lastActivity = Math.floor(Math.random() * 14);
    const touchpoints = Math.floor(Math.random() * 15) + 1;

    return {
      id: `lead-${i + 1}`,
      company: co,
      contact: { name: contacts[i], title: titles[i % titles.length], email: `${contacts[i].split(' ')[0].toLowerCase()}@${co.domain}`, phone: `+91 ${9800000000 + Math.floor(Math.random() * 199999999)}` },
      stage: leadStages[stageIdx],
      intent: intentLevels[intentIdx],
      intentScore,
      fitScore,
      combinedScore: Math.round((intentScore * 0.6) + (fitScore * 0.4)),
      buyerJourney: buyerJourneyStages[bjIdx],
      channel: channels[channelIdx],
      dealValue,
      probability: stageIdx <= 1 ? 15 : stageIdx <= 3 ? 45 : stageIdx <= 4 ? 70 : stageIdx === 5 ? 100 : 0,
      weightedValue: Math.round(dealValue * (stageIdx <= 1 ? 0.15 : stageIdx <= 3 ? 0.45 : stageIdx <= 4 ? 0.7 : stageIdx === 5 ? 1 : 0)),
      createdDaysAgo: daysAgo,
      lastActivityDaysAgo: lastActivity,
      touchpoints,
      activities: [
        { type: 'page_view', label: 'Viewed pricing page', time: `${lastActivity}d ago` },
        { type: 'email', label: 'Opened campaign email', time: `${lastActivity + 1}d ago` },
        { type: 'download', label: 'Downloaded brochure', time: `${lastActivity + 3}d ago` },
      ],
      signals: intentIdx >= 2 ? ['Researching competitors', 'Budget allocated', 'Decision timeline Q1'] : ['Early research phase'],
    };
  });
};

/* pipeline summary helper */
export const getPipelineSummary = (leads) => {
  const stages = {};
  leadStages.forEach(s => { stages[s] = { count: 0, value: 0, weighted: 0 }; });
  leads.forEach(l => {
    stages[l.stage].count++;
    stages[l.stage].value += l.dealValue;
    stages[l.stage].weighted += l.weightedValue;
  });
  return { stages, stageOrder: leadStages };
};

/* ══════════════════════════════════════════
   AUTOMATION TASKS (background processes)
   ══════════════════════════════════════════ */
export const automationTasks = [
  { id: 'auto-1', name: 'Social Media Auto-Post', status: 'running', type: 'social', schedule: 'Daily 10 AM', reach: '2.4K', lastRun: '2h ago', icon: '📱' },
  { id: 'auto-2', name: 'Google Reviews Request', status: 'running', type: 'reviews', schedule: 'After each visit', sent: 45, responded: 18, lastRun: '30m ago', icon: '⭐' },
  { id: 'auto-3', name: 'Lead Nurture Emails', status: 'running', type: 'email', schedule: 'Every 3 days', sent: 128, opened: 67, clicked: 23, lastRun: '1d ago', icon: '📧' },
  { id: 'auto-4', name: 'Website SEO Monitor', status: 'running', type: 'seo', schedule: 'Every 6h', score: 72, issues: 3, lastRun: '4h ago', icon: '🔍' },
  { id: 'auto-5', name: 'Competitor Price Tracker', status: 'running', type: 'competitor', schedule: 'Daily', tracked: 5, alerts: 2, lastRun: '6h ago', icon: '📊' },
  { id: 'auto-6', name: 'WhatsApp Auto-Reply', status: 'running', type: 'chat', schedule: 'Always on', replied: 84, avgResponse: '< 1m', lastRun: 'Now', icon: '💬' },
  { id: 'auto-7', name: 'Invoice Generator', status: 'paused', type: 'billing', schedule: 'On order', generated: 34, pending: 2, lastRun: '3d ago', icon: '🧾' },
  { id: 'auto-8', name: 'Ad Campaign Manager', status: 'running', type: 'ads', schedule: 'Continuous', spend: '₹12,400', leads: 38, cpl: '₹326', lastRun: '15m ago', icon: '📢' },
];

// Hotel-specific automation tasks (all paused / zero metrics — brand new hotel)
export const hotelAutomationTasks = [
  { id: 'hauto-1', name: 'OTA Listing Sync', status: 'paused', type: 'social', schedule: 'Not configured', reach: '0', lastRun: 'Never', icon: '🏨' },
  { id: 'hauto-2', name: 'Guest Review Collector', status: 'paused', type: 'reviews', schedule: 'After checkout', sent: 0, responded: 0, lastRun: 'Never', icon: '⭐' },
  { id: 'hauto-3', name: 'Booking Confirmation Emails', status: 'paused', type: 'email', schedule: 'On booking', sent: 0, opened: 0, clicked: 0, lastRun: 'Never', icon: '📧' },
  { id: 'hauto-4', name: 'Room Rate Optimizer', status: 'paused', type: 'seo', schedule: 'Daily', score: 0, issues: 0, lastRun: 'Never', icon: '💰' },
  { id: 'hauto-5', name: 'Competitor Rate Tracker', status: 'paused', type: 'competitor', schedule: 'Not configured', tracked: 22, alerts: 0, lastRun: 'Never', icon: '📊' },
  { id: 'hauto-6', name: 'WhatsApp Booking Bot', status: 'paused', type: 'chat', schedule: 'Not configured', replied: 0, avgResponse: 'N/A', lastRun: 'Never', icon: '💬' },
  { id: 'hauto-7', name: 'Invoice & Folio Generator', status: 'paused', type: 'billing', schedule: 'On checkout', generated: 0, pending: 0, lastRun: 'Never', icon: '🧾' },
  { id: 'hauto-8', name: 'Google Hotel Ads Manager', status: 'paused', type: 'ads', schedule: 'Not configured', spend: '₹0', leads: 0, cpl: '₹0', lastRun: 'Never', icon: '📢' },
  { id: 'hauto-9', name: 'Social Media Auto-Post', status: 'paused', type: 'social', schedule: 'Not configured', reach: '0', lastRun: 'Never', icon: '📱' },
  { id: 'hauto-10', name: 'Seasonal Campaign Scheduler', status: 'paused', type: 'ads', schedule: 'Not configured', spend: '₹0', leads: 0, cpl: '₹0', lastRun: 'Never', icon: '🎯' },
];
