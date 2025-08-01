import {Tab} from "../../../pages/components/tab.ts";
import config from "../../../config/config.ts";

export const manageIntervenerCSTabData: Tab[] =
    [
        {
        tabName: 'Intervener 1',
        tabContent: [
            { tabItem: "Intervener's Full Name", value: "Test Intervener" },
            { tabItem: "Does the intervener live outside of the UK?", value: "No" },
            { tabItem: "Building and Street", value: "test street" },
            { tabItem: "Address Line 2", value: "test address line 2" },
            { tabItem: "Town or City", value: "test town" },
            { tabItem: "County", value: "test county" },
            { tabItem: "Postcode/Zipcode", value: "test postcode" },
            { tabItem: "Country", value: "test country" },
            { tabItem: "Email address", value: config.applicant_intervener.email},
            { tabItem: "Representative's Full Name", value: "Test Representative" },
            { tabItem: "Representative's Email address", value: config.applicant_intervener.email }
        ]
    },
        {
            tabName: 'Intervener 2',
            tabContent: [
                { tabItem: "Intervener's Full Name", value: "Test Intervener 2" },
                { tabItem: "Does the intervener live outside of the UK?", value: "No" },
                { tabItem: "Building and Street", value: "test street" },
                { tabItem: "Address Line 2", value: "test address line 2" },
                { tabItem: "Town or City", value: "test town" },
                { tabItem: "County", value: "test county" },
                { tabItem: "Postcode/Zipcode", value: "test postcode" },
                { tabItem: "Country", value: "test country" },
                { tabItem: "Email address", value: config.applicant_intervener.email},

            ],
            excludedContent: [
                "Representative's Full Name",
                "Representative's Email address",
            ]
        }
]

export const manageIntervenerTabData: Tab[] = [
    {
        tabName: 'Intervener 1',
        tabContent: [
            { tabItem: "Intervener's Full Name", value: "Test Intervener" },
            { tabItem: "Is the Intervener represented ?", value: "Yes" },
            { tabItem: "Representative's Full Name", value: "Test Representative" },
            { tabItem: "Representative's Email address", value: config.applicant_intervener.email },
            { tabItem: "Representative's Phone number", value: "01234567890" },
            { tabItem: "Representative Firm", value: "Test Firm" },
            { tabItem: "Your reference", value: "Test Reference" },
        ]
    },
    {
        tabName: 'Intervener 2',
        tabContent: [
            {tabItem: "Intervener's Full Name", value: "Test Intervener 2"},
            {tabItem: "Is the Intervener represented ?", value: "No"},
        ]
    }

]
