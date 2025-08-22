
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Share2, Copy, Users, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReferralSystemProps {
  userId: string;
  referralCode: string;
  referralsCount: number;
  earnedPoints: number;
}

const ReferralSystem: React.FC<ReferralSystemProps> = ({
  userId,
  referralCode,
  referralsCount,
  earnedPoints
}) => {
  const [friendEmail, setFriendEmail] = useState('');
  const { toast } = useToast();

  const referralLink = `${window.location.origin}?ref=${referralCode}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast({
        title: "Copié !",
        description: "Le lien de parrainage a été copié dans le presse-papiers",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
        variant: "destructive"
      });
    }
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Le Délice Moderne',
          text: 'Découvrez ce restaurant incroyable et obtenez 10€ de réduction !',
          url: referralLink,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      copyToClipboard();
    }
  };

  const inviteFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendEmail) return;

    // Here you would send an email invitation
    toast({
      title: "Invitation envoyée !",
      description: `Une invitation a été envoyée à ${friendEmail}`,
    });
    setFriendEmail('');
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{referralsCount}</div>
            <div className="text-sm text-gray-600">Amis parrainés</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Gift className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{earnedPoints}</div>
            <div className="text-sm text-gray-600">Points gagnés</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-orange-500">10€</div>
            <div className="text-sm text-gray-600">Par parrainage</div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link */}
      <Card>
        <CardHeader>
          <CardTitle>Votre lien de parrainage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={referralLink}
              readOnly
              className="flex-1"
            />
            <Button onClick={copyToClipboard} variant="outline">
              <Copy className="w-4 h-4" />
            </Button>
            <Button onClick={shareLink}>
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-sm text-gray-600">
            Partagez ce lien avec vos amis. Ils recevront 5€ de réduction et vous gagnerez 10€ !
          </div>
        </CardContent>
      </Card>

      {/* Invite by Email */}
      <Card>
        <CardHeader>
          <CardTitle>Inviter un ami par email</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={inviteFriend} className="flex space-x-2">
            <Input
              type="email"
              placeholder="Email de votre ami"
              value={friendEmail}
              onChange={(e) => setFriendEmail(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Inviter</Button>
          </form>
        </CardContent>
      </Card>

      {/* How it works */}
      <Card>
        <CardHeader>
          <CardTitle>Comment ça marche ?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-3">
              <div className="bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</div>
              <div>Partagez votre lien de parrainage avec vos amis</div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</div>
              <div>Votre ami s'inscrit et passe sa première commande</div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</div>
              <div>Il reçoit 5€ de réduction et vous gagnez 10€ de crédit</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralSystem;
