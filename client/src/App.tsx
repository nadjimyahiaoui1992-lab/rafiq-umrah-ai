/** Style reminder — "رحلات من نور": routes expose one coherent, premium RTL prototype rather than disconnected screens. */
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import { lazy, Suspense, useEffect, useLayoutEffect, useState } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

const Planner = lazy(() => import("@/pages/Planner"));
const Offers = lazy(() => import("@/pages/Offers"));
const OfferDetails = lazy(() => import("@/pages/OfferDetails"));
const Agencies = lazy(() => import("@/pages/Agencies"));
const AgencyGrowth = lazy(() => import("@/pages/AgencyGrowth"));
const Knowledge = lazy(() => import("@/pages/Knowledge"));
const AgencyDashboard = lazy(() => import("@/pages/AgencyDashboard"));
const DeferredToaster = lazy(() => import("@/components/DeferredToaster"));

function RouteLoader() { return <div dir="rtl" className="grid min-h-screen place-items-center bg-[#fbfaf7] text-sm font-bold text-[#31584b]">جارٍ تجهيز الصفحة...</div>; }
function IdleToaster() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const timer = globalThis.setTimeout(() => setEnabled(true), 7000);
    return () => globalThis.clearTimeout(timer);
  }, []);
  return enabled ? <Suspense fallback={null}><DeferredToaster /></Suspense> : null;
}
function Router() { return <Suspense fallback={<RouteLoader />}><Switch><Route path="/" component={Home} /><Route path="/planner" component={Planner} /><Route path="/offers" component={Offers} /><Route path="/offer/:id" component={OfferDetails} /><Route path="/agencies" component={Agencies} /><Route path="/agency-growth" component={AgencyGrowth} /><Route path="/knowledge" component={Knowledge} /><Route path="/agency-dashboard" component={AgencyDashboard} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch></Suspense>; }
function App() {
  useLayoutEffect(() => {
    document.documentElement.dataset.appReady = "true";
    return () => { delete document.documentElement.dataset.appReady; };
  }, []);
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><IdleToaster /><Router /></ThemeProvider></ErrorBoundary>;
}
export default App;
