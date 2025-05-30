import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Bot, ChevronDown, Clock, X } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { cn } from '@/lib/utils';
import { useForm } from '@inertiajs/react';

// Demo avatars
const BOT_AVATAR = '/images/support/bot-avatar.png';
const DEFAULT_USER_AVATAR = '/images/support/user-avatar.png';

const LiveChat = ({ data }) => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const { data: formData, setData, post, processing, reset } = useForm({
        message: '',
        name: '',
        email: '',
        offline_message: '',
    });

    // If no data is provided, return null
    if (!data) return null;

    // Simulate bot typing and response
    const simulateBotResponse = (userMessage) => {
        setIsTyping(true);

        // Find a relevant quick reply if available
        const relevantReply = data.quickReplies?.find(reply =>
            userMessage.toLowerCase().includes(reply.toLowerCase())
        );

        let botResponse;

        // Check for specific keywords and provide appropriate responses
        if (userMessage.toLowerCase().includes('track') && userMessage.toLowerCase().includes('order')) {
            botResponse = "To track your order, please go to the 'Order Tracking' page and enter your order number. Alternatively, you can also find tracking information in the confirmation email we sent you.";
        } else if (userMessage.toLowerCase().includes('account')) {
            botResponse = "For account related issues, you can visit the 'My Account' section. If you're having trouble logging in, try resetting your password. If you still need help, please provide more details about your account issue.";
        } else if (userMessage.toLowerCase().includes('refund') || userMessage.toLowerCase().includes('money back')) {
            botResponse = "Our refund policy allows returns within 14 days of delivery. To request a refund, please visit the 'My Orders' section in your account and select the order you want to return. Follow the prompts to complete your refund request.";
        } else if (relevantReply) {
            // Use a predefined response if available
            botResponse = `I see you're asking about ${relevantReply.toLowerCase()}. Let me help you with that. What specific information do you need?`;
        } else {
            // Default response
            botResponse = "Thank you for your message. How else can I assist you today? If you need to speak with a human agent, please let me know.";
        }

        // Simulate typing delay (1-2 seconds)
        setTimeout(() => {
            setIsTyping(false);
            addMessage('bot', botResponse);
        }, Math.random() * 1000 + 1000);
    };

    // Add a message to the chat
    const addMessage = (sender, text) => {
        const newMessage = {
            id: Date.now(),
            sender,
            text,
            timestamp: new Date().toISOString(),
        };

        setMessages(prevMessages => [...prevMessages, newMessage]);
    };

    // Handle message submission
    const handleSendMessage = (e) => {
        e.preventDefault();

        if (!formData.message.trim()) return;

        // Add user message
        addMessage('user', formData.message);

        // Simulate bot response
        simulateBotResponse(formData.message);

        // Clear input
        reset('message');

        // Focus input again
        inputRef.current?.focus();
    };

    // Handle quick reply selection
    const handleQuickReply = (reply) => {
        // Add user message
        addMessage('user', reply);

        // Simulate bot response
        simulateBotResponse(reply);
    };

    // Handle offline message submission
    const handleOfflineSubmit = (e) => {
        e.preventDefault();

        // Here you would typically send the offline message to your backend
        console.log('Offline message submitted:', formData);

        // For demo purposes, we'll just show a confirmation
        alert('Your message has been received. We will get back to you shortly.');

        // Reset the form
        reset();
    };

    // Auto-scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // Initialize chat with bot greeting
    useEffect(() => {
        if (isChatOpen && messages.length === 0) {
            setTimeout(() => {
                addMessage('bot', data.introMessage || 'Hello! How can I help you today?');
            }, 500);
        }
    }, [isChatOpen]);

    // Format timestamp
    const formatTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="bg-primary px-6 py-5 flex justify-between items-center">
                <div className="flex items-center">
                    <div className="relative mr-3">
                        <img
                            src={BOT_AVATAR || '/images/bot-placeholder.png'}
                            alt="Chat Bot"
                            className="w-10 h-10 rounded-full bg-white object-cover"
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div>
                        <h3 className="text-white font-semibold">
                            {data.botName || 'Support Bot'}
                        </h3>
                        <div className="flex items-center text-white/80 text-xs">
                            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                            Online
                        </div>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-primary-600"
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    aria-label={isChatOpen ? 'Minimize chat' : 'Expand chat'}
                >
                    {isChatOpen ? <X className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </Button>
            </div>

            {/* Chat Content */}
            <div className={cn(
                "flex-grow flex flex-col transition-all duration-300 ease-in-out",
                isChatOpen ? "max-h-[500px]" : "max-h-0"
            )}>
                {data.available ? (
                    <>
                        {/* Chat Messages */}
                        <div className="flex-grow p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900/30">
                            <div className="space-y-4">
                                {messages.map(message => (
                                    <motion.div
                                        key={message.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "flex",
                                            message.sender === 'user' ? "justify-end" : "justify-start"
                                        )}
                                    >
                                        <div className={cn(
                                            "max-w-[80%] rounded-2xl px-4 py-3",
                                            message.sender === 'user'
                                                ? "bg-primary text-white rounded-tr-none"
                                                : "bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-tl-none"
                                        )}>
                                            <div className="flex items-center mb-1">
                                                {message.sender === 'bot' && (
                                                    <Bot className="w-4 h-4 mr-1 text-primary dark:text-primary-400" />
                                                )}
                                                <div className={cn(
                                                    "text-xs",
                                                    message.sender === 'user' ? "text-white/80" : "text-gray-500 dark:text-gray-400"
                                                )}>
                                                    {message.sender === 'user' ? 'You' : data.botName || 'Support Bot'} • {formatTime(message.timestamp)}
                                                </div>
                                            </div>
                                            <p className={cn(
                                                message.sender === 'user' ? "text-white" : "text-gray-800 dark:text-gray-200"
                                            )}>
                                                {message.text}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}

                                {/* Bot typing indicator */}
                                {isTyping && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex justify-start"
                                    >
                                        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-2xl rounded-tl-none px-4 py-3">
                                            <div className="flex items-center space-x-1">
                                                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Auto-scroll reference */}
                                <div ref={messagesEndRef}></div>
                            </div>
                        </div>

                        {/* Quick Replies */}
                        {data.quickReplies?.length > 0 && messages.length < 3 && (
                            <div className="p-3 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                    Quick replies:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {data.quickReplies.map((reply, index) => (
                                        <Button
                                            key={index}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleQuickReply(reply)}
                                            className="text-sm"
                                        >
                                            {reply}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Message Input */}
                        <div className="p-3 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                                <Input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Type your message..."
                                    value={formData.message}
                                    onChange={e => setData('message', e.target.value)}
                                    className="border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-primary"
                                />
                                <Button
                                    type="submit"
                                    disabled={!formData.message.trim() || processing}
                                    className="flex-shrink-0"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    // Offline Form
                    <div className="flex-grow p-6 overflow-y-auto">
                        <div className="text-center mb-6">
                            <Clock className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                We're Currently Offline
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {data.offlineMessage || 'Leave us a message and we\'ll get back to you as soon as we\'re back online.'}
                            </p>
                            {data.availableHours && (
                                <p className="text-gray-500 dark:text-gray-500 mt-2 text-sm">
                                    Available hours: {data.availableHours}
                                </p>
                            )}
                        </div>

                        <form onSubmit={handleOfflineSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    type="text"
                                    placeholder="Your name"
                                    value={formData.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-primary"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Input
                                    type="email"
                                    placeholder="Your email"
                                    value={formData.email}
                                    onChange={e => setData('email', e.target.value)}
                                    className="border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-primary"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Textarea
                                    placeholder="Your message"
                                    value={formData.offline_message}
                                    onChange={e => setData('offline_message', e.target.value)}
                                    className="border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-primary"
                                    rows={4}
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={processing}>
                                {processing ? 'Sending...' : 'Send Message'}
                            </Button>
                        </form>
                    </div>
                )}
            </div>

            {/* Chat Info (when closed) */}
            {!isChatOpen && (
                <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{data.waitTime || 'Typical response time: < 2 min'}</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsChatOpen(true)}
                            className="text-primary"
                        >
                            Start chatting
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LiveChat; 