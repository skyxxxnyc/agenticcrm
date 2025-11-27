import React from 'react';
import { useStore } from '../store/useStore';
import { DealStage, Deal, Priority } from '../types';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { formatCurrency } from '../lib/utils';
import { STAGE_COLORS } from '../constants';
import { MoreHorizontal } from 'lucide-react';

export const Pipeline: React.FC = () => {
  const { deals } = useStore();

  const columns = Object.values(DealStage);

  const getDealsByStage = (stage: DealStage) => {
    return deals.filter(deal => deal.stage === stage);
  };

  return (
    <div className="h-full overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-[1200px] h-full">
        {columns.map(stage => {
          const stageDeals = getDealsByStage(stage);
          const totalValue = stageDeals.reduce((sum, d) => sum + d.value, 0);

          return (
            <div key={stage} className="w-80 flex-shrink-0 flex flex-col h-full">
              <div className={`p-3 border-2 border-black dark:border-white mb-3 font-bold flex justify-between items-center bg-white dark:bg-gray-800 shadow-neo-sm dark:shadow-neo-sm-dark`}>
                <span className="text-sm uppercase tracking-wider">{stage.replace('_', ' ')}</span>
                <span className="text-xs bg-black text-white dark:bg-white dark:text-black px-2 py-0.5 rounded-full">
                  {stageDeals.length}
                </span>
              </div>
              
              <div className="text-xs text-gray-500 font-mono mb-2 text-right px-1">
                {formatCurrency(totalValue)}
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 p-1">
                {stageDeals.map(deal => (
                  <KanbanCard key={deal.id} deal={deal} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const KanbanCard: React.FC<{ deal: Deal }> = ({ deal }) => {
  return (
    <div className="bg-surface-light dark:bg-surface-dark border-2 border-black dark:border-white p-3 shadow-neo-sm dark:shadow-neo-sm-dark hover:-translate-y-1 hover:shadow-neo transition-all cursor-grab active:cursor-grabbing group">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-sm leading-tight">{deal.name}</h4>
        <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      
      <div className="mb-3">
        <div className="text-xs text-gray-500">{deal.nextAction || 'No action set'}</div>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <Badge variant={deal.priority === Priority.HIGH ? 'danger' : 'outline'} className="scale-90 origin-left">
          {formatCurrency(deal.value)}
        </Badge>
        {deal.priority === Priority.HIGH && (
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
        )}
      </div>
    </div>
  );
};
