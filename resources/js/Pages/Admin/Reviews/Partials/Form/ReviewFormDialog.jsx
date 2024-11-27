import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import ReviewForm from "./ReviewForm";

const ReviewFormDialog = ({ 
  trigger, 
  review = null,
  title = "Write a Review",
  description = "Share your experience with this product",
  onSuccess 
}) => {
  const [open, setOpen] = React.useState(false);

  const handleSuccess = () => {
    setOpen(false);
    if (onSuccess) onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Write a Review</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <ReviewForm review={review} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default ReviewFormDialog; 