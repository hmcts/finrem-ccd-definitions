import {FieldDescriptor} from "../../../pages/components/field_descriptor.ts";

export const miamDetails: FieldDescriptor[] = [
    {
        label: "Mediator Registration Number (URN)",
        locator: "#mediatorRegistrationNumber",
        type: "input",
        expectedValue: "MIAM12345"
    },
    {
        label: "Family Mediation Service Name",
        locator: "#familyMediatorServiceName",
        type: "input",
        expectedValue: "Gandalf the Great Div"
    },
    {
        label: "Sole Trader Name",
        locator: "#soleTraderName",
        type: "input",
        expectedValue: "Wizard Divorce"
    },
    {
        label: "Upload MIAM document",
        locator: "ccd-field-write[field_id='uploadMediatorDocument']",
        type: "file",
        expectedValue: "test.pdf"
    }
];