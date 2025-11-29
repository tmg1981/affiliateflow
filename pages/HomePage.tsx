
import React from 'react';
import { Link } from 'react-router-dom';
import { RocketLaunchIcon, DocumentTextIcon, PhotoIcon } from '@heroicons/react/24/outline';

const HomePage: React.FC = () => {
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
        Welcome to <span className="text-teal-400">AffiliateFlow</span>
      </h1>
      <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
        Supercharge your affiliate marketing with AI. Generate high-converting, SEO-optimized promotional pages in minutes.
      </p>
      <Link
        to="/create"
        className="inline-block bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
      >
        Create Your First Post Now
      </Link>

      <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
        <div className="bg-gray-800 p-6 rounded-lg">
          <RocketLaunchIcon className="h-10 w-10 text-teal-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Fast Generation</h3>
          <p className="text-gray-400">Go from product idea to a complete promotional page with text and images in under a minute.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <DocumentTextIcon className="h-10 w-10 text-teal-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">High-Converting Copy</h3>
          <p className="text-gray-400">Leverage powerful AI to write persuasive, American-style marketing copy that sells.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <PhotoIcon className="h-10 w-10 text-teal-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Stunning AI Images</h3>
          <p className="text-gray-400">Generate unique, royalty-free images for your hero section, features, and call-to-action banners.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
