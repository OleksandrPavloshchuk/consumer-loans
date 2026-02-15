import {type Localization} from "./en.ts";

export const Ukrainian = {
    common: {
        title: "Споживчі позички",
        logout: "Вихід",
        list: "Список",
        language: "Мова"
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
            refresh: "Обновити"
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
            }
        }
    },
    field: {
        taskId: "Ідентифікатор задачі",
        taskName: "Операція",
        loanId: "Ідентифікатор позички",
        stateName: "Назва статусу",
        processId: "Ідентифікатор працюючого процесу",
        claimTimestamp: "Дата і час подання заявки",
        lastUpdateTimestamp: "Дата і час останньої зміни",
        processingEndTimestamp: "Дата і час закінчення обробки",
        duration: "Тривалість",
        finalState: "Фінальний стан позички",
        businessKey: "Бізнес-ключ",
        personName: "Позичальник",
        amount: "Сума позички",
        personCheckScores: "Рейтинг перевірки особи",
        personCheckReasons: "Деталі перевірки особи",
        financeCheckScores: "Рейтинг перевірки фінансів",
        financeCheckReasons: "Деталі перевірки фінансів",
        totalScores: "Загальний рейтинг перевірки",
        totalReasons: "Загальні деталі перевірки",
        scoringResult: "Результат перевірки",
        decision: "Рішення"
    },
    action : {
        completeTask: "Закінчити задачу",
        enterLoanData: "Ввести дані позички",
        approveLoan: "Видати позичку",
        rejectLoan: "Відхилити позичку"
    },
    decision: {
        APPROVE: "Схвалено",
        REJECT: "Відхилено"
    },
    scoringResult: {
        MANUAL: "Ручне рішення",
        AUTO_APPROVE: "Автоматичне схвалення",
        AUTO_REJECT: "Автоматичне відхилення"
    }

} satisfies Localization;