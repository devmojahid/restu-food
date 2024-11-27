import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import { useForm } from "@inertiajs/react";
import { MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { format } from "date-fns";

const ReviewReplies = ({ replies, reviewId }) => {
  const [isReplying, setIsReplying] = useState(false);
  const { data, setData, post, processing, reset, errors } = useForm({
    comment: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("app.reviews.reply", reviewId), {
      onSuccess: () => {
        reset();
        setIsReplying(false);
      },
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Replies</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsReplying(!isReplying)}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          {isReplying ? "Cancel Reply" : "Add Reply"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {isReplying && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              value={data.comment}
              onChange={(e) => setData("comment", e.target.value)}
              placeholder="Write your reply..."
              className={errors.comment && "border-red-500"}
            />
            {errors.comment && (
              <p className="text-sm text-red-500">{errors.comment}</p>
            )}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsReplying(false)}
                disabled={processing}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={processing}>
                {processing ? "Submitting..." : "Submit Reply"}
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {replies?.map((reply) => (
            <div
              key={reply.id}
              className="flex space-x-4 p-4 rounded-lg bg-muted/50"
            >
              <Avatar>
                <AvatarImage src={reply.user?.avatar} />
                <AvatarFallback>
                  {reply.user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{reply.user?.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      {format(new Date(reply.created_at), "PPP")}
                    </span>
                  </div>
                </div>
                <p className="text-sm">{reply.comment}</p>
              </div>
            </div>
          ))}

          {replies?.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              No replies yet
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewReplies; 