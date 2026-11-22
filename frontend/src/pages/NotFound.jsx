import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-md w-full">
                <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle size={40} />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Page Not Found</h1>
                <p className="text-slate-600 mb-8">
                    Oops! The page you are looking for doesn't exist or has been moved.
                </p>
                <Link
                    to="/"
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Home size={20} /> Go Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
