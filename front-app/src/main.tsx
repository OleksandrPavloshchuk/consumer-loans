import '@mantine/core/styles.css';
import '../public/main.css'
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {MantineProvider} from '@mantine/core';
import {Notifications} from "@mantine/notifications";
import {RouterProvider} from "react-router";
import {router} from "./router.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <MantineProvider defaultColorScheme="light">
            <RouterProvider router={router}/>
            <Notifications position="top-left" />
        </MantineProvider>
    </StrictMode>,
)
