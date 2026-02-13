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
            title: "Active Tasks"
        },
        archive: {
            title: "Archive",
            list: "Список",
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
    }
};

export type Localization = typeof English;