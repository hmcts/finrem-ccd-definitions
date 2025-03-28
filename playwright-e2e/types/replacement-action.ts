export interface ReplacementAction {
  action: 'delete' | 'insert';
  key: string;
  value?: string;
}
