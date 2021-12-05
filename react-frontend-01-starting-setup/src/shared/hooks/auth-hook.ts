/* eslint-disable import/prefer-default-export */
/* eslint-disable no-undef */
/* eslint-disable array-bracket-spacing */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-fragments */
/* eslint-disable no-unused-vars */
import { useState, useCallback, useEffect } from "react";

let logoutTimer: NodeJS.Timeout;

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState(null);

  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        toke: token,
        expiration: tokenExpirationDate.toISOString(),
      }),
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData")!);
    if (
      storedData
      && storedData.token
      && new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration),
      );
    }
  }, [login]);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      // @ts-ignore
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout]);

  return {
    token, login, logout, userId,
  };
};
