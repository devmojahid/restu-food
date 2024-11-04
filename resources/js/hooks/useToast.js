import toast from 'react-hot-toast';
import {
    CheckCircle2,
    XCircle,
    AlertCircle,
    Info,
    AlertTriangle
} from "lucide-react";

export const useToast = () => {
    const showToast = (message, type = 'default') => {
        const toastConfig = {
            duration: 5000,
            position: "top-right",
        };

        const getIcon = (type) => {
            switch (type) {
                case 'success':
                    return <CheckCircle2 className="w-5 h-5 text-green-500" />;
                case 'error':
                    return <XCircle className="w-5 h-5 text-red-500" />;
                case 'warning':
                    return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
                case 'info':
                    return <Info className="w-5 h-5 text-blue-500" />;
                default:
                    return <AlertCircle className="w-5 h-5 text-gray-500" />;
            }
        };

        const getStyle = (type) => {
            switch (type) {
                case 'success':
                    return {
                        background: '#f0fdf4',
                        border: '1px solid #86efac',
                        color: '#166534',
                    };
                case 'error':
                    return {
                        background: '#fef2f2',
                        border: '1px solid #fca5a5',
                        color: '#991b1b',
                    };
                case 'warning':
                    return {
                        background: '#fffbeb',
                        border: '1px solid #fcd34d',
                        color: '#92400e',
                    };
                case 'info':
                    return {
                        background: '#eff6ff',
                        border: '1px solid #93c5fd',
                        color: '#1e40af',
                    };
                default:
                    return {
                        background: '#f9fafb',
                        border: '1px solid #d1d5db',
                        color: '#374151',
                    };
            }
        };

        toast(message, {
            ...toastConfig,
            icon: getIcon(type),
            style: getStyle(type),
        });
    };

    return { showToast };
}; 