import React from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Rating } from "@/Components/ui/rating";
import { Label } from "@/Components/ui/label";
import { Switch } from "@/Components/ui/switch";
import FileUploader from "@/Components/Admin/Filesystem/FileUploader";

const ReviewForm = ({ review = null, onSuccess }) => {
  const { data, setData, post, processing, errors } = useForm({
    rating: review?.rating || 5,
    title: review?.title || "",
    comment: review?.comment || "",
    pros: review?.pros || "",
    cons: review?.cons || "",
    is_recommended: review?.is_recommended ?? true,
    images: review?.images || [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (review) {
      post(route("app.reviews.update", review.id), {
        onSuccess,
      });
    } else {
      post(route("app.reviews.store"), {
        onSuccess,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Rating */}
      <div className="space-y-2">
        <Label>Rating</Label>
        <Rating
          value={data.rating}
          onChange={(value) => setData("rating", value)}
          size="lg"
        />
        {errors.rating && (
          <p className="text-sm text-destructive">{errors.rating}</p>
        )}
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title (Optional)</Label>
        <Input
          id="title"
          value={data.title}
          onChange={(e) => setData("title", e.target.value)}
          placeholder="Brief summary of your review"
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title}</p>
        )}
      </div>

      {/* Comment */}
      <div className="space-y-2">
        <Label htmlFor="comment">Review</Label>
        <Textarea
          id="comment"
          value={data.comment}
          onChange={(e) => setData("comment", e.target.value)}
          placeholder="Write your review here..."
          rows={5}
        />
        {errors.comment && (
          <p className="text-sm text-destructive">{errors.comment}</p>
        )}
      </div>

      {/* Pros & Cons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pros">Pros (Optional)</Label>
          <Textarea
            id="pros"
            value={data.pros}
            onChange={(e) => setData("pros", e.target.value)}
            placeholder="What did you like?"
            rows={3}
          />
          {errors.pros && (
            <p className="text-sm text-destructive">{errors.pros}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cons">Cons (Optional)</Label>
          <Textarea
            id="cons"
            value={data.cons}
            onChange={(e) => setData("cons", e.target.value)}
            placeholder="What could be improved?"
            rows={3}
          />
          {errors.cons && (
            <p className="text-sm text-destructive">{errors.cons}</p>
          )}
        </div>
      </div>

      {/* Recommendation */}
      <div className="flex items-center space-x-2">
        <Switch
          id="is_recommended"
          checked={data.is_recommended}
          onCheckedChange={(checked) => setData("is_recommended", checked)}
        />
        <Label htmlFor="is_recommended">
          I recommend this {review?.reviewable_type?.toLowerCase() || "product"}
        </Label>
      </div>

      {/* Images */}
      <div className="space-y-2">
        <Label>Images (Optional)</Label>
        <FileUploader
          maxFiles={5}
          fileType="image"
          collection="images"
          value={data.images}
          onUpload={(files) => setData("images", files)}
          description="Upload up to 5 images"
          error={errors.images}
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={processing}>
          {processing ? "Submitting..." : review ? "Update Review" : "Submit Review"}
        </Button>
      </div>
    </form>
  );
};

export default ReviewForm; 