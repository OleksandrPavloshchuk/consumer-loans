import {createBrowserRouter} from "react-router-dom";
import {ApplicationLayout} from "./ApplicationLayout.tsx";
import {ActiveTasksRoot} from "./pages/activeTasks/Root.tsx";
import {LoginRoot} from "./pages/login/Root.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <ApplicationLayout/>,
        children: [
            {index: true, element: <ActiveTasksRoot/>},
            {path: "/active", element: <ActiveTasksRoot/>},
            {path: "/login", element: <LoginRoot/>}
        ]
    }
]);