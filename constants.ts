import { DealStage, PackageTier } from './types';

export const DEAL_STAGES: DealStage[] = [
  DealStage.LEAD,
  DealStage.CONTACTED,
  DealStage.QUALIFIED,
  DealStage.PROPOSAL,
  DealStage.NEGOTIATION,
  DealStage.CLOSED_WON,
  DealStage.CLOSED_LOST
];

export const PACKAGE_COLORS = {
  [PackageTier.BASIC]: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  [PackageTier.STANDARD]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  [PackageTier.PREMIUM]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  [PackageTier.ANY]: 'bg-gray-100 text-gray-800'
};

export const STAGE_COLORS = {
  [DealStage.LEAD]: 'bg-gray-200 text-gray-700',
  [DealStage.CONTACTED]: 'bg-blue-200 text-blue-800',
  [DealStage.QUALIFIED]: 'bg-indigo-200 text-indigo-800',
  [DealStage.PROPOSAL]: 'bg-yellow-200 text-yellow-800',
  [DealStage.NEGOTIATION]: 'bg-orange-200 text-orange-800',
  [DealStage.CLOSED_WON]: 'bg-green-200 text-green-800',
  [DealStage.CLOSED_LOST]: 'bg-red-200 text-red-800',
};
