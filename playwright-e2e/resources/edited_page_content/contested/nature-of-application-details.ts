import {FieldDescriptor} from "../../../pages/components/field_descriptor.ts";

export const natureOfApplicationDetails: FieldDescriptor = [
    {
        label: "Maintenance Pending Suit",
        locator: "input[id='natureOfApplicationChecklist-Maintenance Pending Suit']",
        type: "checkbox",
        expectedValue: "Maintenance Pending Suit"
    },
    {
        label: "Lump Sum Order",
        locator: 'input[id="natureOfApplicationChecklist-Lump Sum Order"]',
        type: "checkbox",
        expectedValue: "Yes"
    },
    {
        label: "Property Adjustment Order",
        locator: 'input[id="natureOfApplicationChecklist-propertyAdjustmentOrder"]',
        type: "checkbox",
        expectedValue: "Yes"
    },
    {
        label: "A settlement or a transfer of property for the benefit of the child(ren)",
        locator: 'input[id="natureOfApplicationChecklist-A settlement or a transfer of property"]',
        type: "checkbox",
        expectedValue: "Yes"
    },
    {
        label: "Periodical Payment Order",
        locator: 'input[id="natureOfApplicationChecklist-periodicalPaymentOrder"]',
        type: "checkbox",
        expectedValue: "Yes"
    },
    {
        label: "Pension Sharing Order",
        locator: 'input[id="natureOfApplicationChecklist-Pension Sharing Order"]',
        type: "checkbox",
        expectedValue: "Yes"
    },
    {
        label: "Pension Compensation Sharing Order",
        locator: 'input[id="natureOfApplicationChecklist-Pension Compensation Sharing Order"]',
        type: "checkbox",
        expectedValue: "Yes"
    },
    {
        label: "Pension Attachment Order",
        locator: 'input[id="natureOfApplicationChecklist-Pension Attachment Order"]',
        type: "checkbox",
        expectedValue: "Yes"
    },
    {
        label: "Pension Compensation Attachment Order",
        locator: 'input[id="natureOfApplicationChecklist-Pension Compensation Attachment Order"]',
        type: "checkbox",
        expectedValue: "Yes"
    },
    {
        label: "Variation Order",
        locator: 'input[id="natureOfApplicationChecklist-variationOrder"]',
        type: "checkbox",
        expectedValue: "Yes"
    }
];
