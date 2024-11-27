import React from "react";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import { Home, Star, ArrowLeft } from "lucide-react";
import Breadcrumb from "@/Components/Admin/Breadcrumb";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Rating } from "@/Components/ui/rating";
import { Badge } from "@/Components/ui/badge";
import { format } from "date-fns";
import ReviewReplies from "./Partials/Show/ReviewReplies";
import ReviewReports from "./Partials/Show/ReviewReports";
import ReviewImages from "./Partials/Show/ReviewImages";
import ReviewActions from "./Partials/Show/ReviewActions";

const ReviewShow = ({ review }) => {
  return (
    <AdminLayout>
      <Head title={`Review #${review.id}`} />
      <div className="container mx-auto py-6 px-2 sm:px-3 lg:px-4">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "dashboard", icon: Home },
            { label: "Reviews", href: "app.reviews.index", icon: Star },
            { label: `Review #${review.id}` },
          ]}
        />

        <div className="mb-6 flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Reviews
          </Button>
          
          <ReviewActions review={review} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Review Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Review Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Reviewer Info */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={review.user?.avatar} />
                    <AvatarFallback>
                      {review.user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{review.user?.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {review.user?.email}
                    </p>
                  </div>
                </div>

                {/* Review Content */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Rating value={review.rating} readOnly />
                    {review.title && (
                      <h2 className="text-lg font-medium">{review.title}</h2>
                    )}
                  </div>

                  <p className="text-gray-600 dark:text-gray-400">
                    {review.comment}
                  </p>

                  {/* Pros & Cons */}
                  {(review.pros || review.cons) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {review.pros && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-green-600">Pros</h4>
                          <p className="text-sm">{review.pros}</p>
                        </div>
                      )}
                      {review.cons && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-red-600">Cons</h4>
                          <p className="text-sm">{review.cons}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Review Images */}
                  <ReviewImages images={review.images} />

                  {/* Review Metadata */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={review.is_verified_purchase ? "success" : "secondary"}>
                      {review.is_verified_purchase ? "Verified Purchase" : "Unverified"}
                    </Badge>
                    <Badge variant={review.is_recommended ? "success" : "destructive"}>
                      {review.is_recommended ? "Recommended" : "Not Recommended"}
                    </Badge>
                    <Badge variant="outline">
                      {format(new Date(review.created_at), "PPP")}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Review Replies */}
            <ReviewReplies 
              replies={review.replies} 
              reviewId={review.id} 
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>Status Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge
                    variant={
                      review.is_approved
                        ? "success"
                        : review.status === "rejected"
                        ? "destructive"
                        : "default"
                    }
                  >
                    {review.is_approved
                      ? "Approved"
                      : review.status === "rejected"
                      ? "Rejected"
                      : "Pending"}
                  </Badge>
                </div>

                {review.is_approved && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Approved By
                      </span>
                      <span className="text-sm font-medium">
                        {review.approved_by?.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Approved At
                      </span>
                      <span className="text-sm">
                        {format(new Date(review.approved_at), "PPP")}
                      </span>
                    </div>
                  </>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Helpful Votes
                  </span>
                  <span className="text-sm font-medium">
                    {review.helpful_votes}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Unhelpful Votes
                  </span>
                  <span className="text-sm font-medium">
                    {review.unhelpful_votes}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Reports Card */}
            <ReviewReports reports={review.reports} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ReviewShow; 