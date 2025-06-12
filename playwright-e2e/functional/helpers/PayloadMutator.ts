export const EXPRESS_PILOT_PARTICIPATING_COURT_REPLACEMENT = [
    { action: 'delete', key: 'regionList' },
    { action: 'insert', key: 'regionList', value: 'northwest' },
    { action: 'delete', key: 'midlandsFRCList' },
    { action: 'insert', key: 'northWestFRCList', value: 'lancashire' },
    { action: 'delete', key: 'birminghamCourtList' },
    { action: 'insert', key: 'lancashireCourtList', value: 'FR_lancashireList_1' }
  ];
  
export const ESTIMATED_ASSETS_UNDER_1M = [
    { action: 'delete', key: 'netValueOfHome' },
    { action: 'insert', key: 'netValueOfHome', value: '999999' },
    { action: 'delete', key: 'estimatedAssetsChecklistV2' },
    { action: 'insert', key: 'estimatedAssetsChecklistV2', value: 'underOneMillionPounds' }
  ];

  export const ISSUE_APPLICATION = (issueDate: string) => [
    { action: 'insert', key: 'issueDate', value: issueDate },
  ];

  export const LIST_FOR_HEARING = (hearingDate: string) => [
    { action: 'insert', key: 'hearingDate', value: hearingDate },
  ];

  export const DIRECTIONS_LIST_DATA = (codeForGeneralApplicationDirectionsEvent: string) => [
    { action: 'insert', key: 'generalApplicationDirectionsList.value.code', value: codeForGeneralApplicationDirectionsEvent },
    { action: 'insert', key: 'generalApplicationDirectionsList.list_items[0].code', value: codeForGeneralApplicationDirectionsEvent }
  ];

  export const REFER_LIST_DATA = (generalApplicationId: string) => [
    { action: 'insert', key: 'generalApplicationReferList.value.code', value: generalApplicationId },
    { action: 'insert', key: 'generalApplicationReferList.list_items[0].code', value: generalApplicationId }
  ];

  export const OUTCOME_LIST_DATA = (generalApplicationId: string) => [
    { action: 'insert', key: 'generalApplicationOutcomeList.value.code', value: generalApplicationId },
    { action: 'insert', key: 'generalApplicationOutcomeList.list_items[0].code', value: generalApplicationId }
  ];

  export const APPROVE_ORDERS_DATA = (
    hearingDateLabel: string,
    hearingDate: string,
    documentUrl: string,
    documentBinaryUrl: string,
    uploadTimestamp: string,
  ) => [
    { action: 'insert', key: 'judgeApproval1.hearingInfo', value: `First Directions Appointment (FDA) on ${hearingDateLabel} 10:00` },
    { action: 'insert', key: 'judgeApproval1.hearingDate', value: hearingDate },
    { action: 'insert', key: 'judgeApproval1.document.document_url', value: documentUrl },
    { action: 'insert', key: 'judgeApproval1.document.document_binary_url', value: documentBinaryUrl },
    { action: 'insert', key: 'judgeApproval1.document.upload_timestamp', value: uploadTimestamp },
  ];
  
  export const PROCESS_ORDER_DATA = (
    orderDateTime: string,
    documentUrl: string,
    documentBinaryUrl: string,
    uploadTimestamp: string,
  ) => [
    { action: 'insert', key: 'unprocessedApprovedDocuments[0].value.orderDateTime', value: orderDateTime },
    { action: 'insert', key: 'unprocessedApprovedDocuments[0].value.uploadDraftDocument.document_url', value: documentUrl },
    { action: 'insert', key: 'unprocessedApprovedDocuments[0].value.uploadDraftDocument.document_binary_url', value: documentBinaryUrl },
    { action: 'insert', key: 'unprocessedApprovedDocuments[0].value.uploadDraftDocument.upload_timestamp', value: uploadTimestamp },
    { action: 'insert', key: 'unprocessedApprovedDocuments[0].value.originalDocument.document_url', value: documentUrl },
    { action: 'insert', key: 'unprocessedApprovedDocuments[0].value.originalDocument.document_binary_url', value: documentBinaryUrl },
    { action: 'insert', key: 'unprocessedApprovedDocuments[0].value.originalDocument.upload_timestamp', value: uploadTimestamp },
  ];

  export const APPLICATION_ISSUE_DATE = (
      date: string
  )=> [
          { action: 'delete', key: 'divorcePetitionIssuedDate' },
          { action: 'insert', key: 'divorcePetitionIssuedDate', value: date },
  ];
