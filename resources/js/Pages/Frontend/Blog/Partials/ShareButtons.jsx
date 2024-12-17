import React from 'react';
import { motion } from 'framer-motion';
import { 
    Facebook, 
    Twitter, 
    Linkedin, 
    Link2, 
    Mail 
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { useToast } from '@/Components/ui/use-toast';

const ShareButtons = ({ post }) => {
    const { toast } = useToast();
    const shareUrl = window.location.href;

    const shareButtons = [
        {
            icon: Facebook,
            label: 'Share on Facebook',
            onClick: () => {
                window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
                    'facebook-share',
                    'width=580,height=296'
                );
            },
            color: 'bg-[#1877f2] hover:bg-[#1877f2]/90'
        },
        {
            icon: Twitter,
            label: 'Share on Twitter',
            onClick: () => {
                window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`,
                    'twitter-share',
                    'width=580,height=296'
                );
            },
            color: 'bg-[#1da1f2] hover:bg-[#1da1f2]/90'
        },
        {
            icon: Linkedin,
            label: 'Share on LinkedIn',
            onClick: () => {
                window.open(
                    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
                    'linkedin-share',
                    'width=580,height=296'
                );
            },
            color: 'bg-[#0a66c2] hover:bg-[#0a66c2]/90'
        },
        {
            icon: Link2,
            label: 'Copy Link',
            onClick: () => {
                navigator.clipboard.writeText(shareUrl).then(() => {
                    toast({
                        title: "Link Copied",
                        description: "The article link has been copied to your clipboard.",
                    });
                });
            },
            color: 'bg-gray-600 hover:bg-gray-600/90 dark:bg-gray-700 dark:hover:bg-gray-700/90'
        }
    ];

    return (
        <div className="flex flex-col gap-2">
            {shareButtons.map((button, index) => (
                <motion.div
                    key={button.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Button
                        variant="custom"
                        size="sm"
                        onClick={button.onClick}
                        className={`w-full ${button.color} text-white`}
                    >
                        <button.icon className="w-4 h-4 mr-2" />
                        {button.label}
                    </Button>
                </motion.div>
            ))}
        </div>
    );
};

export default ShareButtons; 