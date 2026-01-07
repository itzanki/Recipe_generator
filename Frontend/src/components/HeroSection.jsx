import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mic, MicOff, Wand2, Sparkles, Clock, Users } from 'lucide-react';


const HeroSection = ({ onSearch, onRandom, loading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const recognitionRef = useRef(null);

  const features = [
    { icon: '👨‍🍳', text: 'Recipes' },
    { icon: '🎯', text: 'Personalized Recommendations' },
    { icon: '⚡', text: 'Quick & Easy Meals' },
    { icon: '🌱', text: 'Dietary Preferences' }
  ];

  // Check if voice recognition is supported
  useEffect(() => {
    const checkVoiceSupport = () => {
      if (typeof window !== 'undefined') {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        setIsVoiceSupported(!!SpeechRecognition);
      }
    };
    
    checkVoiceSupport();
  }, []);

  // Feature rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('Voice search is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      onSearch(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      if (event.error === 'not-allowed') {
        alert('Microphone access denied. Please allow microphone permissions.');
      } else {
        alert('Voice recognition error. Please try again.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    
    try {
      recognition.start();
    } catch (error) {
      console.error('Failed to start voice recognition:', error);
      alert('Failed to start voice recognition. Please try again.');
    }
  };

  const stopVoiceSearch = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleVoiceButtonClick = () => {
    if (isListening) {
      stopVoiceSearch();
    } else {
      startVoiceSearch();
    }
  };

  const popularSearches = ['chicken', 'pasta', 'vegetarian', 'quick dinner', 'healthy'];

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 via-red-500 to-purple-600 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/30"></div>
        <motion.div
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%'] 
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            repeatType: "reverse" 
          }}
          className="absolute inset-0 bg-gradient-to-br from-orange-400/20 via-red-500/20 to-purple-600/20 bg-[size:200%_200%]"
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-white/10 text-4xl"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight 
            }}
            animate={{ 
              y: [0, -100, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          >
            {['🍕', '🍔', '🥗', '🍝', '🍣', '🥘'][i % 6]}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto w-full">
        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-6 border border-white/20"
          >
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="font-semibold">Recipe Generator</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight"
          >
            Discover Your
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
              className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent"
            >
              Next Favorite Meal
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto leading-relaxed"
          >
            Transform your ingredients into delicious recipes with our chef. 
            <span className="block text-yellow-200 font-semibold mt-2">
              Cook smarter, not harder.
            </span>
          </motion.p>
        </motion.div>

        {/* Rotating Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex items-center space-x-3 text-lg"
              >
                <span className="text-2xl">{features[currentFeature].icon}</span>
                <span className="font-semibold">{features[currentFeature].text}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.form
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          onSubmit={handleSearch}
          className="relative max-w-4xl mx-auto mb-8"
        >
          <motion.div
            whileFocus={{ scale: 1.02 }}
            className="relative"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What ingredients do you have? Try 'chicken, broccoli, rice' or 'quick vegetarian dinner'..."
              className="w-full px-8 py-6 pr-32 rounded-2xl text-gray-800 text-xl border-2 border-orange-200 focus:border-orange-400 focus:outline-none focus:shadow-2xl focus:shadow-orange-200/50 transition-all duration-300 backdrop-blur-sm bg-white/95"
            />
            
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
              {/* Voice Search Button */}
              {isVoiceSupported && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleVoiceButtonClick}
                  className={`p-3 rounded-xl ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse shadow-lg' 
                      : 'bg-orange-500 text-white hover:bg-orange-600 shadow-md'
                  } transition-all duration-300`}
                  title={isListening ? 'Stop listening' : 'Start voice search'}
                >
                  {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </motion.button>
              )}
              
              {/* Search Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-xl hover:from-orange-600 hover:to-red-600 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
                title="Search recipes"
              >
                <Search className="w-6 h-6" />
                <span className="hidden sm:block font-semibold">Search</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.form>

        {/* Popular Searches */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          <span className="text-orange-200 font-medium">Popular:</span>
          {popularSearches.map((search, index) => (
            <motion.button
              key={search}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSearchQuery(search);
                onSearch(search);
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-orange-100 hover:bg-white/20 border border-white/20 transition-all duration-300"
            >
              {search}
            </motion.button>
          ))}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          {/* Surprise Me Button */}
          <motion.button
            onClick={onRandom}
            disabled={loading}
            whileHover={{ 
              scale: 1.05,
              transition: { type: "spring", stiffness: 400, damping: 10 }
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-bold text-lg flex items-center space-x-3 shadow-2xl hover:shadow-3xl transition-all duration-300 disabled:opacity-50 group"
          >
            <motion.div
              animate={loading ? { rotate: 360 } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Wand2 className="w-6 h-6" />
            </motion.div>
            <span>Surprise Me!</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              🎲
            </motion.div>
          </motion.button>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="flex items-center space-x-6 text-orange-200"
          >
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">10K+ Recipes</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span className="font-semibold">50K+ Cooks</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Voice Search Status */}
        {isListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 bg-red-500/20 backdrop-blur-sm rounded-2xl p-4 border border-red-300/30"
          >
            <div className="flex items-center justify-center space-x-3">
              <div className="flex space-x-1">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    className="w-2 h-2 bg-red-400 rounded-full"
                  />
                ))}
              </div>
              <span className="font-semibold text-red-100">Listening... Speak now</span>
            </div>
          </motion.div>
        )}

        {!isVoiceSupported && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-orange-200 text-sm"
          >
            <p>🎤 Voice search available in Chrome, Edge, and Safari</p>
          </motion.div>
        )}

        {/* Loading Animation */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-center space-x-4">
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                    scale: { duration: 1, repeat: Infinity }
                  }}
                  className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full"
                >
                  <Wand2 className="text-white w-6 h-6" />
                </motion.div>
                <div className="text-left">
                  <p className="font-semibold text-yellow-200">Cooking up delicious recipes...</p>
                  <p className="text-orange-100 text-sm">Chef is working its magic!</p>
                </div>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, repeat: Infinity }}
                className="h-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full mt-3"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white/60"
          >
            <div className="text-center">
              <div className="text-sm mb-2">Scroll to explore</div>
              <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
