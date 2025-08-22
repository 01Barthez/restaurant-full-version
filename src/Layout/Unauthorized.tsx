import { MdNotInterested } from "react-icons/md";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BsArrow90DegLeft } from 'react-icons/bs';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <div style={{
        display: 'flex',
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        height: "100vh"
      }}>
        <h1 className="font-bold mb-4 text-4xl text-primary text-center">
          Le Délice Moderne
        </h1>
        <Card className="m-4">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <MdNotInterested
              className="w-12 h-12 text-yellow-500 mb-4"
            />
            <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Accès non autorisé</h2>
            <p className="text-gray-600 mb-8">
              Vous n'avez pas les autorisations nécessaires pour accéder à cette page.
            </p>

            <Button
              onClick={() => navigate(-1)}
              size="sm"
            >
              <BsArrow90DegLeft />
              Retour à la page précédente
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Unauthorized;
