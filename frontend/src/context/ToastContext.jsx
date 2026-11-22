import React, { createContext, useContext, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    // Keep the same interface for the rest of the app
    const addToast = (message, type = 'success', duration = 3000) => {
        if (type === 'success') {
            toast.success(message, { id: message, duration });
        } else if (type === 'error') {
            toast.error(message, { id: message, duration });
        } else {
            // Default to generic toast for info/default
            toast(message, { id: message, duration, icon: 'ℹ️' });
        }
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
        </ToastContext.Provider>
    );
};
