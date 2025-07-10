import React, { useState } from 'react';
import { trpc } from '../../../utils/trpc';
import { PhotoIcon, SparklesIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const ImageFactoryPage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('realistic');
  const [selectedSize, setSelectedSize] = useState('1024x1024');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<Array<{
    id: string;
    url: string;
    prompt: string;
    style: string;
    createdAt: Date;
  }>>([]);

  const { data: imageModels } = trpc.tools.images.listConfigured.useQuery();

  const styles = [
    { id: 'realistic', name: 'Realistic', description: 'Photorealistic images' },
    { id: 'artistic', name: 'Artistic', description: 'Creative and artistic style' },
    { id: 'cartoon', name: 'Cartoon', description: 'Cartoon-like illustrations' },
    { id: 'digital-art', name: 'Digital Art', description: 'Modern digital artwork' },
    { id: 'oil-painting', name: 'Oil Painting', description: 'Classic oil painting style' },
    { id: 'watercolor', name: 'Watercolor', description: 'Soft watercolor effect' },
  ];

  const sizes = [
    { id: '512x512', name: '512×512', description: 'Square, small' },
    { id: '1024x1024', name: '1024×1024', description: 'Square, standard' },
    { id: '1024x768', name: '1024×768', description: 'Landscape' },
    { id: '768x1024', name: '768×1024', description: 'Portrait' },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    
    // Mock image generation
    setTimeout(() => {
      const newImage = {
        id: Date.now().toString(),
        url: `https://picsum.photos/1024/1024?random=${Date.now()}`,
        prompt,
        style: selectedStyle,
        createdAt: new Date(),
      };
      setGeneratedImages(prev => [newImage, ...prev]);
      setIsGenerating(false);
    }, 3000);
  };

  const promptSuggestions = [
    "A serene mountain landscape at sunset",
    "Modern minimalist living room interior",
    "Abstract geometric pattern in blue and gold",
    "Portrait of a wise elderly woman",
    "Futuristic city skyline at night",
    "Cozy coffee shop with warm lighting",
  ];

  return (
    <div className="h-full bg-gray-50 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <PhotoIcon className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Image Factory</h1>
          </div>
          <p className="text-gray-600">Generate stunning images from text descriptions using AI</p>
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
            <span>Models:</span>
            {imageModels?.map((model, index) => (
              <span key={model} className="bg-gray-100 px-2 py-1 rounded">
                {model}
                {index < imageModels.length - 1 && ', '}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Generation Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-purple-600" />
                Generate Image
              </h2>

              {/* Prompt Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe your image
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A beautiful sunset over a mountain range..."
                  className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Quick Suggestions */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick suggestions
                </label>
                <div className="flex flex-wrap gap-2">
                  {promptSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setPrompt(suggestion)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full text-gray-700 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Style
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {styles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`p-3 text-left border rounded-lg transition-colors ${
                        selectedStyle === style.id
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-sm">{style.name}</div>
                      <div className="text-xs text-gray-500">{style.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size.id)}
                      className={`p-3 text-left border rounded-lg transition-colors ${
                        selectedSize === size.id
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-sm">{size.name}</div>
                      <div className="text-xs text-gray-500">{size.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Generating...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-4 h-4" />
                    Generate Image
                  </>
                )}
              </button>
            </div>

            {/* Settings */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Cog6ToothIcon className="w-5 h-5 text-gray-600" />
                Advanced Settings
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quality: High
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    defaultValue="4"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Creativity: Balanced
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    defaultValue="3"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Generated Images Gallery */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Generated Images</h2>
              
              {generatedImages.length === 0 ? (
                <div className="text-center py-12">
                  <PhotoIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No images yet</h3>
                  <p className="text-gray-500">Generate your first image to see it here</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {generatedImages.map((image) => (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="group relative bg-gray-100 rounded-lg overflow-hidden"
                    >
                      <img
                        src={image.url}
                        alt={image.prompt}
                        className="w-full aspect-square object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center text-white p-4">
                          <p className="text-sm font-medium mb-2">"{image.prompt}"</p>
                          <p className="text-xs">Style: {image.style}</p>
                          <div className="flex gap-2 mt-3">
                            <button className="bg-white text-gray-900 px-3 py-1 rounded text-xs hover:bg-gray-100">
                              Download
                            </button>
                            <button className="bg-white text-gray-900 px-3 py-1 rounded text-xs hover:bg-gray-100">
                              Share
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageFactoryPage; 