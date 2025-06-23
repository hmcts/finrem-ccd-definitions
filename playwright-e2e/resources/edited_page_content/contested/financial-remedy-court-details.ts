import {FieldDescriptor} from "../../../pages/components/field_descriptor.ts";

export const financialRemedyCourtDetails: FieldDescriptor[] = [
    {
        label: "Do you consider that the case should be allocated to be heard at High Court Judge level?",
        locator: '#allocatedToBeHeardAtHighCourtJudgeLevel_radio',
        type: "radio",
        expectedValue: "No"
    },
    {
        label: "Does anyone in this application need assistance or special facilities when attending court?",
        locator: '#specialAssistanceRequired',
        type: "input",
        expectedValue: "N/A"
    },
    {
        label: "Does anyone in this application need specific arrangements when attending court?",
        locator: '#specificArrangementsRequired',
        type: "input",
        expectedValue: "N/A"
    },
    {
        label: "Are there any reasons why the case should not proceed in the applicant’s Local Court? If yes, please set out what they are.",
        locator: '#isApplicantsHomeCourt_radio',
        type: "radio",
        expectedValue: "No"
    }
]