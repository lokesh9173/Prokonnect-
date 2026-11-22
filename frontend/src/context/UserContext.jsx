import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { getApiUrl } from '../config/api';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const { addToast } = useToast();
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('prokonnect_user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [role, setRole] = useState(() => localStorage.getItem('prokonnect_role') || (user?.role || null));

    // Global Appearance State
    const [appearance, setAppearance] = useState(() => {
        const saved = localStorage.getItem('prokonnect_appearance');
        return saved ? JSON.parse(saved) : { theme: 'light', language: 'en' };
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('prokonnect_user', JSON.stringify(user));
            if (user.role) {
                setRole(user.role);
                localStorage.setItem('prokonnect_role', user.role);
            }
            // Fetch remote settings if possible
            if (user.token) {
                fetch(getApiUrl('/api/users/settings'), {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data && data.theme) {
                            setAppearance({
                                theme: data.theme || 'light',
                                language: data.language || 'en'
                            });
                        }
                    })
                    .catch(err => console.error(err));
            }
        } else {
            localStorage.removeItem('prokonnect_user');
            localStorage.removeItem('prokonnect_role');
            setRole(null);
        }
    }, [user, user?.token]);

    // Apply Theme Globally
    useEffect(() => {
        localStorage.setItem('prokonnect_appearance', JSON.stringify(appearance));
        if (appearance.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [appearance.theme, appearance.language]);

    const login = async (email, password) => {
        try {
            const res = await fetch(getApiUrl('/api/auth/login'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            let data;
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                data = await res.json();
            } else {
                data = { message: 'Server is unreachable or returned an invalid response.' };
            }

            if (!res.ok) {
                throw new Error(data.message || 'Login failed');
            }

            setUser(data);
            addToast(`Welcome back, ${data.name}!`, 'success');
            return data;
        } catch (error) {
            let msg = error.message;
            if (msg === 'Failed to fetch' || msg.includes('Server is unreachable')) {
                msg = 'Cannot connect to server. Please ensure the backend is running.';
            }
            addToast(msg, 'error');
            return false;
        }
    };

    const register = async (name, email, password, role = 'influencer') => {
        try {
            const res = await fetch(getApiUrl('/api/auth/register'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role }),
            });

            let data;
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                data = await res.json();
            } else {
                data = { message: 'Server is unreachable or returned an invalid response.' };
            }

            if (!res.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            setUser(data);
            if (data.role) {
                setRole(data.role);
                localStorage.setItem('prokonnect_role', data.role);
            }
            addToast('Account created successfully!', 'success');
            return true;
        } catch (error) {
            let msg = error.message;
            if (msg === 'Failed to fetch' || msg.includes('Server is unreachable')) {
                msg = 'Cannot connect to server. Please ensure the backend is running.';
            }
            addToast(msg, 'error');
            return false;
        }
    };


    const logout = () => {
        setUser(null);
        setRole(null);
        localStorage.removeItem('prokonnect_user');
        localStorage.removeItem('prokonnect_role');
        addToast('Logged out successfully', 'info');
        // Optional: Redirect to login is handled by protected routes or component logic
    };

    // Kept for RoleSelection page interaction, though ideally this should sync to backend
    const selectRole = async (selectedRole) => {
        try {
            setRole(selectedRole);
            localStorage.setItem('prokonnect_role', selectedRole);

            if (user && user.token) {
                const res = await fetch(getApiUrl('/api/auth/profile'), {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
                    body: JSON.stringify({ role: selectedRole }),
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Failed to update role');

                setUser(data);
                localStorage.setItem('prokonnect_user', JSON.stringify(data));
            }
        } catch (error) {
            addToast('Failed to sync role with server', 'error');
            console.error(error);
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, role, login, register, logout, selectRole, appearance, setAppearance, loading: false }}>
            {children}
        </UserContext.Provider>
    );
};
