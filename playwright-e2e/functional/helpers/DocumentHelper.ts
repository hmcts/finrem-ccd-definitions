import { Document, Packer, Paragraph, TextRun } from 'docx';
import { writeFile } from 'fs/promises';
import { resolve } from 'path';

export class DocumentHelper {
  /**
   * Updates the draft order .docx file by inserting the provided caseReference.
   *
   * @param caseReference - The case reference number to write into the document.
   */
  static async updateDraftOrderDocument(caseReference: string): Promise<void> {
    const filePath = resolve(
      './playwright-e2e/data/payload/contested/caseworker/upload-draft-order/agreed-draft-order-document.docx'
    );

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
