import {type Localization} from "./en.ts";

export const Ukrainian = {
    common : {
        title: "Споживчі позички",
        logout: "Вихід",
        list: "Список"
    },
    page: {
        login: {
            title: "Вхід до системи",
            user: "Користувач:",
            password: "Пароль:",
            submit: "Увійти",
            notify: {
                accessDenied: {
                    title: "Вхід заборонено",
                    message: "Перевірте логін та пароль"
                }
            }
        },
        activeTasks: {
            title: "В роботі"
        },
        archive: {
            title: "Архів",
            list: "List",
            filters: {
                label: "Фільтри",
                startedFrom: {
                    label: "Створено від",
                    placeholder: "Початок"
                },
                startedTo: {
                    label: "Створено до",
                    placeholder: "Кінець"
                },
                apply: "Застосувати"
            }
        }
    }
} satisfies Localization;