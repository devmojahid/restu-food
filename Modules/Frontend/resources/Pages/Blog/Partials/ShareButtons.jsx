import React from 'react';
import { 
    Facebook, 
    Twitter, 
    Linkedin, 
    Link2, 
    Mail, 
    MessageSquare,
    Copy, 
    Check,
    Share2
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { useToast } from '@/Components/ui/use-toast';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/Components/ui/tooltip';

const ShareButtons = ({ url, title, description, image }) => {
    const { toast } = useToast();
    const [copied, setCopied] = React.useState(false);

    const shareData = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
        email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            toast({
                title: "Link copied!",
                description: "The link has been copied to your clipboard.",
            });
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast({
                title: "Failed to copy",
                description: "Please try again or copy the URL manually.",
                variant: "destructive",
            });
        }
    };

    const shareButtons = [
        {
            name: 'Facebook',
            icon: Facebook,
            url: shareData.facebook,
            color: 'hover:bg-[#1877F2] hover:text-white',
            onClick: () => window.open(shareData.facebook, '_blank')
        },
        {
            name: 'Twitter',
            icon: Twitter,
            url: shareData.twitter,
            color: 'hover:bg-[#1DA1F2] hover:text-white',
            onClick: () => window.open(shareData.twitter, '_blank')
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            url: shareData.linkedin,
            color: 'hover:bg-[#0A66C2] hover:text-white',
            onClick: () => window.open(shareData.linkedin, '_blank')
        },
        {
            name: 'WhatsApp',
            icon: MessageSquare,
            url: shareData.whatsapp,
            color: 'hover:bg-[#25D366] hover:text-white',
            onClick: () => window.open(shareData.whatsapp, '_blank')
        },
        {
            name: 'Email',
            icon: Mail,
            url: shareData.email,
            color: 'hover:bg-gray-800 hover:text-white',
            onClick: () => window.location.href = shareData.email
        }
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex flex-col space-y-4">
                {/* Share Header */}
                <div className="flex items-center gap-2 mb-2">
                    <Share2 className="w-4 h-4" />
                    <h3 className="font-medium">Share this post</h3>
                </div>

                {/* Share Preview */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    {image && (
                        <img 
                            src={image} 
                            alt={title}
                            className="w-20 h-20 object-cover rounded-lg"
                        />
                    )}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{title}</h3>
                        {description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Share Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                    <TooltipProvider>
                        {shareButtons.map((button) => (
                            <Tooltip key={button.name}>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className={`transition-colors duration-200 ${button.color}`}
                                        onClick={button.onClick}
                                    >
                                        <button.icon className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Share on {button.name}</p>
                                </TooltipContent>
                            </Tooltip>
                        ))}

                        {/* Copy Link Button */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="transition-colors duration-200 hover:bg-gray-800 hover:text-white"
                                    onClick={handleCopyLink}
                                >
                                    {copied ? (
                                        <Check className="w-4 h-4" />
                                    ) : (
                                        <Copy className="w-4 h-4" />
                                    )}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Copy link</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </div>
    );
};

export default ShareButtons; 