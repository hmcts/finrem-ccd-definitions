import {Table} from "../../../pages/components/table.ts";
import config from "../../../config/config.ts";

export const manageAddIntervenerRepresentedTableData: Table = {
    tableName: 'Check your answers',
    rows: [
        { cellItem: "Please select intervener to manage", value: "Intervener 1: not added to case yet." },
        { cellItem: "Please select appropriate option", value: "Add Intervener 1" },
        "First Intervener Details",
        "Intervener 1",
        { cellItem: "Intervener's Full Name", value: "Test Intervener" },
        { cellItem: "Does the intervener live outside of the UK?", value: "No" },
        { cellItem: "Building and Street", value: "test street" },
        { cellItem: "Address Line 2", value: "test address line 2" },
        { cellItem: "Town or City", value: "test town" },
        { cellItem: "County", value: "test county" },
        { cellItem: "Postcode", value: "test postcode" },
        { cellItem: "Country", value: "test country" },
        { cellItem: "Email address", value: config.applicant_intervener.email},
        { cellItem: "Is the Intervener represented ?", value: "Yes" },
        { cellItem: "Representative's Full Name", value: "Test Representative" },
        { cellItem: "Representative's Email", value: config.applicant_intervener.email }
    ]
}

export const removeIntervenerTableData: Table = {
    tableName: 'Check your answers',
    rows: [
        { cellItem: "Please select intervener to manage", value: "Intervener 1: Test Intervener" },
        { cellItem: "Please select appropriate option", value: "Remove Intervener 1" }
    ]
}

export const manageAddIntervenerNotRepresentedTableData: Table = {
    tableName: 'Check your answers',
    rows: [
        { cellItem: "Please select intervener to manage", value: "Intervener 2: not added to case yet." },
        { cellItem: "Please select appropriate option", value: "Add Intervener 2" },
        "Second Intervener Details",
        "Intervener 2",
        { cellItem: "Intervener's Full Name", value: "Test Intervener 2" },
        { cellItem: "Does the intervener live outside of the UK?", value: "No" },
        { cellItem: "Building and Street", value: "test street" },
        { cellItem: "Address Line 2", value: "test address line 2" },
        { cellItem: "Town or City", value: "test town" },
        { cellItem: "County", value: "test county" },
        { cellItem: "Postcode", value: "test postcode" },
        { cellItem: "Country", value: "test country" },
        { cellItem: "Email address", value: config.applicant_intervener.email},
        {cellItem: "Is the Intervener represented ?", value: "No" }
    ]
}
