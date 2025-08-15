import {Table} from "../../../pages/components/table.ts";
import {DateHelper} from "../../../data-utils/DateHelper.ts";
import {envTestData} from "../../../data-utils/test_data/EnvTestDataConfig.ts";

export function caseSubmissionTable(amount: string): Table {
    return {
        tableName: 'Case Submission Table',
        rows: [
            'AUTHORISATION',
            'I am duly authorised by the Applicant to complete this application.',
            {cellItem: "Solicitor Name", value: "Bilbo Baggins"},
            {cellItem: "Solicitor Firm", value: "Bag End"},
            {cellItem: "Solicitor Position", value: "Solicitor"},
            {cellItem: "Date", value: DateHelper.getTodayFormattedDate()},
            'PAYMENT DETAILS',
            {cellItem: "Has the applicant applied for help with fees online?", value: "No"},
            {cellItem: "Enter your account number", value: envTestData.PBA_NUMBER},
            {cellItem: "Amount to pay", value: amount},
            {cellItem: "Enter your reference", value: "Reference"},
            // 'Payment Method: Fee Account',
            // 'Your fee reference: Reference',
            // 'Fee account number: PBA0089162'
        ]
    }
}
