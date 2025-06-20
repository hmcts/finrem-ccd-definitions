import { FieldDescriptor } from "../../../pages/components/field_descriptor.ts";

export const uploadDocumentPageDetails: FieldDescriptor = [
    {
        label: "Upload Varied document",
        locator: "ccd-field-write[field_id='variationOrderDocument']",
        type: "file",
        expectedValue: "test.pdf"
    },
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
        label: "Upload additional document",
        locator: "#uploadAdditionalDocument_0_additionalDocuments",
        type: "file",
        expectedValue: "NoticeOfActing.pdf"
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
