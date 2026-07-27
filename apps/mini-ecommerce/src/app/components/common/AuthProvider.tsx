"use client";

import { useAuth } from "@/hooks/useAuth";
import React, { useEffect, useState } from "react";
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { refetch, refresh } = useAuth();
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    async function init() {
      const res = await refetch();
      if (res?.data?.user) {
        setIsReady(true);
        return;
      }
      if (res.error && res.error?.data?.httpStatus === 401) {
        try {
          await refresh();
          await refetch();
        } catch {}
      }
      setIsReady(true);
    }
    init();
  }, []);
  if (!isReady) {
    return null;
  }
  return <>{children}</>;
};

export default AuthProvider;
