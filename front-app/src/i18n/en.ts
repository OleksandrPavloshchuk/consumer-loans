export const English = {
    common : {
        title: "Consumer Loans",
        logout: "Logout",
        list: "List"
    },
    page: {
        login: {
            title: "Enter into the system",
            user: "User:",
            password: "Password:",
            submit: "Login",
            notify: {
                accessDenied: {
                    title: "Access Denied",
                    message: "Check login and password"
                }
            }
        },
        activeTasks: {
            title: "Active Tasks",
            newLoan: "New Loan",
            refresh: "Refresh",
            table: {
                columns: {
                    loanId: "Loan Id",
                    stateName: "State Name",
                    processId: "Working Process Id",
                    claimTimestamp: "Claim timestamp"
                }
            }
        },
        archive: {
            title: "Archive",
            filters: {
                label: "Filters",
                startedFrom: {
                    label: "Created from",
                    placeholder: "Begin"
                },
                startedTo: {
                    label: "Created to",
                    placeholder: "End"
                },
                apply: "Apply"
            },
            table: {
                columns: {
                    loanId: "Loan Id",
                    claimTimestamp: "Claim timestamp",
                    processingEndTimestamp: "Processing end timestamp",
                    duration: "Duration",
                    finalState: "Final state"
                }
            }

        }
    }
};

export type Localization = typeof English;