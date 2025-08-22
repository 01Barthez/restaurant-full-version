
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PDFGeneratorProps {
  data: any;
  filename: string;
  title: string;
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({ data, filename, title }) => {
  const { toast } = useToast();

  const generatePDF = () => {
    try {
      // Create HTML content for PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #FF6B35; padding-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; color: #FF6B35; }
            .date { color: #666; margin-top: 10px; }
            .content { margin: 20px 0; }
            .section { margin-bottom: 25px; }
            .section h3 { color: #333; border-bottom: 1px solid #eee; padding-bottom: 5px; }
            .stats { display: flex; justify-content: space-between; margin: 15px 0; }
            .stat-item { text-align: center; padding: 15px; background: #f9f9f9; border-radius: 8px; }
            .stat-value { font-size: 24px; font-weight: bold; color: #FF6B35; }
            .stat-label { color: #666; font-size: 14px; }
            .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f5f5f5; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">Le Délice Moderne</div>
            <div class="date">Rapport généré le ${new Date().toLocaleDateString('fr-FR')}</div>
          </div>
          
          <div class="content">
            <div class="section">
              <h3>Résumé Exécutif</h3>
              <div class="stats">
                <div class="stat-item">
                  <div class="stat-value">${data.totalOrders || 0}</div>
                  <div class="stat-label">Commandes Totales</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">${(data.monthlyRevenue || 0).toFixed(2)}€</div>
                  <div class="stat-label">Revenus Mensuels</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">${data.activeUsers || 0}</div>
                  <div class="stat-label">Utilisateurs Actifs</div>
                </div>
              </div>
            </div>
            
            <div class="section">
              <h3>Articles Populaires</h3>
              <table>
                <thead>
                  <tr>
                    <th>Article</th>
                    <th>Quantité Vendue</th>
                  </tr>
                </thead>
                <tbody>
                  ${(data.popularItems || []).map((item: any) => `
                    <tr>
                      <td>${item.name}</td>
                      <td>${item.count}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="footer">
            <p>Le Délice Moderne - Restaurant Gastronomique</p>
            <p>Rapport confidentiel - Usage interne uniquement</p>
          </div>
        </body>
        </html>
      `;

      // Create and download PDF
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Rapport téléchargé",
        description: `Le rapport ${title} a été téléchargé avec succès.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le rapport PDF.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button onClick={generatePDF} variant="outline" className="flex items-center">
      <FileDown className="w-4 h-4 mr-2" />
      Télécharger PDF
    </Button>
  );
};

export default PDFGenerator;
