import {createBrowserRouter} from "react-router-dom";
import {ApplicationLayout} from "./ApplicationLayout.tsx";
import {ActiveTasksRoot} from "./pages/activeTasks/Root.tsx";
import {LoginRoot} from "./pages/login/Root.tsx";
import {AuthenticationGuardian} from "./authentication/AuthenticationGuardian.tsx";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginRoot/>
    },
    {
        element: <AuthenticationGuardian/>,
        children: [{
            path: "/",
            element: <ApplicationLayout />,
            children: [
                { index: true, element: <ActiveTasksRoot /> },
                { path: "active", element: <ActiveTasksRoot /> },
            ]
        }]
    }
]);
