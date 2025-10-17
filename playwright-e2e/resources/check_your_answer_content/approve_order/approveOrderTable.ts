import { DateHelper } from "../../../data-utils/DateHelper.ts";
import {Table} from "../../../pages/components/table.ts";

const hearingDate = DateHelper.getFullDateTwelveWeeksLater();
const courtOrderDate = DateHelper.getUnFormattedDateTwelveWeeksLater();

export const approveOrderTable: Table = {
    tableName: 'Check your answers',
    rows: [
        { cellItem: 'Hearing', value: 'First Directions Appointment (FDA) on ' + hearingDate + ' 10:00'},
        'agreed-draft-order-document.docx',
        { cellItem: 'Is this document ready to be sealed and issued?', value: "Yes"},
        { cellItem: 'Court order date', value: courtOrderDate},
        { cellItem: 'Hearing', value: 'First Directions Appointment (FDA) on ' + hearingDate + ' 10:00'},
        'BagginsFDA.pdf',
        { cellItem: 'Is there another hearing to be listed?', value: "Yes"},
        { cellItem: 'Type of Hearing', value: 'Financial Dispute Resolution (FDR)'},
        { cellItem: 'Which order is this hearing for?', value: 'BagginsFDA.pdf'},
        { cellItem: 'Time estimate', value: 'The application can be listed for the standard time'},
        { cellItem: 'Which judge title will be shown in the cover letter or refusal order?', value: 'District Judge'}
    ]
}
