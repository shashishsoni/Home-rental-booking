import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Globe } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { title: 'About Us', path: '/about-us' },
    { title: 'Careers', path: '/careers' },
    { title: 'Press', path: '/press' },
    { title: 'Blog', path: '/blog' },
    { title: 'Gift Cards', path: '/gift-cards' }
  ];

  const policies = [
    { title: 'Terms & Conditions', path: '/terms-conditions' },
    { title: 'Privacy Policy', path: '/privacy-policy' },
    { title: 'Refund Policy', path: '/refund-policy' },
    { title: 'Cancellation Policy', path: '/cancellation-policy' },
    { title: 'Guest Guidelines', path: '/guest-guidelines' }
  ];

  return (
    <footer className="border-t border-white/10 bg-black/90 backdrop-blur-lg">
      <div className="w-[95%] mx-auto py-12 px-4 sm:px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-4 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
                HomeRental
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto sm:mx-0">
              Discover unique stays and experiences around the world. HomeRental makes it easy to find and book the perfect accommodation for your next adventure.
            </p>
            <div className="flex space-x-4 justify-center sm:justify-start">
              <a href="https://facebook.com" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 sm:mt-0 text-center sm:text-left">
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.title}>
                  <Link 
                    to={link.path}
                    className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div className="mt-8 lg:mt-0 text-center sm:text-left">
            <h3 className="text-white font-semibold mb-4">Policies</h3>
            <ul className="space-y-3">
              {policies.map((policy) => (
                <li key={policy.title}>
                  <Link 
                    to={policy.path}
                    className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
                  >
                    {policy.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="mt-8 lg:mt-0">
            <h3 className="text-white font-semibold mb-4 text-center sm:text-left">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-gray-400 justify-center sm:justify-start">
                <MapPin className="h-5 w-5 text-purple-400 flex-shrink-0" />
                <span className="text-sm">123 Travel Street, Adventure City, AC 12345</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400 justify-center sm:justify-start">
                <Phone className="h-5 w-5 text-purple-400 flex-shrink-0" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400 justify-center sm:justify-start">
                <Mail className="h-5 w-5 text-purple-400 flex-shrink-0" />
                <span className="text-sm">support@homerental.com</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400 justify-center sm:justify-start">
                <Globe className="h-5 w-5 text-purple-400 flex-shrink-0" />
                <span className="text-sm">www.homerental.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-gray-400 text-sm text-center w-full sm:w-auto">
              © {currentYear} HomeRental. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 w-full sm:w-auto">
              <Link
                to="/terms-conditions"
                className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
              >
                Terms
              </Link>
              <Link
                to="/privacy-policy"
                className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
              >
                Privacy
              </Link>
              <Link
                to="/cookie-settings"
                className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 