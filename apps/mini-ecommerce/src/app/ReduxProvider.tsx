"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { Toaster } from "react-hot-toast";

interface childrenType {
  children: React.ReactNode;
}

const ReduxProvider: React.FC<childrenType> = ({ children }) => {
  return (
    <Provider store={store}>
      {children}
      <Toaster
        position={"top-center"}
        toastOptions={{
          duration: 2000,
          style: {
            background: "#222",
            color: "#fff",
            borderRadius: "12px",
            fontSize: "14px",
          },
        }}
      />
    </Provider>
  );
};

export default ReduxProvider;
