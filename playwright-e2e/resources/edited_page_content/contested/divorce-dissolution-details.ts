import { FieldDescriptor } from "../../../pages/components/field_descriptor.ts";
import { DateHelper } from "../../../data-utils/DateHelper.ts";

export const divorceDissolutionDetails: FieldDescriptor[] = [
    {
        label: "Divorce / Dissolution Case Number",
        type: "input",
        expectedValue: "LV12D12345"
    },
    {
        locator: '#civilPartnership_radio',
        label: "Does this FR case relate to a Dissolution of a Civil Partnership?",
        type: "radio",
        expectedValue: "No"
    },
    {
        label: "Date of marriage / civil partnership",
        locator: '#dateOfMarriage',
        type: "date",
        expectedValue: "1999-01-01"
    },
    {
        label: "Date of separation (Optional)",
        locator: '#dateOfSepration',
        type: "date",
        expectedValue: "2022-01-01"
    },
    {
        label: "Application Issued Date",
        locator: '#divorcePetitionIssuedDate',
        type: "date",
        expectedValue: DateHelper.getCurrentDate()
    },
    {
        label: "Name of Court / Divorce Centre",
        type: "input",
        expectedValue: "Shire Court"
    },
    {
        label: "What stage has the divorce / dissolution reached?",
        locator: '#divorceStageReached',
        type: "select",
        expectedValue: "Petition / Application Issued",
    },
    {
        label: 'Upload Petition',
        locator: `ccd-field-write[field_id='divorceUploadPetition']`,
        type: 'file',
        expectedValue: 'PETITION FORM A.docx'
    }

];
