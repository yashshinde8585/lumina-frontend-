import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../Logo';
import { Twitter, Linkedin, Github, Mail, Heart } from 'lucide-react';

const HomeFooter = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            { label: 'Resume Builder', href: '/generate', isExternal: false },
            { label: 'ATS Checker', href: '#features', isExternal: false },
            { label: 'Templates', href: '#features', isExternal: false },
        ]
    };

    return (
        <footer className="bg-slate-900 pt-0 relative overflow-hidden">

            {/* 1. CTA Section */}
            <div className="relative border-b border-white/10 bg-white/5 backdrop-blur-3xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center text-center">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4 tracking-tight">
                        Ready to land your dream job?
                    </h2>
                    <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                        Join thousands of job seekers who are getting hired faster with our AI-powered resume builder.
                    </p>
                    <Link to="/generate">
                        <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-full font-semibold text-base transition-all shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] hover:shadow-[0_0_30px_-5px_rgba(37,99,235,0.6)] hover:-translate-y-1">
                            Build My Resume Now
                        </button>
                    </Link>
                </div>
            </div>

            {/* 2. Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">

                    {/* Brand */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <Link to="/" className="flex items-center gap-2 mb-4 group">
                            <Logo size={32} />
                            <span className="font-heading font-bold text-2xl text-white tracking-tight">ResumeAI</span>
                        </Link>
                        <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
                            The smartest way to build, track, and optimize your resume for modern hiring systems.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="flex flex-wrap justify-center gap-8">
                        {footerLinks.product.map((link) => (
                            <Link
                                key={link.label}
                                to={link.href}
                                className="text-gray-400 hover:text-white font-medium transition-colors text-sm"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <a
                            href="mailto:support@resumeai.com"
                            className="text-gray-400 hover:text-white font-medium transition-colors text-sm"
                        >
                            Contact
                        </a>
                    </div>

                    {/* Socials */}
                    <div className="flex items-center gap-4">
                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:border-blue-500 hover:text-white transition-all group">
                            <Twitter size={18} className="group-hover:scale-110 transition-transform" />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-blue-700 hover:border-blue-600 hover:text-white transition-all group">
                            <Linkedin size={18} className="group-hover:scale-110 transition-transform" />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-gray-800 hover:border-gray-700 hover:text-white transition-all group">
                            <Github size={18} className="group-hover:scale-110 transition-transform" />
                        </a>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-xs">
                        © {currentYear} ResumeAI.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">Privacy Policy</a>
                        <a href="#" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>

            {/* Ambient Background Light */}
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none"></div>
        </footer>
    );
};

export default HomeFooter;
