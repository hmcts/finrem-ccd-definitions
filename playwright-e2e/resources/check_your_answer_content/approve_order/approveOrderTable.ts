import {Table} from "../../../pages/components/table.ts";

export const approveOrderTable: Table = {
    tableName: 'Check your answers',
    rows: [
        'agreed-draft-order-document.docx',
        { cellItem: 'Is this document ready to be sealed and issued?', value: "Yes"},
        'BagginsFDA.pdf',
        { cellItem: 'Is there another hearing to be listed?', value: "No"},
        { cellItem: 'Which judge title will be shown in the cover letter or refusal order?', value: 'District Judge'}
    ]
}
