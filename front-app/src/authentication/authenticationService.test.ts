import {describe, expect, it, vi} from 'vitest';
import {createConnector} from "../axiosClient/backendConnector.ts";
import {login, refreshToken} from "./authenticationService.ts";

describe("Authentication service", () => {

    it("login - OK", async () => {

        const setItemMock = vi.fn();
        vi.stubGlobal("localStorage", {
            getItem: vi.fn(),
            setItem: setItemMock,
            removeItem: vi.fn(),
            clear: vi.fn()
        });

        vi.mock("../axiosClient/backendConnector", () => ({
            createConnector: vi.fn()
        }));

        const expectedAccessToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMSIsInJvbGVzIjpbIlJPTEVfVVNFUiJdLCJncm91cHMiOlsiR1JPVVBfQURNSU4iXSwiaWF0IjoxNzY4NDg5MjAwLCJleHAiOjE3Njg1MDcyMDB9.Fe6McjXCQ1udfa1l0Hjo9hs_I26P1kXKU0ATr-SZN8U";
        const postMock = vi.fn().mockResolvedValue({
            data: {
                accessToken: expectedAccessToken,
                refreshToken: "refresh_token"
            }
        });
        (createConnector as unknown as vi.Mock).mockReturnValue({
            post: postMock
        });

        const actual = await login("user one", "password two");
        expect(actual).toBe(expectedAccessToken);
        expect(postMock).toHaveBeenCalledWith(
            "/auth/login",
            { user: "user one", password: "password two" }
        );
        expect(setItemMock).toHaveBeenCalledWith(
            "access_token",
            expectedAccessToken
        );
        expect(setItemMock).toHaveBeenCalledWith(
            "refresh_token",
            "refresh_token"
        );
    });

    it("login - invalid credentials", async () => {

        vi.mock("../axiosClient/backendConnector", () => ({
            createConnector: vi.fn()
        }));

        const postMock = vi.fn().mockRejectedValue(new Error("401 Unauthorized"));
        (createConnector as unknown as vi.Mock).mockReturnValue({
            post: postMock
        });

        await expect(login("user one", "password bad")).rejects.toBeDefined();
    });

    it("refresh - OK", async () => {

        const setItemMock = vi.fn();
        const getItemMock = vi.fn( (_) => "refresh_token");
        vi.stubGlobal("localStorage", {
            getItem: getItemMock,
            setItem: setItemMock,
            removeItem: vi.fn(),
            clear: vi.fn()
        });

        vi.mock("../axiosClient/backendConnector", () => ({
            createConnector: vi.fn()
        }));

        const expectedAccessToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMSIsInJvbGVzIjpbIlJPTEVfVVNFUiJdLCJncm91cHMiOlsiR1JPVVBfQURNSU4iXSwiaWF0IjoxNzY4NDg5MjAwLCJleHAiOjE3Njg1MDcyMDB9.Fe6McjXCQ1udfa1l0Hjo9hs_I26P1kXKU0ATr-SZN8U";
        const postMock = vi.fn().mockResolvedValue({
            data: {
                accessToken: expectedAccessToken
            }
        });
        (createConnector as unknown as vi.Mock).mockReturnValue({
            post: postMock
        });

        const actual = await refreshToken();
        expect(actual).toBe(expectedAccessToken);
        expect(postMock).toHaveBeenCalledWith(
            "/auth/refresh",
            { refreshToken: "refresh_token" }
        );
        expect(setItemMock).toHaveBeenCalledWith(
            "access_token",
            expectedAccessToken
        );
    });

    it("refresh - no refresh token", async () => {
        
        vi.stubGlobal("localStorage", {
            getItem: vi.fn(),
            setItem: vi.fn(),
            removeItem: vi.fn(),
            clear: vi.fn()
        });

        vi.mock("../axiosClient/backendConnector", () => ({
            createConnector: vi.fn()
        }));

        const expectedAccessToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMSIsInJvbGVzIjpbIlJPTEVfVVNFUiJdLCJncm91cHMiOlsiR1JPVVBfQURNSU4iXSwiaWF0IjoxNzY4NDg5MjAwLCJleHAiOjE3Njg1MDcyMDB9.Fe6McjXCQ1udfa1l0Hjo9hs_I26P1kXKU0ATr-SZN8U";
        const postMock = vi.fn().mockResolvedValue({
            data: {
                accessToken: expectedAccessToken
            }
        });
        (createConnector as unknown as vi.Mock).mockReturnValue({
            post: postMock
        });
        await expect(refreshToken()).rejects.toBeDefined();
    });

});