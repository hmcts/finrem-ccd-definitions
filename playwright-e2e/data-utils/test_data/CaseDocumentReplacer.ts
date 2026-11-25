import { envTestData } from './EnvTestDataConfig.ts';
import type { CaseDocument } from '../api/DocumentClient.ts';

/**
 * Replaces every reference to the shared test document (envTestData.DOCUMENT_URL)
 * in the case data with the given document, keeping each field's file name.
 * Used so each case gets its own document instead of sharing one with other
 * cases, which CDAM does not allow.
 */
export function useCaseDocument(data: unknown, document: CaseDocument): void {
  if (Array.isArray(data)) {
    data.forEach((item) => {useCaseDocument(item, document);});
    return;
  }
  if (!data || typeof data !== 'object') {
    return;
  }

  const record = data as Record<string, unknown>;
  if (record.document_url === envTestData.DOCUMENT_URL) {
    record.document_url = document.document_url;
    record.document_binary_url = document.document_binary_url;
    if (document.document_hash) {
      record.document_hash = document.document_hash;
    }
    return;
  }

  Object.values(record).forEach((value) => {useCaseDocument(value, document);});
}
