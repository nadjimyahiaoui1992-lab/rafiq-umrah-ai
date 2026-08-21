import { lazy, Suspense, useEffect, useLayoutEffect, useState } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import NotFound from "@/pages/NotFound";

const Planner = lazy(() => import("@/pages/Planner"));
const Offers = lazy(() => import("@/pages/Offers"));
const OfferDetails = lazy(() => import("@/pages/OfferDetails"));
const Agencies = lazy(() => import("@/pages/Agencies"));
const AgencyProfile = lazy(() => import("@/pages/AgencyProfile"));
const AgencyGrowth = lazy(() => import("@/pages/AgencyGrowth"));
const Knowledge = lazy(() => import("@/pages/Knowledge"));
const AgencyDashboard = lazy(() => import("@/pages/AgencyDashboard"));
const RequestUmrah = lazy(() => import("@/pages/RequestUmrah"));
const Account = lazy(() => import("@/pages/Account"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const Compare = lazy(() => import("@/pages/Compare"));
const Advisor = lazy(() => import("@/pages/Advisor"));
const DeferredToaster = lazy(() => import("@/components/DeferredToaster"));

function RouteLoader() { return <div dir="rtl" className="grid min-h-screen place-items-center bg-[#fbfaf7] text-sm font-bold text-[#31584b]">جارٍ تجهيز الصفحة...</div>; }
function IdleToaster() { const [enabled, setEnabled] = useState(false); useEffect(() => { const timer = globalThis.setTimeout(() => setEnabled(true), 7000); return () => globalThis.clearTimeout(timer); }, []); return enabled ? <Suspense fallback={null}><DeferredToaster /></Suspense> : null; }
function Router() { return <Suspense fallback={<RouteLoader />}><Switch><Route path="/" component={Home} /><Route path="/planner" component={Planner} /><Route path="/offers" component={Offers} /><Route path="/compare" component={Compare} /><Route path="/advisor" component={Advisor} /><Route path="/offer/:id" component={OfferDetails} /><Route path="/agencies" component={Agencies} /><Route path="/agencies/:slug" component={AgencyProfile} /><Route path="/request-umrah" component={RequestUmrah} /><Route path="/account" component={Account} /><Route path="/agency-growth" component={AgencyGrowth} /><Route path="/knowledge" component={Knowledge} /><Route path="/agency-dashboard" component={AgencyDashboard} /><Route path="/admin" component={AdminDashboard} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch></Suspense>; }
export default function App() { useLayoutEffect(() => { document.documentElement.dataset.appReady = "true"; return () => { delete document.documentElement.dataset.appReady; }; }, []); return <ErrorBoundary><ThemeProvider defaultTheme="light"><IdleToaster /><Router /></ThemeProvider></ErrorBoundary>; }
