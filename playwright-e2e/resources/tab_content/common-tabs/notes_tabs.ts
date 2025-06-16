export const notesTabData = (date: string) =>[
    {
    tabName: 'Notes',
    tabContent: [
        "Notes 1",
        { tabItem: "Author", value: "Test Author 1" },
        { tabItem: "Date", value: date },
        { tabItem: "Note", value: "This is a test note 1." },
        "Notes 2",
        { tabItem: "Author", value: "Test Author 2" },
        { tabItem: "Date", value: date },
        { tabItem: "Note", value: "This is a test note 2." }
        ]
    }
];
