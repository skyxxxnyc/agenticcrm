import React from 'react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ExternalLink } from 'lucide-react';

export const Companies: React.FC = () => {
  const { companies } = useStore();

  return (
    <div>
      <h1 className="text-3xl font-black mb-6">Companies</h1>
      
      <div className="grid gap-4">
        {companies.map(company => (
          <Card key={company.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-bold text-lg">{company.name}</h3>
                {company.websiteUrl && (
                  <a href={`https://${company.websiteUrl}`} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-primary">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
              <div className="flex gap-2 text-sm text-gray-500 mb-2">
                 <span>{company.category}</span>
                 <span>•</span>
                 <span>{company.rating} ★ ({company.reviewCount})</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {company.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="font-mono text-[10px] uppercase">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-8 px-4 py-2 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-200 dark:border-gray-700">
               <div className="text-center">
                 <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Digital Gap</div>
                 <div className="text-xl font-black text-red-500">{company.digitalGapScore}</div>
               </div>
               <div className="w-px h-8 bg-gray-300 dark:bg-gray-600" />
               <div className="text-center">
                 <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">ICP Fit</div>
                 <div className="text-xl font-black text-green-500">{company.icpFitScore}</div>
               </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
