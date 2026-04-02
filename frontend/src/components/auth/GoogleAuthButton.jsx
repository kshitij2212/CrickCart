import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function GoogleAuthButton() {
    const navigate = useNavigate();
    const { googleLogin } = useAuth();
    const initialized = useRef(false);

    const handleCredentialResponse = async (response) => {
        try {
            await googleLogin(response.credential);
            navigate('/');
        } catch (error) {
            console.error('Google login failed:', error);
        }
    };

    useEffect(() => {
        if (initialized.current) return;

        const initGoogle = () => {
            if (!window.google) return;
            initialized.current = true;

            window.google.accounts.id.initialize({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                callback: handleCredentialResponse,
            });

            window.google.accounts.id.renderButton(
                document.getElementById('google-signin-btn'),
                {
                    theme: 'filled_black',
                    size: 'large',
                    width: 400,
                    text: 'continue_with',
                    shape: 'rectangular',
                }
            );
        };

        if (window.google) {
            initGoogle();
        } else {
            const interval = setInterval(() => {
                if (window.google) {
                    initGoogle();
                    clearInterval(interval);
                }
            }, 100);
            return () => clearInterval(interval);
        }
    }, []);

    return <div id="google-signin-btn" className="w-full" />;
}
