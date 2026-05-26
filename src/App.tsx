import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AppRouter } from "./layouts/AppRouter";
import { ApiMessageDialog } from "./components/common/ApiMessageDialog";
import { ConfirmProvider } from "./components/common/ConfirmDialog";
import { TopLoadingBar } from "./components/common/TopLoadingBar";
import { TooltipProvider } from "./components/ui/tooltip";
import { queryClient } from "./lib/queryClient";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={300}>
        <ConfirmProvider>
          <TopLoadingBar />
          <Toaster position="top-right" richColors closeButton />
          <ApiMessageDialog />
          <AppRouter />
        </ConfirmProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
