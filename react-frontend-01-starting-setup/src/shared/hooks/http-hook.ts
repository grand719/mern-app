/* eslint-disable max-len */
/* eslint-disable consistent-return */
/* eslint-disable no-continue */
/* eslint-disable object-shorthand */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-case-declarations */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-vars */
import {
  useCallback, useState, useRef, useEffect,
} from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url: string, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrll = new AbortController();
      // @ts-ignore
      activeHttpRequests.current.push(httpAbortCtrll);
      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrll.signal,
        });

        const responseData: any = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter((reqCtrl) => reqCtrl !== httpAbortCtrll);

        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setIsLoading(false);
        return responseData;
      } catch (err: any) {
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    [],
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
    // @ts-ignore
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);
  return {
    isLoading, error, sendRequest, clearError,
  };
};
