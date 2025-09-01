import {FieldDescriptor} from "../../../pages/components/field_descriptor.ts";
import {envTestData} from "../../../data-utils/test_data/EnvTestDataConfig.ts";

export const applicantDetails: FieldDescriptor[] = [
    {
        label: "Current First and Middle names",
        type: "input",
        expectedValue: "Frodo"
    },
    {
        label: "Current Last name",
        type: "input",
        expectedValue: "Baggins"
    },
    {
        label: "Does the applicant live outside of the UK? (Optional)",
        locator: '#applicantResideOutsideUK_radio',
        type: "radio",
        expectedValue: "No"
    },
    {
        label: "Building and Street",
        type: "input",
        expectedValue: "Water Unite, 65-68"
    },
    {
        label: "Address Line 2",
        type: "input",
        expectedValue: "Leadenhall Street"
    },
    {
        label: "Town or City",
        type: "input",
        expectedValue: "London"
    },
    {
        label: "County",
        type: "input",
        expectedValue: ""
    },
    {
        label: "Postcode/Zipcode",
        type: "input",
        expectedValue: "EC3A 2AD"
    },
    {
        label: "Country",
        type: "input",
        expectedValue: "United Kingdom"
    },
    {
        label: "Phone number",
        type: "input",
        expectedValue: ""
    },
    {
        label: "Email",
        type: "input",
        expectedValue: ""
    },
    {
        label: "Keep the Applicant's contact details private from the Respondent?",
        locator: '#applicantAddressConfidential_radio',
        type: "radio",
        expectedValue: "Yes"
    },
    {
        label: "Is the Applicant currently a resident in a refuge? (Optional)",
        locator: '#applicantInRefugeQuestion_radio',
        type: "radio",
        expectedValue: "Yes"
    }
];

export const solicitorDetailsContent: FieldDescriptor[] = [
    {
        label: "Is the Applicant represented ?",
        locator: '#applicantRepresented_radio',
        type: "radio",
        expectedValue: "Yes"
    },
    {
        label: "Solicitor’s name",
        type: "input",
        expectedValue: "Bilbo Baggins"
    },
    {
        label: "Solicitor’s firm",
        type: "input",
        expectedValue: "FinRem-1-Org"
    },
    {
        label: "Your reference number",
        type: "input",
        expectedValue: envTestData.ORG_ID_1
    },
    {
        label: "Building and Street",
        type: "input",
        expectedValue: "3rd Floor, 65-68 Leadenhall St"
    },
    {
        label: "Town or City",
        type: "input",
        expectedValue: "London"
    },
    {
        label: "County",
        type: "input",
        expectedValue: "Greater London"
    },
    {
        label: "Postcode/Zipcode",
        type: "input",
        expectedValue: "EC3A 2AD"
    },
    {
        label: "Phone number",
        type: "input",
        expectedValue: "07777777777"
    },
    {
        label: "Email",
        type: "input",
        expectedValue: "fr_applicant_solicitor1@mailinator.com"
    },
    {
        label: "Do you consent to receive emails from the court about your case ?",
        locator: '#applicantSolicitorConsentForEmails_radio',
        type: "radio",
        expectedValue: "Yes"
    }
];
