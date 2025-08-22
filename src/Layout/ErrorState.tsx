import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import React from 'react'

const ErrorState: React.FC = () => {
    return (
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
                    <AlertTriangle className="w-8 h-8 text-yellow-500 mb-4" />
                    <h3 className="font-semibold mb-2">Erreur de chargement</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Une erreur est survenue lors du chargement de l'application.
                    </p>

                    <Button onClick={() => window.location.reload()} size="sm">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Réessayer
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

export default ErrorState