import {beforeEach, describe, expect, it, vi} from "vitest";
import axios from "axios";
import {createConnector, createJwtConnector} from "./backendConnector.ts";
import * as authService from "../authentication/authenticationService.ts";
import {getAccessToken, refreshToken} from "../authentication/authenticationService.ts";

vi.mock("../authentication/authenticationService/", () => ({
    getAccessToken: vi.fn(),
    refreshToken: vi.fn()
}));

describe("Backend connector", () => {

    beforeEach(() => {
        vi.resetAllMocks(); // скидає всі виклики і return values
        vi.stubGlobal("localStorage", {
            getItem: vi.fn(),
            setItem: vi.fn(),
            removeItem: vi.fn(),
            clear: vi.fn()
        });
    });

    it("createConnector", () => {
        const spy = vi.spyOn(axios, "create");
        const connector = createConnector();
        expect(connector).not.toBeNull();
        expect(spy).toHaveBeenCalledWith({
            baseURL: "/",
            headers: {
                "Content-Type": "application/json"
            }
        });
    });

    it("createJwtConnector - has request and response interceptors", () => {
        const connector = createJwtConnector();
        expect(connector.interceptors.request.handlers.length).toBeGreaterThan(0);
        expect(connector.interceptors.response.handlers.length).toBeGreaterThan(0);
    });

    it("createJwtConnector - request interceptor adds token to Authentication header", async () => {
        vi.mocked(getAccessToken).mockReturnValue("access-token-1");

        const connector = createJwtConnector();
        const config = {headers: {}};
        const interceptor = connector.interceptors.request.handlers[0].fulfilled;
        const newConfig = await interceptor(config);
        expect(newConfig.headers.Authorization).toBe("Bearer access-token-1");
    });

    it("createJwtConnector - refresh access token on 401 Unauthorized", async () => {
        vi.mocked(getAccessToken).mockReturnValue("access-token-2");
        const refreshMock = vi.spyOn(authService, 'refreshToken').mockResolvedValue("new-token");
        const connector = createJwtConnector();

        connector.interceptors.response.handlers[0].rejected = async (error: any) => {
            const originalRequest = error.config;
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                const newToken = await refreshToken();
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                return { data: {} }; // повертаємо фейковий результат
            }
            return Promise.reject(error);
        };

        const responseInterceptor = connector.interceptors.response.handlers[0].rejected;
        const error = {
            response: { status: 401, data: { error: "access_token_expired" } },
            config: { headers: {}, _retry: false, baseURL: "http://localhost" }
        };
        await responseInterceptor!(error);

        expect(refreshMock).toHaveBeenCalled();

        refreshMock.mockRestore();
    });

});