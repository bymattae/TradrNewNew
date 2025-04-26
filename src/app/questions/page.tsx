'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FiArrowRight, FiCheck } from 'react-icons/fi';

type FormData = {
  tradingType: string;
  experience: string;
  markets: string[];
  strategies: string[];
  profileName: string;
  bio: string;
  showMetrics: boolean;
}

const defaultFormData: FormData = {
  tradingType: '',
  experience: '',
  markets: [],
  strategies: [],
  profileName: '',
  bio: '',
  showMetrics: true
}

export default function QuestionsPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  
  const totalSteps = 6;
  
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit or navigate to dashboard/confirmation
      router.push('/dashboard');
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleTradingTypeChange = (type: string) => {
    setFormData({...formData, tradingType: type});
  };
  
  const handleExperienceChange = (experience: string) => {
    setFormData({...formData, experience});
  };
  
  const handleMarketToggle = (market: string) => {
    if (formData.markets.includes(market)) {
      setFormData({
        ...formData, 
        markets: formData.markets.filter(m => m !== market)
      });
    } else {
      setFormData({
        ...formData,
        markets: [...formData.markets, market]
      });
    }
  };
  
  const handleStrategyToggle = (strategy: string) => {
    if (formData.strategies.includes(strategy)) {
      setFormData({
        ...formData, 
        strategies: formData.strategies.filter(s => s !== strategy)
      });
    } else {
      setFormData({
        ...formData,
        strategies: [...formData.strategies, strategy]
      });
    }
  };
  
  const isStepComplete = () => {
    switch (currentStep) {
      case 0: // Trading Type
        return formData.tradingType !== '';
      case 1: // Experience
        return formData.experience !== '';
      case 2: // Markets
        return formData.markets.length > 0;
      case 3: // Strategies
        return formData.strategies.length > 0;
      case 4: // Profile Name
        return formData.profileName.length >= 3;
      case 5: // Bio
        return formData.bio.length >= 10;
      default:
        return true;
    }
  };
  
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="w-full bg-[#1A1A1A] h-1.5 rounded-full mb-10">
          <div 
            className="bg-gradient-to-r from-purple-600 to-purple-800 h-full rounded-full transition-all"
            style={{ width: `${((currentStep + 1) / (totalSteps + 1)) * 100}%` }}
          ></div>
        </div>
        
        {/* Questions Container */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-[#111111] rounded-2xl p-8 shadow-lg border border-[rgba(255,255,255,0.05)]"
          >
            {/* Step 1: Trading Type */}
            {currentStep === 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-2">What type of trader are you?</h2>
                <p className="text-white/70 mb-8">Select the option that best describes you</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <button 
                    onClick={() => handleTradingTypeChange('day')}
                    className={`p-4 rounded-xl border ${
                      formData.tradingType === 'day' 
                      ? 'border-purple-500 bg-purple-900/20' 
                      : 'border-white/10 hover:border-white/30'
                    } transition-colors text-left`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">Day Trader</div>
                      {formData.tradingType === 'day' && <FiCheck className="text-purple-500" />}
                    </div>
                    <p className="text-sm text-white/70">I open and close positions within the same trading day</p>
                  </button>
                  
                  <button 
                    onClick={() => handleTradingTypeChange('swing')}
                    className={`p-4 rounded-xl border ${
                      formData.tradingType === 'swing' 
                      ? 'border-purple-500 bg-purple-900/20' 
                      : 'border-white/10 hover:border-white/30'
                    } transition-colors text-left`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">Swing Trader</div>
                      {formData.tradingType === 'swing' && <FiCheck className="text-purple-500" />}
                    </div>
                    <p className="text-sm text-white/70">I hold positions for several days to weeks</p>
                  </button>
                  
                  <button 
                    onClick={() => handleTradingTypeChange('position')}
                    className={`p-4 rounded-xl border ${
                      formData.tradingType === 'position' 
                      ? 'border-purple-500 bg-purple-900/20' 
                      : 'border-white/10 hover:border-white/30'
                    } transition-colors text-left`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">Position Trader</div>
                      {formData.tradingType === 'position' && <FiCheck className="text-purple-500" />}
                    </div>
                    <p className="text-sm text-white/70">I hold positions for months or longer</p>
                  </button>
                  
                  <button 
                    onClick={() => handleTradingTypeChange('scalper')}
                    className={`p-4 rounded-xl border ${
                      formData.tradingType === 'scalper' 
                      ? 'border-purple-500 bg-purple-900/20' 
                      : 'border-white/10 hover:border-white/30'
                    } transition-colors text-left`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">Scalper</div>
                      {formData.tradingType === 'scalper' && <FiCheck className="text-purple-500" />}
                    </div>
                    <p className="text-sm text-white/70">I make many trades within short time frames</p>
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 2: Experience Level */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold mb-2">What's your trading experience?</h2>
                <p className="text-white/70 mb-8">Select your experience level</p>
                
                <div className="grid grid-cols-1 gap-3 mb-8">
                  <button 
                    onClick={() => handleExperienceChange('beginner')}
                    className={`p-4 rounded-xl border ${
                      formData.experience === 'beginner' 
                      ? 'border-purple-500 bg-purple-900/20' 
                      : 'border-white/10 hover:border-white/30'
                    } transition-colors text-left`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">Beginner (&lt; 1 year)</div>
                      {formData.experience === 'beginner' && <FiCheck className="text-purple-500" />}
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => handleExperienceChange('intermediate')}
                    className={`p-4 rounded-xl border ${
                      formData.experience === 'intermediate' 
                      ? 'border-purple-500 bg-purple-900/20' 
                      : 'border-white/10 hover:border-white/30'
                    } transition-colors text-left`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">Intermediate (1-3 years)</div>
                      {formData.experience === 'intermediate' && <FiCheck className="text-purple-500" />}
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => handleExperienceChange('advanced')}
                    className={`p-4 rounded-xl border ${
                      formData.experience === 'advanced' 
                      ? 'border-purple-500 bg-purple-900/20' 
                      : 'border-white/10 hover:border-white/30'
                    } transition-colors text-left`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">Advanced (3-5 years)</div>
                      {formData.experience === 'advanced' && <FiCheck className="text-purple-500" />}
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => handleExperienceChange('expert')}
                    className={`p-4 rounded-xl border ${
                      formData.experience === 'expert' 
                      ? 'border-purple-500 bg-purple-900/20' 
                      : 'border-white/10 hover:border-white/30'
                    } transition-colors text-left`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">Expert (5+ years)</div>
                      {formData.experience === 'expert' && <FiCheck className="text-purple-500" />}
                    </div>
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 3: Markets */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold mb-2">Which markets do you trade?</h2>
                <p className="text-white/70 mb-8">Select all that apply</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                  {['Crypto', 'Forex', 'Stocks', 'Options', 'Futures', 'Commodities', 'Indices', 'NFTs'].map((market) => (
                    <button 
                      key={market}
                      onClick={() => handleMarketToggle(market)}
                      className={`p-4 rounded-xl border ${
                        formData.markets.includes(market) 
                        ? 'border-purple-500 bg-purple-900/20' 
                        : 'border-white/10 hover:border-white/30'
                      } transition-colors text-left`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">{market}</div>
                        {formData.markets.includes(market) && <FiCheck className="text-purple-500" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Step 4: Strategies */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-bold mb-2">What strategies do you use?</h2>
                <p className="text-white/70 mb-8">Select all that apply</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                  {[
                    'Technical Analysis', 
                    'Fundamental Analysis',
                    'Price Action',
                    'Trend Following',
                    'Swing Trading',
                    'Scalping',
                    'Breakout',
                    'Algorithmic Trading'
                  ].map((strategy) => (
                    <button 
                      key={strategy}
                      onClick={() => handleStrategyToggle(strategy)}
                      className={`p-4 rounded-xl border ${
                        formData.strategies.includes(strategy) 
                        ? 'border-purple-500 bg-purple-900/20' 
                        : 'border-white/10 hover:border-white/30'
                      } transition-colors text-left`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">{strategy}</div>
                        {formData.strategies.includes(strategy) && <FiCheck className="text-purple-500" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Step 5: Profile Name */}
            {currentStep === 4 && (
              <div>
                <h2 className="text-2xl font-bold mb-2">Create your profile name</h2>
                <p className="text-white/70 mb-8">This is how others will find and recognize you</p>
                
                <div className="mb-8">
                  <label className="block text-sm font-medium mb-2">Username</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.profileName}
                      onChange={(e) => setFormData({...formData, profileName: e.target.value})}
                      placeholder="Enter a username"
                      className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-white/50">
                      @tradr
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-white/50">Min. 3 characters, letters and numbers only</p>
                </div>
              </div>
            )}
            
            {/* Step 6: Bio */}
            {currentStep === 5 && (
              <div>
                <h2 className="text-2xl font-bold mb-2">Write a short bio</h2>
                <p className="text-white/70 mb-8">Tell others about your trading journey and expertise</p>
                
                <div className="mb-8">
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    placeholder="Tell us about your trading journey and expertise..."
                    rows={4}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                  ></textarea>
                  <p className="mt-2 text-sm text-white/50">{formData.bio.length}/150 characters</p>
                </div>
              </div>
            )}
            
            {/* Final Step: Review */}
            {currentStep === 6 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Review your profile</h2>
                
                <div className="space-y-6 mb-8">
                  <div>
                    <h3 className="text-lg font-medium mb-2">@{formData.profileName}</h3>
                    <p className="text-white/70">{formData.bio}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Trading Style</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-[#1A1A1A] rounded-full text-sm">
                        {formData.tradingType === 'day' && 'Day Trader'}
                        {formData.tradingType === 'swing' && 'Swing Trader'}
                        {formData.tradingType === 'position' && 'Position Trader'}
                        {formData.tradingType === 'scalper' && 'Scalper'}
                      </span>
                      <span className="px-3 py-1 bg-[#1A1A1A] rounded-full text-sm">
                        {formData.experience === 'beginner' && 'Beginner'}
                        {formData.experience === 'intermediate' && 'Intermediate'}
                        {formData.experience === 'advanced' && 'Advanced'}
                        {formData.experience === 'expert' && 'Expert'}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Markets</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.markets.map(market => (
                        <span key={market} className="px-3 py-1 bg-[#1A1A1A] rounded-full text-sm">
                          {market}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Strategies</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.strategies.map(strategy => (
                        <span key={strategy} className="px-3 py-1 bg-[#1A1A1A] rounded-full text-sm">
                          {strategy}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <p className="text-center text-white/70 mb-3">
                  Your profile looks great! Ready to complete setup?
                </p>
              </div>
            )}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 0 ? (
                <button 
                  onClick={handlePrevious}
                  className="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                >
                  Back
                </button>
              ) : (
                <div></div> // Empty div to maintain layout with flex justify-between
              )}
              
              <button 
                onClick={handleNext}
                disabled={!isStepComplete()}
                className={`px-5 py-2 rounded-lg flex items-center gap-2 ${
                  isStepComplete()
                  ? 'bg-gradient-to-r from-purple-600 to-purple-800 hover:opacity-90'
                  : 'bg-[#333] text-white/50 cursor-not-allowed'
                } transition-colors`}
              >
                {currentStep === totalSteps ? 'Complete' : 'Next'} 
                <FiArrowRight />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
} 