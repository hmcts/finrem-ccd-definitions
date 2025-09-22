import {Table} from "../../../pages/components/table.ts";
import {DateHelper} from "../../../data-utils/DateHelper.ts";

export const uploadDraftOrderTable: Table = {
    tableName: 'Check your answers',
    rows: [
        {cellItem: "What kind of draft order do you need to upload?", value: "An agreed order following a hearing (agreed by the parties at the hearing)"},
        'Upload agreed draft orders',
        {cellItem: "Confirm the uploaded documents are for the case", value: "I confirm the uploaded documents are for the Baggins v Gollum case"},
        {cellItem: "Which hearing was this?", value: `${DateHelper.getFormattedDateTwelveWeeksLater()} 10:00am - First Directions Appointment (FDA)`},
        {cellItem: "Do you know who was the judge at this hearing?", value: "No"},
        {cellItem: "Who are you uploading this on behalf of?", value: "The applicant, Frodo Baggins" },
        {cellItem: "What are you uploading?", value: "OrdersPension Sharing Annexes"},
        {cellItem: "Upload draft order", value: "Upload draft order 1Document agreed-draft-order-document.docx"},
        {cellItem: "Pension Sharing Annexes", value: "Pension Sharing Annexes 1Document BagginsFDA.pdf"}
    ]
}

export const uploadSuggestedDraftOrderTable: Table = {
    tableName: 'Check your answers',
    rows: [
        {cellItem: "What kind of draft order do you need to upload?", value: "A suggested draft order prior to a listed hearing (this will just be placed on file for the hearing)"},
        'Upload draft orders',
        {cellItem: "Confirm the uploaded documents are for the case", value: "I confirm the uploaded documents are for the Baggins v Gollum case"},
        {cellItem: "Who are you uploading this on behalf of?", value: "The applicant, Frodo Baggins" },
        {cellItem: "What are you uploading?", value: "OrdersPension Sharing Annexes"},
        {cellItem: "Upload draft order", value: "Upload draft order 1Document agreed-draft-order-document.docx"},
        {cellItem: "Pension Sharing Annexes", value: "Pension Sharing Annexes 1Document BagginsFDA.pdf"}
    ]
}
