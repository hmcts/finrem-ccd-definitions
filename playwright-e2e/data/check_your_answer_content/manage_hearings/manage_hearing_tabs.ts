const getFormattedDate = (): string => {
    const today = new Date();
    return today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const manageHearingTabsData =
    {
        tableName: 'Hearing',
        tableRows: [
            ["Type of Hearing", "Maintenance Pending Suit (MPS)"],
            ["Hearing Time Estimate", "1 hour"],
            ["Hearing Date", getFormattedDate()],
            ["Hearing Time", "10:00 AM"],
            "This would usually be the applicants local Court",
            {tabItem: "Please state in which Financial Remedies Court Zone the applicant resides", value: "Midlands"},
            {tabItem: "Hearing attendance", value: "In person"},
            {tabItem: "Additional information about the hearing", value: "MPS Additional information about the hearing"},
            {tabItem: "Do you want to upload any other documents?", value: "Yes"},
            {tabItem: "Please upload any additional documents related to your application.", value: "MPSfile1.pdf MPSfile2.pdf"},
            {tabItem: "Do you want to send a notice of hearing?", value: "Yes"},
            {tabItem: "Who should see this order?", value: "Applicant - Frodo Baggins Respondent - Smeagol Gollum"},
        ]

    };