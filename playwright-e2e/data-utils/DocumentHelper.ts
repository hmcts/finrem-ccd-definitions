import { Document, Packer, Paragraph, TextRun } from 'docx';
import { mkdir, writeFile } from 'fs/promises';
import { resolve, dirname } from 'path';

export class DocumentHelper {
  /**
   * Creates or overwrites the draft order .docx file and inserts the provided caseReference.
   *
   * @param caseReference - The case reference number to write into the document.
   */
  static async createDraftOrderDocument(caseReference: string): Promise<void> {
    const filePath = resolve(
      './playwright-e2e/resources/files_built_by_tests/upload-draft-order/agreed-draft-order-document.docx'
    );

    await mkdir(dirname(filePath), { recursive: true });

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `Case Reference: ${caseReference}`,
                  bold: true,
                }),
              ],
            }),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    await writeFile(filePath, buffer);
  }
}
