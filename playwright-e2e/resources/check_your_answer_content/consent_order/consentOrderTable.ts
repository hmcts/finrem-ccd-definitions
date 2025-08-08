import {Table} from "../../../pages/components/table.ts";

export const consentOrderTable: Table = {
    tableName: 'Check Your Answers Table',
    rows: [
        "WARNING: Please note, this process should only be used to lodge a consent order in full and final settlement of your contested financial remedy application. For other applications please use the general application event.",
        "NATURE OF THE APPLICATION",
        { cellItem :"The application is for:", value : 'Maintenance Pending SuitLump Sum OrderProperty Adjustment OrderA settlement or a transfer of property for the benefit of the child(ren)Periodical Payment OrderPension Sharing OrderPension Compensation Sharing OrderPension Attachment OrderPension Compensation Attachment OrderVariation Order'},
        { cellItem : "Address details", value: "1234 Test Street" },
        { cellItem : "Mortgage details", value: "Mortgage details" },
        "ORDER FOR CHILDREN",
        { cellItem: "Does the application contain any application for periodical payments, or secured periodical payments for children?", value: "Yes" },
        { cellItem: "Is there a written agreement?", value: "No" },
        { cellItem: "Select what the payments are for:", value: "For a stepchild or step childrenIn addition to child support or maintenance already paid under a Child Support Agency assessmentTo meet expenses arising from a child’s disabilityTo meet expenses incurred by a child in relation to being educated or training for workWhen either the child or the person with care of the child or the absent parent of the child is not habitually resident in the United Kingdom"},
        "CONSENT ORDER",
        { cellItem: "Draft Consent Order", value: "Variation order.pdf"},
        "D81",
        { cellItem: "Are you uploading a joint D81?", value: "Yes" },
        { cellItem: "Form D81 Joint Document", value: "test.pdf" },
        "PENSION DOCUMENTS",
        { cellItem: "Type of document", value: "Form P1" },
        { cellItem: "Document", value: "Form P1.pdf" },
        "Upload original order to be varied",
        { cellItem: "Original order to be varied", value: "Variation order.pdf" },
        "OTHER DOCUMENTS"
    ]
}
