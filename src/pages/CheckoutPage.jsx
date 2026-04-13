import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check, Sparkles, Crown, Rocket, ArrowRight, ArrowLeft,
  CreditCard, Shield, Lock, User, Mail, Phone, KeyRound,
  IndianRupee, CheckCircle2, TrendingUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { subscriptionPlans } from '../data/mockDatabase';

const planIcons = { starter: Sparkles, professional: Crown, enterprise: Rocket };

const fade = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4 }
};

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup, selectSubscription, tempFormData } = useApp();

  const preSelectedPlanId = location.state?.planId || 'professional';
  const preSelectedYearly = location.state?.isYearly || false;
  const preFilledPhone = location.state?.phone || tempFormData?.phone || '';

  const [step, setStep] = useState(1); // 1: Plan, 2: Signup, 3: Payment, 4: Success
  const [selectedPlan, setSelectedPlan] = useState(preSelectedPlanId);
  const [isYearly, setIsYearly] = useState(preSelectedYearly);
  const [isProcessing, setIsProcessing] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    phone: preFilledPhone,
    otp: ''
  });

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    nameOnCard: '',
    upiId: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'upi'

  const plan = subscriptionPlans.find(p => p.id === selectedPlan);

  // Update phone when preFilledPhone is available
  useEffect(() => {
    if (preFilledPhone && !signupData.phone) {
      setSignupData(prev => ({ ...prev, phone: preFilledPhone }));
    }
  }, [preFilledPhone]);

  const handleSendOtp = () => {
    if (!signupData.phone || signupData.phone.length < 10) return;
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(otp);
    setOtpSent(true);
    setOtpError('');
    // Show OTP in a non-obtrusive way (dummy simulation)
    alert(`Your OTP is: ${otp}\n(This is a demo simulation)`);
  };

  const handleVerifyOtp = () => {
    if (signupData.otp === generatedOtp) {
      setOtpError('');
      return true;
    }
    setOtpError('Invalid OTP. Please try again.');
    return false;
  };

  const handleSignupNext = (e) => {
    e.preventDefault();
    if (!otpSent) {
      setOtpError('Please verify your phone number first.');
      return;
    }
    if (handleVerifyOtp()) {
      setStep(3);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(r => setTimeout(r, 3000));
    setIsProcessing(false);
    setPaymentSuccess(true);

    // Save user data
    signup({
      name: signupData.name,
      email: signupData.email,
      phone: signupData.phone
    });
    selectSubscription(plan);

    // Auto-advance to success
    setStep(4);
  };

  const handleContinue = () => {
    navigate('/onboarding');
  };

  const price = isYearly ? plan?.yearlyPrice : plan?.price;
  const displayPrice = price ? (price / 100).toFixed(0) : '0';

  return (
    <div className="min-h-screen bg-navy-50">
      {/* Header */}
      <div className="bg-white border-b border-navy-100">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-navy-700 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-navy-800">LeadFlexUp</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-navy-400">
            <Lock className="w-3.5 h-3.5" />
            Secure Checkout
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-2 mb-8">
          {[
            { n: 1, label: 'Plan' },
            { n: 2, label: 'Sign Up' },
            { n: 3, label: 'Payment' },
            { n: 4, label: 'Done' }
          ].map((s, i) => (
            <div key={s.n} className="flex items-center">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                step === s.n ? 'bg-teal-600 text-white' :
                step > s.n ? 'bg-teal-100 text-teal-700' :
                'bg-navy-100 text-navy-400'
              }`}>
                {step > s.n ? <Check className="w-3.5 h-3.5" /> : <span>{s.n}</span>}
                <span>{s.label}</span>
              </div>
              {i < 3 && (
                <div className={`w-8 h-0.5 mx-1 transition-colors duration-300 ${
                  step > s.n ? 'bg-teal-400' : 'bg-navy-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Plan Selection */}
          {step === 1 && (
            <motion.div key="plan" {...fade}>
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-navy-900">Choose Your Plan</h2>
                <p className="text-sm text-navy-400 mt-1">Select the plan that fits your business needs</p>
              </div>

              {/* Billing Toggle */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className={`text-sm font-medium ${!isYearly ? 'text-navy-900' : 'text-navy-400'}`}>Monthly</span>
                <button
                  onClick={() => setIsYearly(!isYearly)}
                  className="relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                  style={{ backgroundColor: isYearly ? '#0d9488' : '#cbd5e1' }}
                >
                  <span
                    className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300"
                    style={{ transform: isYearly ? 'translateX(28px)' : 'translateX(0)' }}
                  />
                </button>
                <span className={`text-sm font-medium ${isYearly ? 'text-navy-900' : 'text-navy-400'}`}>
                  Yearly <span className="text-teal-600 text-xs">(Save up to 16%)</span>
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {subscriptionPlans.map((p) => {
                  const Icon = planIcons[p.id];
                  const isSelected = selectedPlan === p.id;
                  const planPrice = isYearly ? p.yearlyPrice : p.price;
                  return (
                    <motion.button
                      key={p.id}
                      onClick={() => setSelectedPlan(p.id)}
                      whileTap={{ scale: 0.98 }}
                      className={`relative text-left bg-white rounded-xl border-2 p-5 transition-all duration-200 ${
                        isSelected
                          ? 'border-teal-500 shadow-lg shadow-teal-500/10'
                          : 'border-navy-100 hover:border-navy-200'
                      }`}
                    >
                      {p.recommended && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-teal-600 text-white px-3 py-0.5 rounded-full">
                          Most Popular
                        </span>
                      )}

                      {isSelected && (
                        <div className="absolute top-3 right-3">
                          <CheckCircle2 className="w-5 h-5 text-teal-600" />
                        </div>
                      )}

                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
                        isSelected ? 'bg-teal-600' : 'bg-navy-700'
                      }`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>

                      <h3 className="text-base font-bold text-navy-900 mb-1">{p.name.en}</h3>
                      <div className="flex items-baseline gap-1 mb-3">
                        <span className="text-2xl font-bold text-navy-900">
                          {p.currency}{(planPrice / 100).toFixed(0)}
                        </span>
                        <span className="text-xs text-navy-400">/month</span>
                      </div>

                      <div className="space-y-1.5">
                        {p.features.slice(0, 4).map((f, j) => (
                          <div key={j} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
                            <span className="text-[11px] text-navy-500">{f.en}</span>
                          </div>
                        ))}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-8 py-3 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors shadow-sm"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Sign Up */}
          {step === 2 && (
            <motion.div key="signup" {...fade}>
              <div className="max-w-md mx-auto">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-navy-900">Create Your Account</h2>
                  <p className="text-sm text-navy-400 mt-1">Quick sign up to get started</p>
                </div>

                <form onSubmit={handleSignupNext} className="bg-white rounded-xl border border-navy-100 p-6 space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-navy-700 mb-1.5">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
                      <input
                        required
                        value={signupData.name}
                        onChange={e => setSignupData({ ...signupData, name: e.target.value })}
                        placeholder="Enter your full name"
                        className="w-full pl-10 pr-4 py-2.5 bg-navy-50 border border-navy-100 rounded-lg text-sm text-navy-800 placeholder-navy-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-navy-700 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
                      <input
                        required
                        type="email"
                        value={signupData.email}
                        onChange={e => setSignupData({ ...signupData, email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-navy-50 border border-navy-100 rounded-lg text-sm text-navy-800 placeholder-navy-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-navy-700 mb-1.5">Phone Number</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
                        <input
                          required
                          type="tel"
                          value={signupData.phone}
                          onChange={e => setSignupData({ ...signupData, phone: e.target.value })}
                          placeholder="10-digit phone number"
                          maxLength={10}
                          className="w-full pl-10 pr-4 py-2.5 bg-navy-50 border border-navy-100 rounded-lg text-sm text-navy-800 placeholder-navy-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={signupData.phone.length < 10}
                        className={`px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                          signupData.phone.length >= 10
                            ? 'bg-navy-700 text-white hover:bg-navy-800'
                            : 'bg-navy-100 text-navy-400 cursor-not-allowed'
                        }`}
                      >
                        {otpSent ? 'Resend OTP' : 'Send OTP'}
                      </button>
                    </div>
                  </div>

                  {/* OTP */}
                  {otpSent && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <label className="block text-xs font-semibold text-navy-700 mb-1.5">Enter OTP</label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
                        <input
                          required
                          value={signupData.otp}
                          onChange={e => {
                            setSignupData({ ...signupData, otp: e.target.value });
                            setOtpError('');
                          }}
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                          className="w-full pl-10 pr-4 py-2.5 bg-navy-50 border border-navy-100 rounded-lg text-sm text-navy-800 placeholder-navy-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        />
                      </div>
                      {otpError && (
                        <p className="text-xs text-red-500 mt-1">{otpError}</p>
                      )}
                      <p className="text-[11px] text-teal-600 mt-1">OTP sent to your phone (check the alert)</p>
                    </motion.div>
                  )}

                  {/* Selected Plan Summary */}
                  <div className="bg-navy-50 rounded-lg p-3 mt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-teal-600 rounded-md flex items-center justify-center">
                          {(() => { const Icon = planIcons[selectedPlan]; return <Icon className="w-3.5 h-3.5 text-white" />; })()}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-navy-800">{plan?.name?.en}</p>
                          <p className="text-[10px] text-navy-400">{isYearly ? 'Billed annually' : 'Billed monthly'}</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-navy-900">₹{displayPrice}/mo</p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px bg-navy-200"></div>
                    <span className="text-xs text-navy-400 font-medium">OR</span>
                    <div className="flex-1 h-px bg-navy-200"></div>
                  </div>

                  {/* Google Sign Up */}
                  <button
                    type="button"
                    onClick={() => {
                      // Simulate Google OAuth
                      alert('Google Sign-Up would open here in production');
                      // For demo, auto-fill some data
                      setSignupData({
                        ...signupData,
                        name: 'Google User',
                        email: 'user@gmail.com'
                      });
                      setOtpSent(true);
                      setGeneratedOtp('123456');
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-navy-200 text-navy-700 text-xs font-semibold rounded-lg hover:bg-navy-50 hover:border-navy-300 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </button>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex items-center gap-1 px-4 py-2.5 border border-navy-200 text-navy-600 text-xs font-semibold rounded-lg hover:bg-navy-50 transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      Continue to Payment
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <motion.div key="payment" {...fade}>
              <div className="max-w-md mx-auto">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-navy-900">Payment Details</h2>
                  <p className="text-sm text-navy-400 mt-1">Complete your subscription</p>
                </div>

                <form onSubmit={handlePayment} className="bg-white rounded-xl border border-navy-100 p-6 space-y-4">
                  {/* Order Summary */}
                  <div className="bg-navy-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-navy-500">{plan?.name?.en} ({isYearly ? 'Yearly' : 'Monthly'})</span>
                      <span className="font-semibold text-navy-800">₹{displayPrice}/mo</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-navy-500">GST (18%)</span>
                      <span className="font-semibold text-navy-800">₹{Math.round(displayPrice * 0.18)}</span>
                    </div>
                    <div className="border-t border-navy-200 pt-2 flex justify-between">
                      <span className="text-sm font-bold text-navy-900">Total</span>
                      <span className="text-sm font-bold text-teal-600">₹{Math.round(displayPrice * 1.18)}/mo</span>
                    </div>
                  </div>

                  {/* Payment Method Tabs */}
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setPaymentMethod('card')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg border-2 transition-all ${
                        paymentMethod === 'card' ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-navy-100 text-navy-500 hover:border-navy-200'
                      }`}>
                      <CreditCard className="w-4 h-4" /> Card
                    </button>
                    <button type="button" onClick={() => setPaymentMethod('upi')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg border-2 transition-all ${
                        paymentMethod === 'upi' ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-navy-100 text-navy-500 hover:border-navy-200'
                      }`}>
                      <IndianRupee className="w-4 h-4" /> UPI
                    </button>
                  </div>

                  {paymentMethod === 'card' ? (
                    <>
                      {/* Card Number */}
                      <div>
                        <label className="block text-xs font-semibold text-navy-700 mb-1.5">Card Number</label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
                          <input
                            required
                            value={paymentData.cardNumber}
                            onChange={e => {
                              let val = e.target.value.replace(/\D/g, '').slice(0, 16);
                              val = val.replace(/(.{4})/g, '$1 ').trim();
                              setPaymentData({ ...paymentData, cardNumber: val });
                            }}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            className="w-full pl-10 pr-4 py-2.5 bg-navy-50 border border-navy-100 rounded-lg text-sm text-navy-800 placeholder-navy-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 tracking-wider"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {/* Expiry */}
                        <div>
                          <label className="block text-xs font-semibold text-navy-700 mb-1.5">Expiry Date</label>
                          <input
                            required
                            value={paymentData.expiry}
                            onChange={e => {
                              let val = e.target.value.replace(/\D/g, '').slice(0, 4);
                              if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2);
                              setPaymentData({ ...paymentData, expiry: val });
                            }}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="w-full px-4 py-2.5 bg-navy-50 border border-navy-100 rounded-lg text-sm text-navy-800 placeholder-navy-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                          />
                        </div>
                        {/* CVV */}
                        <div>
                          <label className="block text-xs font-semibold text-navy-700 mb-1.5">CVV</label>
                          <input
                            required
                            type="password"
                            value={paymentData.cvv}
                            onChange={e => setPaymentData({ ...paymentData, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                            placeholder="•••"
                            maxLength={3}
                            className="w-full px-4 py-2.5 bg-navy-50 border border-navy-100 rounded-lg text-sm text-navy-800 placeholder-navy-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                          />
                        </div>
                      </div>

                      {/* Name on Card */}
                      <div>
                        <label className="block text-xs font-semibold text-navy-700 mb-1.5">Name on Card</label>
                        <input
                          required
                          value={paymentData.nameOnCard}
                          onChange={e => setPaymentData({ ...paymentData, nameOnCard: e.target.value })}
                          placeholder="Full name on card"
                          className="w-full px-4 py-2.5 bg-navy-50 border border-navy-100 rounded-lg text-sm text-navy-800 placeholder-navy-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* UPI ID */}
                      <div>
                        <label className="block text-xs font-semibold text-navy-700 mb-1.5">UPI ID</label>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
                          <input
                            required
                            value={paymentData.upiId}
                            onChange={e => setPaymentData({ ...paymentData, upiId: e.target.value })}
                            placeholder="yourname@upi"
                            className="w-full pl-10 pr-4 py-2.5 bg-navy-50 border border-navy-100 rounded-lg text-sm text-navy-800 placeholder-navy-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                          />
                        </div>
                        <p className="text-[10px] text-navy-400 mt-1">Enter your UPI ID (e.g., name@paytm, name@okaxis, 9876543210@ybl)</p>
                      </div>

                      {/* UPI Apps Quick Select */}
                      <div>
                        <p className="text-xs font-semibold text-navy-700 mb-2">Or pay using</p>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { name: 'GPay', color: 'bg-white', textColor: 'text-navy-700', suffix: '@okaxis' },
                            { name: 'PhonePe', color: 'bg-white', textColor: 'text-navy-700', suffix: '@ybl' },
                            { name: 'Paytm', color: 'bg-white', textColor: 'text-navy-700', suffix: '@paytm' },
                            { name: 'BHIM', color: 'bg-white', textColor: 'text-navy-700', suffix: '@upi' }
                          ].map(app => (
                            <button key={app.name} type="button"
                              onClick={() => setPaymentData({ ...paymentData, upiId: `${signupData.phone || ''}${app.suffix}` })}
                              className={`${app.color} ${app.textColor} border border-navy-100 rounded-lg py-2 text-[11px] font-semibold hover:border-teal-400 hover:bg-teal-50 transition-all`}>
                              {app.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex items-center gap-2 text-[11px] text-navy-400 pt-1">
                    <Shield className="w-3.5 h-3.5" />
                    Your payment information is encrypted and secure
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex items-center gap-1 px-4 py-2.5 border border-navy-200 text-navy-600 text-xs font-semibold rounded-lg hover:bg-navy-50 transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-white text-xs font-semibold rounded-lg transition-colors ${
                        isProcessing ? 'bg-navy-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <span className="checkout-spinner" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          Pay ₹{Math.round(displayPrice * 1.18)}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <motion.div key="success" {...fade}>
              <div className="max-w-md mx-auto text-center">
                {/* Success Animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                  className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Check className="w-10 h-10 text-white" strokeWidth={3} />
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <h2 className="text-2xl font-bold text-navy-900 mb-2">Subscription Activated!</h2>
                  <p className="text-sm text-navy-400 mb-2">
                    Welcome aboard, <span className="font-semibold text-navy-700">{signupData.name}</span>!
                  </p>
                  <p className="text-xs text-navy-400 mb-8">
                    Your <span className="font-semibold text-teal-600">{plan?.name?.en}</span> plan is now active.
                    Let's set up your online presence!
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-white rounded-xl border border-navy-100 p-4 mb-6"
                >
                  <h3 className="text-xs font-bold text-navy-700 mb-3 uppercase tracking-wider">What's Next</h3>
                  <div className="space-y-2">
                    {['Set up your Website', 'Connect Social Media', 'Claim Google Business Profile'].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-navy-600">
                        <div className="w-5 h-5 bg-teal-100 rounded-full flex items-center justify-center">
                          <span className="text-[10px] font-bold text-teal-700">{i + 1}</span>
                        </div>
                        {item}
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  onClick={handleContinue}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors shadow-sm"
                >
                  Start Onboarding
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Spinner CSS */}
      <style>{`
        .checkout-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
