import { DateHelper } from "../../../data-utils/DateHelper";
import { Table } from "../../../pages/components/table";

const hearingDate =  DateHelper.getFormattedDateTwelveWeeksLater();

export const vacateHearingNotRelistedTableData: Table = {
    tableName: 'Vacate Hearing',
    rows: [
        {cellItem: "Which hearing?", value: hearingDate + " 10:00am - First Directions Appointment (FDA)"},
        {cellItem: "When was the hearing vacated?", value: "12 Dec 2025"},
        {cellItem: "Why is the hearing being vacated?", value: "Other - Please specify"},
    ]
}
