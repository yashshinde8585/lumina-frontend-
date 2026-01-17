import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/Logo';
import { FileQuestion, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 font-sans text-center">
            <div className="mb-8">
                <Logo size={64} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FileQuestion size={32} />
                    </div>

                    <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
                    <p className="text-gray-500 mb-8">
                        Oops! The page you're looking for doesn't exist or has been moved.
                    </p>

                    <Link to="/">
                        <Button className="w-full flex items-center justify-center gap-2">
                            <Home size={18} />
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </motion.div>

            <p className="mt-8 text-sm text-gray-400">
                © 2025 Lumina
            </p>
        </div>
    );
};

export default NotFound;
