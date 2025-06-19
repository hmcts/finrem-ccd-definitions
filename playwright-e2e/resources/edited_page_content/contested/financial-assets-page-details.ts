import {FieldDescriptor} from "../../../pages/components/field_descriptor.ts";

export const financialAssetsPageDetails: FieldDescriptor = [
    {
        label: "Should this application be allocated to the Complexity List of the Financial Remedies Court?",
        locator: "#addToComplexityListOfCourts",
        type: "radio",
        expectedValue: "No"
    },
    {
        label: "Please state the current estimated net assets in this case:",
        locator: "#estimatedAssetsChecklistV2",
        type: "radio",
        expectedValue: "Under £250,000 (this should be total of combined net assets, but excluding pensions)"
    },
    {
        label: "Of the above value, what is the net value of the family home?",
        locator: "#netValueOfHome",
        type: "input",
        expectedValue: "125000"
    },
    {
        label: "Pre- or post-nuptial agreements",
        type: "checkbox",
        expectedValue: "Pre- or post-nuptial agreements"
    },
    {
        label: "Please give brief details of the potential allegation/issue:",
        locator: '#detailPotentialAllegation',
        type: "input",
        expectedValue: "Stealing ring"
    },
    {
        label: "Is there any other reason why the case should be allocated to the Complexity List?",
        locator: "#otherReasonForComplexity_radio",
        type: "radio",
        expectedValue: "No"
    }
];
