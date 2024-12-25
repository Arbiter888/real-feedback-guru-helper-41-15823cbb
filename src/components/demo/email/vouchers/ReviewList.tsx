import { Review } from "../ReviewVoucherSection";
import { ReviewCard } from "./ReviewCard";
import { VoucherSuggestions } from "./VoucherSuggestions";

interface ReviewListProps {
  reviews: Review[];
  onGenerateVoucher: (review: Review) => Promise<void>;
}

export const ReviewList = ({ reviews, onGenerateVoucher }: ReviewListProps) => {
  // Group reviews by sentiment
  const groupedReviews = reviews.reduce((acc, review) => {
    const sentiment = getSentimentCategory(review.review_text);
    if (!acc[sentiment]) {
      acc[sentiment] = [];
    }
    acc[sentiment].push(review);
    return acc;
  }, {} as Record<string, Review[]>);

  // Helper function to get sentiment category
  function getSentimentCategory(text: string): string {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('loved') || lowerText.includes('amazing')) return 'highly_positive';
    if (lowerText.includes('good') || lowerText.includes('nice')) return 'positive';
    if (lowerText.includes('okay') || lowerText.includes('average')) return 'neutral';
    if (lowerText.includes('bad') || lowerText.includes('terrible')) return 'negative';
    return 'positive';
  }

  // Helper function to get section title
  function getSectionTitle(category: string): string {
    switch (category) {
      case 'highly_positive': return '⭐️ Extremely Satisfied Customers';
      case 'positive': return '😊 Happy Customers';
      case 'neutral': return '😐 Neutral Experiences';
      case 'negative': return '😔 Areas for Improvement';
      default: return 'Reviews';
    }
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedReviews).map(([category, categoryReviews]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {getSectionTitle(category)}
          </h3>
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
      ))}

      {reviews.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No reviews available for voucher generation.
        </div>
      )}
    </div>
  );
};