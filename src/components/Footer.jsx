import React from "react";
import { FaFeatherAlt, FaTwitter, FaGithub, FaLinkedin, FaEnvelope, FaRss, FaHeart } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-12 lg:py-16">
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <FaFeatherAlt className="text-xl sm:text-2xl lg:text-3xl text-purple-400" />
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              BLOGBOX
            </h3>
          </div>
          <p className="text-gray-400 max-w-md mx-auto italic text-sm sm:text-base px-4 sm:px-0">
            "Where words find their wings and stories come alive"
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8 lg:mb-12">
          {/* About */}
          <div className="text-center sm:text-left lg:text-left">
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-purple-400">About</h4>
            <p className="text-gray-400 text-sm leading-relaxed px-4 sm:px-0">
              A sanctuary for writers and readers. Where every story matters and every word counts.
            </p>
          </div>

          {/* Connect */}
          <div className="text-center sm:col-span-2 lg:col-span-1">
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-purple-400">Connect</h4>
            <div className="flex justify-center space-x-2 sm:space-x-3 lg:space-x-4">
              <a
                href="https://twitter.com"
                className="text-lg sm:text-xl hover:text-purple-400 transition-colors p-2 rounded-full hover:bg-gray-800/50"
                title="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="https://github.com"
                className="text-lg sm:text-xl hover:text-purple-400 transition-colors p-2 rounded-full hover:bg-gray-800/50"
                title="GitHub"
              >
                <FaGithub />
              </a>
              <a
                href="https://linkedin.com"
                className="text-lg sm:text-xl hover:text-purple-400 transition-colors p-2 rounded-full hover:bg-gray-800/50"
                title="LinkedIn"
              >
                <FaLinkedin />
              </a>
              <a
                href="mailto:hello@inkwell.com"
                className="text-lg sm:text-xl hover:text-purple-400 transition-colors p-2 rounded-full hover:bg-gray-800/50"
                title="Email"
              >
                <FaEnvelope />
              </a>
            </div>
          </div>

          {/* RSS */}
          <div className="text-center sm:text-center lg:text-right sm:col-span-2 lg:col-span-1">
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-purple-400">Subscribe</h4>
            <a
              href="/rss"
              className="inline-flex items-center text-gray-400 hover:text-purple-400 transition-colors text-sm sm:text-base"
            >
              <FaRss className="mr-2 text-sm sm:text-base" />
              RSS Feed
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-4 sm:pt-6 lg:pt-8 text-center">
          <p className="text-gray-400 mb-2 flex items-center justify-center text-sm sm:text-base">
            Made with <FaHeart className="text-red-500 mx-1 sm:mx-2 animate-pulse text-sm sm:text-base" />
          </p>
          <p className="text-xs sm:text-sm text-gray-500">
            © {new Date().getFullYear()} BLOGBOX. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;