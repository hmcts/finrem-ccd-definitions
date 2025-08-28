import {Table, TableRowItem} from "../../../pages/components/table.ts";
import {DateHelper} from "../../../data-utils/DateHelper.ts";
import {envTestData} from "../../../data-utils/test_data/EnvTestDataConfig.ts";

export const solicitorDetails: TableRowItem[] = [
    "Solicitor Details",
    { cellItem: 'Solicitor’s name', value: 'Bilbo Baggins' },
    { cellItem: "Solicitor’s firm", value: "FinRem-1-Org" },
    { cellItem: "Your reference number", value: envTestData.ORG_ID_1 },
    "Solicitor’s Contact Details",
    { cellItem: "Is the respondent represented ?", value: "Yes", rowType: 'label-value-adjacent' },
    { cellItem: 'Building and Street', value: envTestData.APP_SOL_BUILDING_STREET },
    { cellItem: 'Town or City', value: envTestData.APP_SOL_TOWN_CITY },
    { cellItem: 'County', value: envTestData.APP_SOL_COUNTY },
    { cellItem: 'Postcode/Zipcode', value: envTestData.APP_SOL_POSTCODE },
    { cellItem: 'Phone Number', value: '07111111111'},
    { cellItem: 'Email', value: 'fr_applicant_solicitor1@mailinator.com'},
]

export const applicantDetails: TableRowItem[] = [
    'Applicant’s Details',
    { cellItem: 'Current First and Middle names', value: 'Frodo'},
    { cellItem: 'Current Last Name', value: 'Baggins'},
    'Applicant’s Contact details',
    { cellItem: 'Building and Street', value: 'Water Unite, 65-68'},
    { cellItem: 'Address Line 2', value: 'Leadenhall Street'},
    { cellItem: 'Town or City', value: 'Liverpool'},
    { cellItem: 'Postcode/Zipcode', value: 'EC3A 2AE'},
    { cellItem: 'Country', value: 'United Kingdom'},
    { cellItem: `Keep the Applicant's contact details private from the Respondent?`, value: 'Yes'},
    { cellItem: 'Is the Applicant currently a resident in a refuge?', value: 'Yes'},
]

export const applicantChildDetails: TableRowItem[] = [
    "Child(ren) details",
    { cellItem: "Does the child live in England or Wales?", value: "Yes" },
    { cellItem: "Full Name", value: "Child A" },
    { cellItem: "Date of birth", value: "1 Jan 2010" },
    { cellItem: "Gender", value: "Female" },
    { cellItem: "Relationship of applicant to the child", value: "Mother" },
    { cellItem: "Relationship of respondent to the child", value: "Father" },
]

export const divorceDetails: TableRowItem[] = [
    'Divorce / Dissolution Details',
    { cellItem: 'Divorce / Dissolution Case Number', value: 'LV12D12345'},
    { cellItem: 'Does this FR case relate to a Dissolution of a Civil Partnership?', value: 'No'},
    { cellItem: 'Date of marriage / civil partnership', value: '1 Jan 1999'},
    { cellItem: 'Date of separation', value: '1 Jan 2022'},
    { cellItem: 'Application Issued Date', value: DateHelper.getTodayFormattedDate()},
    { cellItem: 'Name of Court / Divorce Centre where petition issued', value: 'Shire Court'},
    { cellItem: 'What stage has the divorce / dissolution case reached ?', value: 'Petition / Application Issued'},
    { cellItem: 'Upload Petition', value: ' PETITION FORM A.docx'},
]

export const respondentDetails: TableRowItem[] = [
    'Respondent’s Details',
    { cellItem: 'Current First and Middle names', value: 'Smeagol'},
    { cellItem: 'Current Last Name', value: 'Gollum'},
    { cellItem: 'Is the respondent represented ?', value: 'Yes', rowType: 'label-value-adjacent'},
    'Respondent’s Solicitor’s Details',
    { cellItem: 'Solicitor’s name', value: 'Sauron'},
    { cellItem: "Respondent solicitor’s reference", value: "MNT12345" },
    { cellItem: 'Solicitor’s firm', value: 'Mnt Doom Sols'},
    'Respondent’s Solicitor’s Contact Details',
    { cellItem: 'Building and Street', value: 'Coral, 65-68'},
    { cellItem: 'Address Line 2', value: 'Leadenhall 2nd Street'},
    { cellItem: 'Town or City', value: 'Manchester'},
    { cellItem: 'Postcode/Zipcode', value: 'EC3A 2AF'},
    { cellItem: 'Country', value: 'United Kingdom'},
    { cellItem: 'Phone Number', value: '07111111111'},
    { cellItem: 'Email', value: 'fr_respondent_solicitor1@mailinator.com'},
]

export const propertyAdjustmentDetails: TableRowItem[] = [
    "Property adjustment order details",
    { cellItem: 'Property address', value: 'Test Address'},
    { cellItem: 'Name(s) and address(es) of any mortgage(s) for property', value: 'Test Mortgage'},
    { cellItem: 'Do you want to add additional property ?', value: 'Yes', rowType: 'label-value-adjacent' },
    { cellItem: 'Property address', value: 'Test Address 2'},
    { cellItem: 'Name(s) and address(es) of any mortgage(s) for property', value: 'Test Mortgage 2'},
]

export function getCourtDetails(applicantsLocalCourt?: string): TableRowItem[] {
    return [
        "Which Financial Remedies Court are you applying to?",
        {cellItem: 'Please state in which Financial Remedies Court Zone the applicant resides', value: 'Midlands'},
        {
            cellItem: "Please choose the FRC which covers the area within which the Applicant resides.",
            value: 'Birmingham FRC'
        },
        {
            cellItem: "Where is the Applicant’s Local Court?",
            value: applicantsLocalCourt ? applicantsLocalCourt : 'COVENTRY COMBINED COURT CENTRE'
        },
        {
            cellItem: 'Do you consider that the case should be allocated to be heard at High Court Judge level?',
            value: 'Yes'
        },
        {
            cellItem: 'Does anyone in this application need assistance or special facilities when attending court?',
            value: 'Special facilities',
            rowType: 'label-value-adjacent'
        },
        {
            cellItem: 'Does anyone in this application need specific arrangements when attending court?',
            value: 'Special Arrangements',
            rowType: 'label-value-adjacent'
        },
        {
            cellItem: 'Are there any reasons why the case should not proceed in the applicant’s Local Court? If yes, please set out what they are.',
            value: 'Yes'
        }
    ];
}

export const miamDetails: TableRowItem[] = [
    { cellItem: 'Has the applicant attended a Mediation information & Assessment Meeting (MIAM)?', value: 'Yes', rowType: 'label-value-adjacent' },
    'Enter details of MIAM certification',
    { cellItem: 'Mediator Registration Number (URN)', value: 'MIAM123455' },
    { cellItem: 'Family Mediation Service Name', value: 'MIAM Serv name' },
    { cellItem: 'Sole Trader Name', value: 'Sole Trader name' },
    { cellItem: 'Upload MIAM Document', value: ' MIAM.pdf' },
];

export const variationOrderDetails: TableRowItem[] = [
    'Upload original order to be varied',
    { cellItem: 'Original order to be varied', value: ' Variation order.pdf' },
    { cellItem: 'Do you want to upload any other documents ?', value: 'Yes', rowType: 'label-value-adjacent' },
]

export const urgentCase: TableRowItem[] = [
    'Urgent Case',
    { cellItem: 'Is this an urgent case ?', value: 'No' }
];

export const contestedCreatePaperChildrenCaseDetailsTable: Table = {
    tableName: 'Check your answers',
    rows: [
        { cellItem: 'Is the Applicant represented ?', value: 'Yes', rowType: 'label-value-adjacent' },
        ...solicitorDetails,
        { cellItem: 'What type of application is this?', value: 'Under paragraph 1 or 2 of schedule 1 children act 1989', rowType: 'label-value-adjacent' },
        ...applicantDetails,
        ...applicantChildDetails,
        ...respondentDetails,
        { cellItem: 'What is the nature of the application ?', value: 'Interim child periodical paymentsLump Sum OrderA settlement or a transfer of property for the benefit of the child(ren)Periodical Payment OrderVariation Order', rowType: "label-value-adjacent"},
        { cellItem: 'Does the application contain any periodical payments or secured periodical payments for children ?', value: 'Yes', rowType: 'label-value-adjacent' },
        { cellItem: 'Has a written agreement been made about maintenance for the benefit of children?', value: 'No', rowType: 'label-value-adjacent' },
        { cellItem: 'What payments are you applying for ?', value: 'For a stepchild or step childrenIn addition to child support or maintenance already paid under a Child Support Agency assessmentTo meet expenses arising from a child’s disabilityTo meet expenses incurred by a child in relation to being educated or training for workWhen either the child or the person with care of the child or the absent parent of the child is not habitually resident in the United Kingdom', rowType: "label-value-adjacent"},
        { cellItem: 'Is the application suitable to be dealt with under the Fast Track Procedure?', value: 'Yes', rowType: 'label-value-adjacent' },
        { cellItem: 'Select all that apply', value: 'The financial remedy sought is an application to vary a periodical payments order (but does not seek to dismiss the periodical payments order and substitute it with one or more of the following: a lump sum order, a property adjustment order, a pension sharing order or a pension compensation sharing order)The financial remedy sought is related to the recognition and enforcement of a foreign maintenance order under Article 56 of the Maintenance Regulation or Article 10 of the 2007 Hague ConventionThe financial remedy sought is only for an order for periodical paymentsThe financial remedy sought is related to an order for financial provision during a marriage or civil partnership under the Domestic Proceedings and Magistrates’ Courts Act 1978 or Schedule 6 to the Civil Partnership Act 2004', rowType: 'label-value-adjacent' },
        'Should this application be allocated to the Complexity List of the Financial Remedies Court?',
        { cellItem: 'A complex case could be retained for hearing within the Financial Remedy Centre and/or allocated to a higher tier of Judiciary', value: 'Yes'},
        'Please state the current estimated net assets in this case:',
        { cellItem: 'Select one', value: 'Under £250,000 (this should be total of combined net assets, but excluding pensions)'},
        { cellItem: 'Of the above value, what is the net value of the family home?', value: '125,000', rowType: 'label-value-adjacent' },
        'Please tick any potential allegations/issues which may arise',
        { cellItem: 'Select all that apply', value: 'Not applicable'},
        ...getCourtDetails(),
        ...miamDetails,
        'You should have a document signed by the mediator confirming this (which you should bring to your first hearing)',
        ...variationOrderDetails,
        ...urgentCase
    ]
}

export const contestedCreatePaperMatrimonyCaseDetailsTable: Table = {
    tableName: 'Check your answers',
    rows: [
        { cellItem: 'Is the Applicant represented ?', value: 'Yes', rowType: 'label-value-adjacent' },
        ...solicitorDetails,
        { cellItem: 'What type of application is this?', value: 'In connection to matrimonial and civil partnership proceedings (divorce/dissolution etc)', rowType: 'label-value-adjacent' },
        ...divorceDetails,
        ...applicantDetails,
        ...respondentDetails,
        { cellItem: 'Is the Respondent currently a resident in a refuge?', value: 'Yes'},
        { cellItem: 'What is the nature of the application ?', value: 'Maintenance Pending SuitLump Sum OrderProperty Adjustment OrderA settlement or a transfer of property for the benefit of the child(ren)Periodical Payment OrderPension Sharing OrderPension Compensation Sharing OrderPension Attachment OrderPension Compensation Attachment OrderVariation Order', rowType: "label-value-adjacent"},
        ...propertyAdjustmentDetails,
        { cellItem: 'Does the application contain any periodical payments or secured periodical payments for children ?', value: 'Yes', rowType: 'label-value-adjacent' },
        { cellItem: 'Has a written agreement been made about maintenance for the benefit of children?', value: 'No', rowType: 'label-value-adjacent' },
        { cellItem: 'What payments are you applying for ?', value: 'For a stepchild or step childrenIn addition to child support or maintenance already paid under a Child Support Agency assessmentTo meet expenses arising from a child’s disabilityTo meet expenses incurred by a child in relation to being educated or training for workWhen either the child or the person with care of the child or the absent parent of the child is not habitually resident in the United Kingdom', rowType: "label-value-adjacent"},
        { cellItem: 'Is the application suitable to be dealt with under the Fast Track Procedure?', value: 'Yes', rowType: 'label-value-adjacent' },
        { cellItem: 'Select all that apply', value: 'The financial remedy sought is an application to vary a periodical payments order (but does not seek to dismiss the periodical payments order and substitute it with one or more of the following: a lump sum order, a property adjustment order, a pension sharing order or a pension compensation sharing order)The financial remedy sought is related to the recognition and enforcement of a foreign maintenance order under Article 56 of the Maintenance Regulation or Article 10 of the 2007 Hague ConventionThe financial remedy sought is only for an order for periodical paymentsThe financial remedy sought is related to an order for financial provision during a marriage or civil partnership under the Domestic Proceedings and Magistrates’ Courts Act 1978 or Schedule 6 to the Civil Partnership Act 2004', rowType: 'label-value-adjacent' },
        'Should this application be allocated to the Complexity List of the Financial Remedies Court?',
        { cellItem: 'A complex case could be retained for hearing within the Financial Remedy Centre and/or allocated to a higher tier of Judiciary', value: 'Yes'},
        'Please state the current estimated net assets in this case:',
        { cellItem: 'Select one', value: 'Unable to quantify'},
        { cellItem: 'Of the above value, what is the net value of the family home?', value: '125,000', rowType: 'label-value-adjacent' },
        'Please tick any potential allegations/issues which may arise',
        { cellItem: 'Select all that apply', value: 'Not applicable'},
        ...getCourtDetails(),
        ...miamDetails,
        'You should have a document signed by the mediator confirming this (which you should bring to your first hearing)',
        ...variationOrderDetails,
        ...urgentCase
    ]
}

export const contestedCreateExpressPaperMatrimonyCaseDetailsTable: Table = {
    tableName: 'Check your answers',
    rows: [
        { cellItem: 'Is the Applicant represented ?', value: 'Yes', rowType: 'label-value-adjacent' },
        ...solicitorDetails,
        { cellItem: 'What type of application is this?', value: 'In connection to matrimonial and civil partnership proceedings (divorce/dissolution etc)', rowType: 'label-value-adjacent' },
        ...divorceDetails,
        ...applicantDetails,
        ...respondentDetails,
        { cellItem: 'Is the Respondent currently a resident in a refuge?', value: 'Yes'},
        { cellItem: 'What is the nature of the application ?', value: 'Maintenance Pending SuitLump Sum OrderProperty Adjustment OrderA settlement or a transfer of property for the benefit of the child(ren)Periodical Payment OrderPension Sharing OrderPension Compensation Sharing OrderPension Attachment OrderPension Compensation Attachment Order', rowType: "label-value-adjacent"},
        ...propertyAdjustmentDetails,
        { cellItem: 'Does the application contain any periodical payments or secured periodical payments for children ?', value: 'Yes', rowType: 'label-value-adjacent' },
        { cellItem: 'Has a written agreement been made about maintenance for the benefit of children?', value: 'No', rowType: 'label-value-adjacent' },
        { cellItem: 'What payments are you applying for ?', value: 'For a stepchild or step childrenIn addition to child support or maintenance already paid under a Child Support Agency assessmentTo meet expenses arising from a child’s disabilityTo meet expenses incurred by a child in relation to being educated or training for workWhen either the child or the person with care of the child or the absent parent of the child is not habitually resident in the United Kingdom', rowType: "label-value-adjacent"},
        { cellItem: 'Is the application suitable to be dealt with under the Fast Track Procedure?', value: 'No', rowType: 'label-value-adjacent' },
        'Should this application be allocated to the Complexity List of the Financial Remedies Court?',
        { cellItem: 'A complex case could be retained for hearing within the Financial Remedy Centre and/or allocated to a higher tier of Judiciary', value: 'Yes'},
        'Please state the current estimated net assets in this case:',
        { cellItem: 'Select one', value: 'Under £250,000 (this should be total of combined net assets, but excluding pensions)'},
        { cellItem: 'Of the above value, what is the net value of the family home?', value: '125,000', rowType: 'label-value-adjacent' },
        'Please tick any potential allegations/issues which may arise',
        { cellItem: 'Select all that apply', value: 'Not applicable'},
        { cellItem: 'Do you want to upload any other documents ?', value: 'Yes', rowType: 'label-value-adjacent' },
        ...getCourtDetails("BIRMINGHAM CIVIL AND FAMILY JUSTICE CENTRE"),
        ...miamDetails,
        'You should have a document signed by the mediator confirming this (which you should bring to your first hearing)',
        ...urgentCase
    ]
}

export const contestedCreateExpressFormAMatrimonyCaseDetailsTable: Table = {
    tableName: 'Check your answers',
    rows: [
        ...solicitorDetails,
        { cellItem: 'Do you consent to receive emails from the court about your case ?', value: 'Yes'},
        { cellItem: 'What type of application is this?', value: 'In connection to matrimonial and civil partnership proceedings (divorce/dissolution etc)', rowType: 'label-value-adjacent' },
        ...divorceDetails,
        ...applicantDetails,
        ...respondentDetails,
        { cellItem: 'What is the nature of the application ?', value: 'Maintenance Pending SuitLump Sum OrderProperty Adjustment OrderA settlement or a transfer of property for the benefit of the child(ren)Periodical Payment OrderPension Sharing OrderPension Compensation Sharing OrderPension Attachment OrderPension Compensation Attachment Order', rowType: "label-value-adjacent"},
        ...propertyAdjustmentDetails,
        { cellItem: 'Does the application contain any periodical payments or secured periodical payments for children ?', value: 'Yes', rowType: 'label-value-adjacent' },
        { cellItem: 'Has a written agreement been made about maintenance for the benefit of children?', value: 'No', rowType: 'label-value-adjacent' },
        { cellItem: 'What payments are you applying for ?', value: 'For a stepchild or step childrenIn addition to child support or maintenance already paid under a Child Support Agency assessmentTo meet expenses arising from a child’s disabilityTo meet expenses incurred by a child in relation to being educated or training for workWhen either the child or the person with care of the child or the absent parent of the child is not habitually resident in the United Kingdom', rowType: "label-value-adjacent"},
        { cellItem: 'Is the application suitable to be dealt with under the Fast Track Procedure?', value: 'No', rowType: 'label-value-adjacent' },
        'Should this application be allocated to the Complexity List of the Financial Remedies Court?',
        { cellItem: 'A complex case could be retained for hearing within the Financial Remedy Centre and/or allocated to a higher tier of Judiciary', value: 'Yes'},
        'Please state the current estimated net assets in this case:',
        { cellItem: 'Select one', value: 'Under £250,000 (this should be total of combined net assets, but excluding pensions)'},
        { cellItem: 'Of the above value, what is the net value of the family home?', value: '125,000', rowType: 'label-value-adjacent' },
        'Please tick any potential allegations/issues which may arise',
        { cellItem: 'Select all that apply', value: 'Not applicable'},
        ...miamDetails,
        "You should have a document signed by the mediator confirming this. Please upload the document here in readiness for the hearing or bring a copy to your first hearing.",
        ...getCourtDetails('BIRMINGHAM CIVIL AND FAMILY JUSTICE CENTRE'),
        { cellItem: 'Do you want to upload any other documents ?', value: 'No', rowType: 'label-value-adjacent' },
        ...urgentCase
    ]
}
