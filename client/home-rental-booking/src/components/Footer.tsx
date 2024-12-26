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
    <footer className="border-t-[1px]">
      <div className=" mt-10 max-w-full mx-auto sm:px-6 lg:px-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="StayEase" className="h-8 w-auto" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
                HomeRental
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Discover unique stays and experiences around the world. StayEase makes it easy to find and book the perfect accommodation for your next adventure.
            </p>
            <div className="flex space-x-4">
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
          <div>
            <h3 className="text-white font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4">
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
          <div>
            <h3 className="text-white font-semibold mb-6">Policies</h3>
            <ul className="space-y-4">
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
          <div>
            <h3 className="text-white font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-gray-400">
                <MapPin className="h-5 w-5 text-purple-400" />
                <span className="text-sm">123 Travel Street, Adventure City, AC 12345</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Phone className="h-5 w-5 text-purple-400" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Mail className="h-5 w-5 text-purple-400" />
                <span className="text-sm">support@homerental.com</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Globe className="h-5 w-5 text-purple-400" />
                <span className="text-sm">www.homerental.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pb-10 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} HomeRental. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                to="/terms-conditions"
                className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
              >
                Terms & Conditions
              </Link>
              <Link
                to="/privacy-policy"
                className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                to="/refund-policy"
                className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
              >
                Refund Policy
              </Link>
              <Link
                to="/cookie-settings"
                className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
              >
                Cookie Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 