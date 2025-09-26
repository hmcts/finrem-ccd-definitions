import { Table } from "../../../pages/components/table"

export const judgeUploadApprovedOrderTableData: Table = {
    tableName: 'Check your answers',
    rows: [
        "Upload approved order",
        { cellItem: "Upload Approved Document", value: "judgeApprovedOrder.docx" },
        { cellItem: "Upload additional attachments", value: "additionalAttachment.pdf" },
    ]
}
