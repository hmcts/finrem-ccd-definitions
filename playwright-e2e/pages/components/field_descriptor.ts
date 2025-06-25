export interface FieldDescriptor {
    label: string;
    locator?: string;
    type: 'input' | 'select' | 'radio' | 'checkbox' | 'date' | 'file';
    expectedValue: string | boolean;
    position?: number; // 0-based index for multiple occurrences
}
