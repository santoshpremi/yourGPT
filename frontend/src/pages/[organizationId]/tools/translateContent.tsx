import React, { useState } from 'react';
import { trpc } from '../../../utils/trpc';
import { 
  LanguageIcon, 
  DocumentTextIcon, 
  ArrowsRightLeftIcon,
  CloudArrowUpIcon,
  SpeakerWaveIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface Translation {
  id: string;
  sourceText: string;
  targetText: string;
  sourceLang: string;
  targetLang: string;
  confidence: number;
  createdAt: Date;
  type: 'text' | 'document';
}

const TranslateContentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'text' | 'document' | 'history'>('text');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [detectedLang, setDetectedLang] = useState<string | null>(null);

  const [translations, setTranslations] = useState<Translation[]>([
    {
      id: '1',
      sourceText: 'Bonjour, comment allez-vous?',
      targetText: 'Hello, how are you?',
      sourceLang: 'fr',
      targetLang: 'en',
      confidence: 98,
      createdAt: new Date(2024, 1, 16),
      type: 'text'
    },
    {
      id: '2',
      sourceText: 'Hola, ¿cómo estás?',
      targetText: 'Hello, how are you?',
      sourceLang: 'es',
      targetLang: 'en',
      confidence: 96,
      createdAt: new Date(2024, 1, 15),
      type: 'text'
    },
    {
      id: '3',
      sourceText: 'document-business-plan.pdf',
      targetText: 'document-business-plan-translated.pdf',
      sourceLang: 'de',
      targetLang: 'en',
      confidence: 94,
      createdAt: new Date(2024, 1, 14),
      type: 'document'
    }
  ]);

  const { data: textTranslationEnabled } = trpc.tools.translateContent.textTranslator.isEnabled.useQuery();
  const { data: docTranslationEnabled } = trpc.tools.translateContent.documentTranslator.isEnabled.useQuery();

  const languages = [
    { code: 'auto', name: 'Auto-detect', flag: '🌐' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'th', name: 'Thai', flag: '🇹🇭' },
    { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
    { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
    { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
    { code: 'no', name: 'Norwegian', flag: '🇳🇴' },
    { code: 'da', name: 'Danish', flag: '🇩🇰' },
    { code: 'fi', name: 'Finnish', flag: '🇫🇮' }
  ];

  const getLanguageName = (code: string) => {
    const lang = languages.find(l => l.code === code);
    return lang ? `${lang.flag} ${lang.name}` : code;
  };

  const translateText = async () => {
    if (!sourceText.trim()) return;

    setIsTranslating(true);
    setDetectedLang(null);

    // Mock translation delay
    setTimeout(() => {
      // Mock language detection
      if (sourceLang === 'auto') {
        const detectedLangCode = 'fr'; // Mock detection
        setDetectedLang(detectedLangCode);
      }

      // Mock translation
      const mockTranslations: { [key: string]: string } = {
        'Hello, how are you?': 'Hola, ¿cómo estás?',
        'Good morning': 'Buenos días',
        'Thank you': 'Gracias',
        'Welcome': 'Bienvenido',
        'Goodbye': 'Adiós'
      };

      const translated = mockTranslations[sourceText] || `[Translated from ${sourceLang === 'auto' ? 'detected language' : sourceLang} to ${targetLang}]: ${sourceText}`;
      setTranslatedText(translated);

      // Save translation
      const newTranslation: Translation = {
        id: Date.now().toString(),
        sourceText,
        targetText: translated,
        sourceLang: sourceLang === 'auto' ? (detectedLang || 'unknown') : sourceLang,
        targetLang,
        confidence: Math.floor(Math.random() * 10) + 90, // Mock confidence 90-99%
        createdAt: new Date(),
        type: 'text'
      };

      setTranslations(prev => [newTranslation, ...prev]);
      setIsTranslating(false);
    }, 2000);
  };

  const swapLanguages = () => {
    if (sourceLang === 'auto') return;
    
    const newSourceLang = targetLang;
    const newTargetLang = sourceLang;
    const newSourceText = translatedText;
    const newTranslatedText = sourceText;

    setSourceLang(newSourceLang);
    setTargetLang(newTargetLang);
    setSourceText(newSourceText);
    setTranslatedText(newTranslatedText);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const speakText = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      speechSynthesis.speak(utterance);
    }
  };

  const tabs = [
    { id: 'text', name: 'Text Translation', icon: LanguageIcon },
    { id: 'document', name: 'Document Translation', icon: DocumentTextIcon },
    { id: 'history', name: 'Translation History', icon: DocumentDuplicateIcon }
  ];

  return (
    <div className="h-full bg-gray-50 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <LanguageIcon className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Translate Content</h1>
          </div>
          <p className="text-gray-600">AI-powered translation for text and documents across 100+ languages</p>
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${textTranslationEnabled ? 'bg-green-500' : 'bg-red-500'}`} />
              Text Translation: {textTranslationEnabled ? 'Enabled' : 'Disabled'}
            </span>
            <span className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${docTranslationEnabled ? 'bg-green-500' : 'bg-red-500'}`} />
              Document Translation: {docTranslationEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Text Translation Tab */}
        {activeTab === 'text' && (
          <div className="space-y-6">
            {/* Language Selection */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                  <select
                    value={sourceLang}
                    onChange={(e) => setSourceLang(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                  {detectedLang && (
                    <div className="text-xs text-green-600 mt-1">
                      Detected: {getLanguageName(detectedLang)}
                    </div>
                  )}
                </div>

                <button
                  onClick={swapLanguages}
                  disabled={sourceLang === 'auto'}
                  className="mt-6 p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowsRightLeftIcon className="w-5 h-5" />
                </button>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {languages.filter(lang => lang.code !== 'auto').map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Translation Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Source Text */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">Original Text</h3>
                  <div className="flex gap-2">
                    {sourceText && (
                      <button
                        onClick={() => speakText(sourceText, sourceLang)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <SpeakerWaveIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                
                <textarea
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  placeholder="Enter text to translate..."
                  className="w-full h-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                
                <div className="flex items-center justify-between mt-3">
                  <div className="text-xs text-gray-500">
                    {sourceText.length} characters
                  </div>
                  <button
                    onClick={translateText}
                    disabled={!sourceText.trim() || isTranslating}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isTranslating ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        Translating...
                      </>
                    ) : (
                      <>
                        <LanguageIcon className="w-4 h-4" />
                        Translate
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Translated Text */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">Translated Text</h3>
                  <div className="flex gap-2">
                    {translatedText && (
                      <>
                        <button
                          onClick={() => speakText(translatedText, targetLang)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <SpeakerWaveIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => copyToClipboard(translatedText)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <DocumentDuplicateIcon className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="w-full h-40 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  {translatedText ? (
                    <div className="whitespace-pre-wrap">{translatedText}</div>
                  ) : (
                    <div className="text-gray-400 italic">Translation will appear here...</div>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-3">
                  <div className="text-xs text-gray-500">
                    {translatedText.length} characters
                  </div>
                  {translatedText && (
                    <div className="text-xs text-green-600">
                      Confidence: 95%
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Document Translation Tab */}
        {activeTab === 'document' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <DocumentTextIcon className="w-5 h-5 text-blue-600" />
              Document Translation
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upload Section */}
              <div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Document</h3>
                  <p className="text-gray-500 mb-4">Drag and drop your file here, or click to browse</p>
                  <p className="text-sm text-gray-400 mb-4">
                    Supports PDF, DOCX, PPTX, TXT files up to 10MB
                  </p>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    Choose File
                  </button>
                </div>

                {/* Language Selection for Documents */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">From Language</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="auto">Auto-detect</option>
                      {languages.filter(lang => lang.code !== 'auto').map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">To Language</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      {languages.filter(lang => lang.code !== 'auto').map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Options Section */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Translation Options</h3>
                
                <div className="space-y-4">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span className="text-sm text-gray-700">Preserve formatting</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span className="text-sm text-gray-700">Maintain document structure</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span className="text-sm text-gray-700">Create bilingual document</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span className="text-sm text-gray-700">Translate images with text</span>
                  </label>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-2">Quality Settings</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="quality" value="fast" className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                      <span className="text-sm text-gray-700">Fast (Basic quality)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="quality" value="balanced" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                      <span className="text-sm text-gray-700">Balanced (Good quality)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="quality" value="premium" className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                      <span className="text-sm text-gray-700">Premium (Best quality)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Translation History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <DocumentDuplicateIcon className="w-5 h-5 text-blue-600" />
              Translation History ({translations.length})
            </h2>
            
            <div className="space-y-4">
              {translations.map((translation) => (
                <motion.div
                  key={translation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {getLanguageName(translation.sourceLang)} → {getLanguageName(translation.targetLang)}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          translation.type === 'text' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {translation.type}
                        </span>
                        <span className="text-xs text-green-600">
                          {translation.confidence}% confidence
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Original:</div>
                          <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                            {translation.sourceText}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Translation:</div>
                          <div className="text-sm text-gray-900 bg-blue-50 p-2 rounded">
                            {translation.targetText}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{translation.createdAt.toLocaleDateString()} at {translation.createdAt.toLocaleTimeString()}</span>
                    <div className="flex gap-3">
                      <button className="text-blue-600 hover:text-blue-700">Copy</button>
                      <button className="text-blue-600 hover:text-blue-700">Reuse</button>
                      <button className="text-gray-500 hover:text-gray-700">Delete</button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranslateContentPage; 