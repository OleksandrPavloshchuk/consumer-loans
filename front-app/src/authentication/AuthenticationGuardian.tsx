import {useAuthenticationState} from "./AuthenticationState.ts";
import {Navigate, Outlet} from "react-router-dom";

export const AuthenticationGuardian = () => {
    const isAuthenticated = useAuthenticationState((s) => s.isAuthenticated);
    if (isAuthenticated()) {
        return <Outlet/>;
    } else {
        return <Navigate to="/login" replace />;
    }
};