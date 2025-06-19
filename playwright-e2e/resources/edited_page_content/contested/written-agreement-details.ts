import {FieldDescriptor} from "../../../pages/components/field_descriptor.ts";

export const writtenAgreementDetails: FieldDescriptor = [
    {
        label: "Has a written agreement been made about maintenance for the benefit of children?",
        locator: '#benefitForChildrenDecision_radio',
        type: "radio",
        expectedValue: "No"
    },
    {
        label: "For a stepchild or step children",
        type: "checkbox",
        expectedValue: "For a stepchild or step children"
    },
    {
        label: "In addition to child support or maintenance already paid under a Child Support Agency assessment",
        type: "checkbox",
        expectedValue: "In addition to child support or maintenance already paid under a Child Support Agency assessment"
    },
    {
        label: "To meet expenses arising from a child’s disability",
        type: "checkbox",
        expectedValue: "To meet expenses arising from a child’s disability"
    },
    {
        label: "To meet expenses incurred by a child in relation to being educated or training for work",
        type: "checkbox",
        expectedValue: "To meet expenses incurred by a child in relation to being educated or training for work"
    },
    {
        label: "When either the child or the person with care of the child or the absent parent of the child is not habitually resident in the United Kingdom",
        type: "checkbox",
        expectedValue: "When either the child or the person with care of the child or the absent parent of the child is not habitually resident in the United Kingdom"
    }
];
