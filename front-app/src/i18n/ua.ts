import {type Localization} from "./en.ts";
import {Table} from "@mantine/core";
import {SortArrow} from "../lib/SortArrow.tsx";

export const Ukrainian = {
    common: {
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
            title: "В роботі",
            newLoan: "Нова позичка",
            refresh: "Обновити",
            table: {
                columns: {
                    loanId: "Ідентифікатор позички",
                    stateName: "Назва статусу",
                    processId: "Ідентифікатор працюючого процесу",
                    claimTimestamp: "Дата і час початку оформлення позички"
                }
            }
        },
        archive: {
            title: "Архів",
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
            },
            table: {
                columns: {
                    loanId: "Ідентифікатор позички",
                    claimTimestamp: "Дата і час подання заявки",
                    processingEndTimestamp: "Дата і час закінчення обробки",
                    duration: "Тривалість",
                    finalState: "Фінальний стан позички"
                }
            }
        }
    }
} satisfies Localization;