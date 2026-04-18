import React from "react";
import { Link } from "react-router-dom";
import { Palette, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Poster Hub
              </span>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              Create stunning posters in minutes with our easy-to-use design tool. 
              Perfect for businesses, events, and personal projects.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-pink-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/templates" className="text-gray-600 hover:text-pink-600 text-sm transition-colors">Templates</Link></li>
              <li><Link to="/features" className="text-gray-600 hover:text-pink-600 text-sm transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="text-gray-600 hover:text-pink-600 text-sm transition-colors">Pricing</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-pink-600 text-sm transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Categories</h4>
            <ul className="space-y-2">
              <li><Link to="/templates?category=birthday" className="text-gray-600 hover:text-pink-600 text-sm transition-colors">Birthday</Link></li>
              <li><Link to="/templates?category=business" className="text-gray-600 hover:text-pink-600 text-sm transition-colors">Business</Link></li>
              <li><Link to="/templates?category=festivals" className="text-gray-600 hover:text-pink-600 text-sm transition-colors">Festivals</Link></li>
              <li><Link to="/templates?category=wedding" className="text-gray-600 hover:text-pink-600 text-sm transition-colors">Wedding</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-600 text-sm">
                <MapPin className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
                <span>123 Design Street, Creative City, CA 90210</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600 text-sm">
                <Mail className="w-5 h-5 text-pink-500 shrink-0" />
                <span>hello@posterhub.com</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600 text-sm">
                <Phone className="w-5 h-5 text-pink-500 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Poster Hub. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-gray-500 hover:text-pink-600 transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-pink-600 transition-colors">Terms of Service</a>
            <a href="#" className="text-sm text-gray-500 hover:text-pink-600 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
