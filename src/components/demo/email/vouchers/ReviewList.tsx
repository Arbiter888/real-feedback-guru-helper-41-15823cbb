import { useState } from "react";
import { Review } from "../ReviewVoucherSection";
import { ReviewCard } from "./ReviewCard";
import { VoucherSuggestions } from "./VoucherSuggestions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThumbsUp, Heart, Meh, ThumbsDown } from "lucide-react";

interface ReviewListProps {
  reviews: Review[];
  onGenerateVoucher: (review: Review) => Promise<void>;
}

type SentimentCategory = 'all' | 'highly_positive' | 'positive' | 'neutral' | 'negative';

export const ReviewList = ({ reviews, onGenerateVoucher }: ReviewListProps) => {
  const [selectedSentiment, setSelectedSentiment] = useState<SentimentCategory>('all');

  // Helper function to get sentiment category
  const getSentimentCategory = (text: string): SentimentCategory => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('loved') || lowerText.includes('amazing')) return 'highly_positive';
    if (lowerText.includes('good') || lowerText.includes('nice')) return 'positive';
    if (lowerText.includes('okay') || lowerText.includes('average')) return 'neutral';
    if (lowerText.includes('bad') || lowerText.includes('terrible')) return 'negative';
    return 'positive';
  };

  // Filter reviews based on selected sentiment
  const filteredReviews = reviews.filter(review => 
    selectedSentiment === 'all' || getSentimentCategory(review.review_text) === selectedSentiment
  );

  // Group reviews by sentiment
  const groupedReviews = filteredReviews.reduce((acc, review) => {
    const sentiment = getSentimentCategory(review.review_text);
    if (!acc[sentiment]) {
      acc[sentiment] = [];
    }
    acc[sentiment].push(review);
    return acc;
  }, {} as Record<string, Review[]>);

  // Helper function to get section title and icon
  const getSectionInfo = (category: string): { title: string; icon: any } => {
    switch (category) {
      case 'highly_positive':
        return { title: '⭐️ Extremely Satisfied Customers', icon: ThumbsUp };
      case 'positive':
        return { title: '😊 Happy Customers', icon: Heart };
      case 'neutral':
        return { title: '😐 Neutral Experiences', icon: Meh };
      case 'negative':
        return { title: '😔 Areas for Improvement', icon: ThumbsDown };
      default:
        return { title: 'Reviews', icon: Heart };
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Filter by sentiment:</span>
        <Select
          value={selectedSentiment}
          onValueChange={(value) => setSelectedSentiment(value as SentimentCategory)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select sentiment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reviews</SelectItem>
            <SelectItem value="highly_positive">Extremely Satisfied</SelectItem>
            <SelectItem value="positive">Happy Customers</SelectItem>
            <SelectItem value="neutral">Neutral Experiences</SelectItem>
            <SelectItem value="negative">Areas for Improvement</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {Object.entries(groupedReviews).map(([category, categoryReviews]) => {
        const { title, icon: Icon } = getSectionInfo(category);
        return (
          <div key={category} className="space-y-4">
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5" />
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <div className="space-y-6">
              {categoryReviews.map((review) => (
                <div key={review.id} className="space-y-4">
                  <ReviewCard 
                    review={review}
                    customerEmail="customer@example.com" // In a real app, this would come from your database
                  />
                  <VoucherSuggestions 
                    review={review}
                    onGenerateVoucher={onGenerateVoucher}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {filteredReviews.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No reviews found for the selected sentiment.
        </div>
      )}
    </div>
  );
};