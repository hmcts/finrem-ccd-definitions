import { DateHelper } from "../../../data-utils/DateHelper";
import {Tab} from "../../../pages/components/tab.ts";
import {envTestData} from "../../../data-utils/test_data/EnvTestDataConfig.ts";

export const solicitor_amend_case_tabs:Tab[] = [
    {
        tabName: 'Confidential Applicant',
        tabContent: [
            { tabItem: 'Building and Street', value: 'Water Unite, 65-68'},
            { tabItem: 'Address Line 2', value: 'Leadenhall Street'},
            { tabItem: 'Town or City', value: 'London'},
            { tabItem: 'Postcode/Zipcode', value: 'EC3A 2AD'},
            { tabItem: 'Country', value: 'United Kingdom'},
        ]
    },
    {
        tabName: 'Applicant',
        tabContent: [
            "Applicant’s Details",
            { tabItem: "Current First and Middle names", value: "Frodo" },
            { tabItem: "Current Last Name", value: "Baggins" },
            { tabItem: 'Does the applicant live outside of the UK?', value: 'No'},
            "Urgent Case",
            { tabItem: "Is this an urgent case ?", value: "Yes" },
            { tabItem: 'Provide details as to why the case is urgent', value: 'Urgent case details'},
            "Is the Applicant represented ?",
            { tabItem: "Keep the Applicant's contact details private from the Respondent?", value: "Yes" },
            { tabItem: "Is the Applicant currently a resident in a refuge?", value: "Yes" },
            "Solicitor Details",
            { tabItem: "Your reference number", value: envTestData.ORG_ID_1 },
            { tabItem: "Solicitor’s name", value: "Bilbo Baggins" },
            { tabItem: "Solicitor’s firm", value: "FinRem-1-Org" },
            "Solicitor’s Contact Details",
            { tabItem: "Building and Street", value: "3rd Floor, 65-68 Leadenhall St" },
            { tabItem: "Town or City", value: "London" },
            { tabItem: "County", value: "Greater London" },
            { tabItem: "Postcode/Zipcode", value: "EC3A 2AD" },
            { tabItem: "Phone Number", value: "07777777777" },
            { tabItem: "Email", value: "fr_applicant_solicitor1@mailinator.com"},
            { tabItem: "Do you consent to receive emails from the court about your case ?", value: "Yes" }
        ]
    },
    {
        tabName: 'Divorce / Dissolution Details',
        tabContent: [
            { tabItem: "Divorce / Dissolution Case Number", value: "LV12D12345" },
            { tabItem: "Date of marriage / civil partnership", value: "1 Jan 1999" },
            { tabItem: 'Date of separation', value: '1 Jan 2022'},
            { tabItem: "Application Issued Date", value: DateHelper.getTodayFormattedDate() },
            { tabItem: "Name of Court / Divorce Centre where petition issued", value: "Shire Court" },
            { tabItem: "What stage has the divorce / dissolution case reached ?", value: "Petition / Application Issued" },
            { tabItem: "Upload Petition", value: "PETITION FORM A.docx" },
            { tabItem: "Does this FR case relate to a Dissolution of a Civil Partnership?", value: "No" }
        ]
    },
    {
        tabName: 'Respondent',
        tabContent: [
            "Respondent’s Details",
            { tabItem: "Current First and Middle names", value: "Smeagol" },
            { tabItem: "Current Last Name", value: "Gollum" },
            "Is the respondent represented ?",
            "Respondent’s Solicitor’s Details",
            { tabItem: "Solicitor’s name", value: "Sauron" },
            { tabItem: "Solicitor’s firm", value: "Mnt Doom Sols" },
            "Respondent’s Solicitor’s Contact Details",
            { tabItem: "Building and Street", value: "Coral, 65-68" },
            { tabItem: "Address Line 2", value: "Leadenhall Street" },
            { tabItem: "Town or City", value: "London" },
            { tabItem: "Postcode/Zipcode", value: "EC3A 2AD" },
            { tabItem: "Country", value: "United Kingdom" },
            { tabItem: "Phone Number", value: "07821 639001" },
            { tabItem: "Email", value: "fr_respondent_solicitor1@mailinator.com" }
        ],
        excludedContent: ["Is the Respondent currently a resident in a refuge?"]
    },
    {
        tabName: 'Nature of Application',
        tabContent: [
            "Maintenance Pending Suit",
            "Lump Sum Order",
            "Property Adjustment Order",
            "A settlement or a transfer of property for the benefit of the child(ren)",
            "Periodical Payment Order",
            "Pension Sharing Order",
            "Pension Compensation Sharing Order",
            "Pension Attachment Order",
            "Pension Compensation Attachment Order",
            "Variation Order",
            "Property adjustment order details",
            { tabItem: 'Property address', value: 'Test Address' },
            { tabItem: 'Name(s) and address(es) of any mortgage(s) for property', value: 'Test Mortgage' },
            { tabItem: 'Property address', value: 'Test Address 2' },
            { tabItem: 'Name(s) and address(es) of any mortgage(s) for property', value: 'Test Mortgage 2' },
            "Order for children",
            "Does the application contain any periodical payments or secured periodical payments for children",
            'Has a written agreement been made about maintenance for the benefit of children',
            'What payments are you applying for ?',
            "For a stepchild or step children",
            "In addition to child support or maintenance already paid under a Child Support Agency assessment",
            "To meet expenses arising from a child’s disability",
            "To meet expenses incurred by a child in relation to being educated or training for work",
            "When either the child or the person with care of the child or the absent parent of the child is not habitually resident in the United Kingdom",
        ]
    },
    {
        tabName:"Gatekeeping and allocation",
        tabContent: [
            "Express Pilot Participation: Does not qualify",
            "Has the applicant attended a Mediation information & Assessment Meeting (MIAM)?",
            "Enter details of MIAM certification",
            { tabItem: 'Mediator Registration Number (URN)', value: 'MIAM12345'},
            { tabItem: 'Family Mediation Service Name', value: 'Gandalf the Great Div'},
            { tabItem: 'Sole Trader Name', value: 'Wizard Divorce'},
        ]
    },
    {
        tabName: "Case documents",
        tabContent: [
            { tabItem: "Online Form A", value: "DraftOnlineForm.pdf" },
            { tabItem: 'Upload MIAM Document', value: ' test.pdf'},
            { tabItem: "Upload Petition", value: "PETITION FORM A.docx" },
            "Upload other documents",
            { tabItem: "Please upload any additional documents related to your application", value: "NoticeOfActing.pdf" },
            { tabItem: "Document type", value: "Notice of acting" },
            { tabItem: 'Original order to be varied', value: ' Variation order.pdf'},
        ]
    },
    {
        tabName: "Authorisation",
        tabContent : [
            { tabItem: "Solicitor Name", value: "Bilbo Baggins" },
            { tabItem: "Solicitor Firm", value: "Bag End" },
            { tabItem: "Solicitor Position", value: "Solicitor" },
            { tabItem: "Date", value: DateHelper.getTodayFormattedDate() }
        ]
    }
];
