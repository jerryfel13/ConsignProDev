"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Toaster() {
  return (
    <ToastContainer
      position="top-center"
      autoClose={false}
      hideProgressBar={true}
      newestOnTop
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable={false}
      pauseOnHover
      closeButton={false}
      theme="light"
      className="mt-4"
      toastClassName={() => "bg-transparent shadow-none p-0"}
      bodyClassName={() => "p-0 m-0"}
      icon={false}
    />
  );
}
