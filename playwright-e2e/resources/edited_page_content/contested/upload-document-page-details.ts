import { FieldDescriptor } from "../../../pages/components/field_descriptor.ts";

export const uploadDocumentPageDetails: FieldDescriptor[] = [
    {
        label: "Upload any other documents",
        locator: "#promptForAnyDocument_radio",
        type: "radio",
        expectedValue: "Yes"
    },
    {
        label: "Document type",
        locator: "#uploadAdditionalDocument_0_additionalDocumentType",
        type: "select",
        expectedValue: "Notice of acting"
    },
    {
        label: "Is this an urgent case?",
        locator: "#promptForUrgentCaseQuestion_radio",
        type: "radio",
        expectedValue: "Yes"
    },
    {
        label: "Urgent case details",
        locator: "#urgentCaseQuestionDetailsTextArea",
        type: "input",
        expectedValue: "Urgent case details"
    }
];
