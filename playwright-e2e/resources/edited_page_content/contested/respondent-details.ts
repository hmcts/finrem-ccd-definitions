import {FieldDescriptor} from "../../../pages/components/field_descriptor.ts";

export const respondentDetailsContent: FieldDescriptor[] = [
    {
        label: "Current First and Middle names",
        type: "input",
        expectedValue: "Smeagol"
    },
    {
        label:"Current Last name",
        type: "input",
        expectedValue: "Gollum"
    }
];

export const respondentSolicitorDetailsContent: FieldDescriptor[] = [
    {
        label: "Is the Respondent represented ?",
        locator: '#respondentRepresented_radio',
        type: "radio",
        expectedValue: "Yes"
    },
    {
        label: "Solicitor’s name (Optional)",
        type: "input",
        expectedValue: "Sauron"
    },
    {
        label: "Solicitor’s firm",
        type: "input",
        expectedValue: "Mnt Doom Sols"
    },
    {
        label: "Building and Street",
        locator: '#rSolicitorAddress__detailAddressLine1',
        type: "input",
        expectedValue: "Coral, 65-68"
    },
    {
        label: "Address Line 2",
        locator: '#rSolicitorAddress__detailAddressLine2',
        type: "input",
        expectedValue: "Leadenhall Street"
    },
    {
        label: "Town or City",
        locator: '#rSolicitorAddress__detailPostTown',
        type: "input",
        expectedValue: "London"
    },
    {
        label: "County",
        locator: '#rSolicitorAddress__detailCounty',
        type: "input",
        expectedValue: ""
    },
    {
        label: "Postcode/Zipcode",
        locator: '#rSolicitorAddress__detailPostCode',
        type: "input",
        expectedValue: "EC3A 2AD"
    },
    {
        label: "Country",
        locator: '#rSolicitorAddress__detailCountry',
        type: "input",
        expectedValue: "United Kingdom"
    },
    {
        label: "Phone number",
        locator: '#rSolicitorPhone',
        type: "input",
        expectedValue: "07821 639001"
    },
    {
        label: "Email",
        locator: '#rSolicitorEmail',
        type: "input",
        expectedValue: "fr_respondent_solicitor1@mailinator.com"
    },
    {
        label: "DX number (Optional)",
        locator: '#rSolicitorDXnumber',
        type: "input",
        expectedValue: ""
    }
];
