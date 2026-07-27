"use client";
import LoginPopup from "@/app/components/popups/LoginPopup";
import { createContext, useContext, useMemo, useState } from "react";
interface ContextType {
  isLoginOpen: boolean;
  openLoginModal(): void;
  closeLoginModal(): void;
}

export const authModalContext = createContext<ContextType | null>(null);
export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoginOpen, setisLoginOpen] = useState(false);
  const value = useMemo(
    () => ({
      isLoginOpen,
      openLoginModal: () => setisLoginOpen(true),
      closeLoginModal: () => setisLoginOpen(false),
    }),
    [isLoginOpen],
  );
  return (
    <authModalContext.Provider value={value}>
      {children}
      {isLoginOpen && (
        <LoginPopup
          mode="modal"
          open={isLoginOpen}
          onClose={value.closeLoginModal}
        />
      )}
    </authModalContext.Provider>
  );
}
export const useAuthModal = () => {
  const context = useContext(authModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used inside AuthModalProvider");
  }
  return context;
};
