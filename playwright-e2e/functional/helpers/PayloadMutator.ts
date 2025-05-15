import { ReplacementAction } from '../../types/replacement-action';

export const EXPRESS_PILOT_PARTICIPATING_COURT_REPLACEMENT: ReplacementAction[] = [
    { action: 'delete', key: 'regionList' },
    { action: 'insert', key: 'regionList', value: 'northwest' },
    { action: 'delete', key: 'midlandsFRCList' },
    { action: 'insert', key: 'northWestFRCList', value: 'lancashire' },
    { action: 'delete', key: 'birminghamCourtList' },
    { action: 'insert', key: 'lancashireCourtList', value: 'FR_lancashireList_1' }
  ];
  
export const ESTIMATED_ASSETS_UNDER_1M: ReplacementAction[] = [
    { action: 'delete', key: 'netValueOfHome' },
    { action: 'insert', key: 'netValueOfHome', value: '999999' },
    { action: 'delete', key: 'estimatedAssetsChecklistV2' },
    { action: 'insert', key: 'estimatedAssetsChecklistV2', value: 'underOneMillionPounds' }
  ];
