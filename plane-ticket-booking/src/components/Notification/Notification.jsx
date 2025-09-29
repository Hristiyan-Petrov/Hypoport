import { useEffect } from 'react';
import './Notification.scss';

export default function Notification({
    message,
    type,
    visible,
    onClose
}) {
    if (!visible) return null;

    useEffect(() => {
        if (visible) {
            const closingTimer = setTimeout(() => {
                onClose();
            }, 3000);

            return () => clearTimeout(closingTimer);
        }
    }, [visible, onClose]);

    return (
        <div className={`notification notification-${type}`}>
            <p className="message">{message}</p>

            <button className="close-button" onClick={onClose}>
                &times;
            </button>
        </div>
    );
};