import { ReviewAIModerationResult } from "@/types/global";

export class ReviewService {
  // AI Moderation using simple keyword filtering (replace with actual AI API)
  static async moderateReview(comment: string): Promise<ReviewAIModerationResult> {
    // Simulate AI moderation delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const inappropriateWords = [
      'spam', 'fake', 'horrible', 'awful', 'disgusting', 'terrible',
      // Add more inappropriate words as needed
    ];
    
    const lowercaseComment = comment.toLowerCase();
    const containsInappropriateContent = inappropriateWords.some(word => 
      lowercaseComment.includes(word)
    );
    
    if (containsInappropriateContent) {
      return {
        isAcceptable: false,
        reason: 'Le commentaire contient du contenu inapproprié',
        suggestedEdit: comment.replace(/horrible|awful|disgusting|terrible/gi, '***')
      };
    }
    
    if (comment.length < 10) {
      return {
        isAcceptable: false,
        reason: 'Le commentaire est trop court',
        suggestedEdit: undefined
      };
    }
    
    return {
      isAcceptable: true
    };
  }
  
  // Auto feedback post-order
  static generateAutoFeedbackPrompt(orderItems: any[]): string {
    const itemNames = orderItems.map(item => item.name).join(', ');
    return `Comment avez-vous trouvé votre commande (${itemNames}) ? Votre avis nous aide à améliorer nos services.`;
  }
  
  // Calculate average rating for a menu item
  static calculateAverageRating(reviews: any[]): number {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return sum / reviews.length;
  }
}
