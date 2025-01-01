import { useReviewState } from "./review/useReviewState";
import { useReviewHandlers } from "./review/useReviewHandlers";

export const useReviewSection = (
  customRestaurantName?: string,
  customGoogleMapsUrl?: string,
  customServerNames?: string[]
) => {
  const state = useReviewState(customRestaurantName, customGoogleMapsUrl, customServerNames);
  const handlers = useReviewHandlers(state);

  return {
    ...state,
    ...handlers,
  };
};