import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '../public/main.css'
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {MantineProvider} from '@mantine/core';
import {Notifications} from "@mantine/notifications";
import {RouterProvider} from "react-router";
import 'dayjs/locale/uk.js';
import dayjs from "dayjs";

import {router} from "./router.tsx";

dayjs.locale('uk');

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <MantineProvider
            defaultColorScheme="light"
            theme={{
                components: {
                    DatePicker: {
                        defaultProps: {
                            size: 'sm',
                        },
                    },
                    DateTimePicker: {
                        defaultProps: {
                            size: 'sm',
                        },
                    },
                },
            }}
        >
            <RouterProvider router={router}/>
            <Notifications position="top-left"/>
        </MantineProvider>
    </StrictMode>,
)
