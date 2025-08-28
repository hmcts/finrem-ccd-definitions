export type FileTreeNode =
    | { type: 'folder'; label: string; children?: FileTreeNode[] }
    | { type: 'file'; label: string; contentSnippets?: string[] };

export type FileTree = FileTreeNode[];
