/** Lightweight deferred shell for notifications; loaded after the first visual render. */
import { Toaster } from "@/components/ui/sonner";

export default function DeferredToaster() {
  return <Toaster position="top-center" richColors />;
}
