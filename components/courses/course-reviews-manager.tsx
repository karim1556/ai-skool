"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Review {
  id: string;
  user: string;
  user_image: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface CourseReviewsManagerProps {
  reviews: Review[];
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
    </div>
  );
};

export const CourseReviewsManager = ({ reviews }: CourseReviewsManagerProps) => {
  if (!reviews || reviews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Student Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No reviews have been submitted for this course yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Feedback & Reviews</CardTitle>
        <p className="text-sm text-gray-500">Here's what students are saying about this course.</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="flex items-start space-x-4 border-b pb-4 last:border-b-0">
            <Avatar>
              <AvatarImage src={review.user_image} alt={review.user} />
              <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{review.user}</h4>
                <span className="text-xs text-gray-500">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              <StarRating rating={review.rating} />
              <p className="mt-2 text-gray-700">{review.comment}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CourseReviewsManager;
