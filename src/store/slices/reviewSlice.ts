
import { Review, ReviewSlice } from '@/types/global';
import { StateCreator } from 'zustand';

export const createReviewSlice: StateCreator<ReviewSlice, [], [], ReviewSlice> = (set, get) => ({
  reviews: [],
  
  addReview: (reviewData) => {
    const newReview: Review = {
      ...reviewData,
      id: `review-${Date.now()}`,
      date: new Date(),
      moderated: true
    };
    
    set((state) => ({
      reviews: [...state.reviews, newReview]
    }));
  },
  
  getMenuItemReviews: (menuItemId) => {
    return get().reviews.filter(review => 
      review.menuItemId === menuItemId && review.moderated
    );
  },
  
  moderateReview: (reviewId, approved) => {
    set((state) => ({
      reviews: state.reviews.map(review =>
        review.id === reviewId ? { ...review, moderated: approved } : review
      )
    }));
  }
});
