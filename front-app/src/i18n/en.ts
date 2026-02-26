export const English = {
    common : {
        title: "Consumer Loans",
        logout: "Logout",
        list: "List",
        language: "Language"
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
            refresh: "Refresh"
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
            }
        }
    },
    field: {
        taskId: "Task Id",
        taskName: "Task Name",
        loanId: "Loan Id",
        stateName: "State Name",
        processId: "Working Process Id",
        claimTimestamp: "Claim Timestamp",
        lastUpdateTimestamp: "Last Update Timestamp",
        processingEndTimestamp: "Processing end timestamp",
        duration: "Duration",
        finalState: "Final State",
        businessKey: "Business Key",
        personName: "Borrower",
        amount: "Amount",
        personCheckScores: "Person Check Scores",
        personCheckReasons: "Person Check Details",
        financeCheckScores: "Finance Check Scores",
        financeCheckReasons: "Finance Check Details",
        totalScores: "Total Check Rate",
        totalReasons: "Total Check Scores",
        scoringResult: "Scoring Result",
        decision: "Decision"
    },
    action : {
        completeTask: "Complete the task",
        enterLoanData: "Enter loan data",
        approveLoan: "Approve loan",
        rejectLoan: "Reject loan"
    },
    decision: {
        APPROVE: "Approve",
        REJECT: "Reject"
    },
    scoringResult: {
        MANUAL: "Manual",
        AUTO_APPROVE: "Auto approve",
        AUTO_REJECT: "Auto reject"
    },
    loanStatus: {
        "Manual review and final decision": "Manual review and final decision",
        "Deliver decision to the consumer": "Deliver decision to the consumer",
        "Enter loan application": "Enter loan application",
        "Person check": "Person check",
        "Finance check": "Finance check",
        "Aggregate scoring": "Aggregate scoring"
    },
    status: {
        COMPLETED: "Completed"
    },
    sort: {
        label: "Sort",
        asc: "older on the top",
        desc: "younger on the top"
    }
};

export type Localization = typeof English;