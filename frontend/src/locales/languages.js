export const SUPPORTED_LANGUAGES = [
  // Indian Languages
  { code: 'en', name: 'English', nativeName: 'English', region: 'Indian/Global', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', region: 'Indian', dir: 'ltr' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', region: 'Indian', dir: 'ltr' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', region: 'Indian', dir: 'ltr' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', region: 'Indian', dir: 'ltr' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', region: 'Indian', dir: 'ltr' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', region: 'Indian', dir: 'ltr' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', region: 'Indian', dir: 'ltr' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', region: 'Indian', dir: 'ltr' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', region: 'Indian', dir: 'ltr' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', region: 'Indian', dir: 'rtl' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', region: 'Indian', dir: 'ltr' },

  // European Languages
  { code: 'fr', name: 'French', nativeName: 'Français', region: 'European', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', region: 'European', dir: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', region: 'European', dir: 'ltr' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', region: 'European', dir: 'ltr' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', region: 'European', dir: 'ltr' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', region: 'European', dir: 'ltr' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', region: 'European', dir: 'ltr' },

  // Eastern European & Russian
  { code: 'ru', name: 'Russian', nativeName: 'Русский', region: 'Eastern European', dir: 'ltr' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', region: 'Eastern European', dir: 'ltr' },

  // Other Major Global Languages
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', region: 'Middle East', dir: 'rtl' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', region: 'Global', dir: 'ltr' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', region: 'Asia', dir: 'ltr' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', region: 'Asia', dir: 'ltr' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', region: 'Asia', dir: 'ltr' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', region: 'Asia', dir: 'ltr' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', region: 'Asia', dir: 'ltr' }
];

export const getLanguageByCode = (code) => {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code) || SUPPORTED_LANGUAGES[0];
};
