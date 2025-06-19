import {FieldDescriptor} from "../../../pages/components/field_descriptor.ts";

export const propertyAdjustmentDetails: FieldDescriptor = [
    {
        label: "Property address",
        type: "input",
        expectedValue: "Test Address",
        position: 0
    },
    {
        label: "Name(s) and address(es) of any mortgage(s) for property",
        type: "input",
        expectedValue: "Test Mortgage",
        position: 0
    },
    {
        label: "Do you want to add additional property ?",
        locator: '#additionalPropertyOrderDecision_radio',
        type: "radio",
        expectedValue: "Yes"
    },
    {
        label: "Property address (Optional)",
        type: "input",
        expectedValue: "Test Address 2",
        position: 0
    },
    {
        label: "Name(s) and address(es) of any mortgage(s) for property (Optional)",
        type: "input",
        expectedValue: "Test Mortgage 2",
        position: 0
    }
];
