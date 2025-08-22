
import { StateCreator } from 'zustand';

interface Review {
  id: string;
  userId: string;
  userName: string;
  menuItemId: string;
  rating: number;
  comment: string;
  date: Date;
  moderated: boolean;
}

export interface ReviewSlice {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date' | 'moderated'>) => void;
  getMenuItemReviews: (menuItemId: string) => Review[];
  moderateReview: (reviewId: string, approved: boolean) => void;
}

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
