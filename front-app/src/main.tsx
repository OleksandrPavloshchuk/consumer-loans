import '@mantine/core/styles.css';
import '../public/main.css'
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {MantineProvider} from '@mantine/core';
import {ActiveTasksRoot} from "./pages/activeTasks/Root.tsx";
import {Notifications} from "@mantine/notifications";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <MantineProvider defaultColorScheme="light">
            <ActiveTasksRoot/>
            <Notifications position="top-left" />
        </MantineProvider>
    </StrictMode>,
)
