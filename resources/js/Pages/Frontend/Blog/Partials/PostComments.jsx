import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Textarea } from '@/Components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { MessageCircle, ThumbsUp, Flag, Reply, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";
import { format, formatDistanceToNow } from 'date-fns';

const Comment = ({ comment, onReply, onLike, onReport, currentUser }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [isLiked, setIsLiked] = useState(comment.is_liked_by_user);
    const [likesCount, setLikesCount] = useState(comment.likes_count);

    const handleLike = async () => {
        try {
            await onLike(comment.id);
            setIsLiked(!isLiked);
            setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
        } catch (error) {
            console.error('Error liking comment:', error);
        }
    };

    return (
        <div className="flex gap-4">
            <Avatar className="w-10 h-10">
                <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                <AvatarFallback>
                    {comment.user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h4 className="font-medium">{comment.user.name}</h4>
                            <p className="text-sm text-muted-foreground">
                                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                            </p>
                        </div>
                        
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Flag className="w-4 h-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Report Comment</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to report this comment? This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => onReport(comment.id)}>
                                        Report
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>

                    <div className="flex items-center gap-4 mt-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(isLiked && "text-primary")}
                            onClick={handleLike}
                        >
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            {likesCount}
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowReplyForm(!showReplyForm)}
                        >
                            <Reply className="w-4 h-4 mr-1" />
                            Reply
                        </Button>
                    </div>
                </div>

                {showReplyForm && (
                    <div className="mt-4">
                        <CommentForm 
                            onSubmit={(content) => {
                                onReply(comment.id, content);
                                setShowReplyForm(false);
                            }}
                            placeholder={`Reply to ${comment.user.name}...`}
                        />
                    </div>
                )}

                {comment.replies?.length > 0 && (
                    <div className="mt-4 space-y-4">
                        {comment.replies.map((reply) => (
                            <Comment
                                key={reply.id}
                                comment={reply}
                                onReply={onReply}
                                onLike={onLike}
                                onReport={onReport}
                                currentUser={currentUser}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const CommentForm = ({ onSubmit, placeholder = "Write a comment..." }) => {
    const { data, setData, post, processing, reset, errors } = useForm({
        content: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(data.content);
        reset();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
                value={data.content}
                onChange={e => setData('content', e.target.value)}
                placeholder={placeholder}
                rows={3}
                error={errors.content}
            />
            <div className="flex justify-end">
                <Button 
                    type="submit" 
                    disabled={processing || !data.content.trim()}
                >
                    {processing ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Posting...
                        </>
                    ) : (
                        'Post Comment'
                    )}
                </Button>
            </div>
        </form>
    );
};

const PostComments = ({ comments, currentUser }) => {
    const handleReply = (commentId, content) => {
        // Implement reply logic
    };

    const handleLike = (commentId) => {
        // Implement like logic
    };

    const handleReport = (commentId) => {
        // Implement report logic
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <h2 className="text-xl font-semibold">
                    Comments ({comments?.length || 0})
                </h2>
            </div>

            <CommentForm onSubmit={(content) => handleReply(null, content)} />

            <div className="space-y-6">
                {comments?.map((comment) => (
                    <Comment
                        key={comment.id}
                        comment={comment}
                        onReply={handleReply}
                        onLike={handleLike}
                        onReport={handleReport}
                        currentUser={currentUser}
                    />
                ))}
            </div>
        </div>
    );
};

export default PostComments; 