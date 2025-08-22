
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ReviewService } from '@/services/reviewService';

interface PostOrderFeedbackProps {
  orderId: string;
  orderItems: any[];
  onSubmitFeedback: (feedback: any) => void;
  onClose: () => void;
}

const PostOrderFeedback: React.FC<PostOrderFeedbackProps> = ({
  orderId,
  orderItems,
  onSubmitFeedback,
  onClose
}) => {
  const [ratings, setRatings] = useState<{[key: string]: number}>({});
  const [generalComment, setGeneralComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleRatingChange = (itemId: string, rating: number) => {
    setRatings(prev => ({ ...prev, [itemId]: rating }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // AI Moderation
      if (generalComment) {
        const moderation = await ReviewService.moderateReview(generalComment);
        if (!moderation.isAcceptable) {
          toast({
            title: "Commentaire modéré",
            description: moderation.reason,
            variant: "destructive"
          });
          setIsSubmitting(false);
          return;
        }
      }

      const feedback = {
        orderId,
        ratings,
        generalComment,
        timestamp: new Date()
      };

      onSubmitFeedback(feedback);
      
      toast({
        title: "Merci pour votre avis !",
        description: "Votre feedback nous aide à améliorer nos services.",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer votre avis. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageCircle className="w-5 h-5 mr-2" />
          Comment était votre commande ?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rate each item */}
        <div className="space-y-4">
          <h3 className="font-medium">Notez chaque article :</h3>
          {orderItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">{item.name}</span>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingChange(item.id, star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= (ratings[item.id] || 0) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      } hover:text-yellow-400 transition-colors`}
                    />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* General comment */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Commentaire général (optionnel)
          </label>
          <Textarea
            value={generalComment}
            onChange={(e) => setGeneralComment(e.target.value)}
            placeholder="Partagez votre expérience globale..."
            rows={3}
          />
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || Object.keys(ratings).length === 0}
            className="flex-1"
          >
            {isSubmitting ? 'Envoi...' : 'Envoyer mon avis'}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Plus tard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostOrderFeedback;
