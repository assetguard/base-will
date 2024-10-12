import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Internal components
import { Toaster } from "@/components/ui/toaster.tsx";
import { WalletProvider } from "@/components/WalletProvider.tsx";
import { WrongNetworkAlert } from "@/components/WrongNetworkAlert";
import AppRoutes from "./Routes";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WalletProvider>
      <QueryClientProvider client={queryClient}>
        <div className="bg-[#080828] text-slate-400">
           <AppRoutes />
        </div>
       

        <WrongNetworkAlert />
        <Toaster />
      </QueryClientProvider>
    </WalletProvider>
  </React.StrictMode>,
);
