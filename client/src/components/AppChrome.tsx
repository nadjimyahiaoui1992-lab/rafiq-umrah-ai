/**
 * Style reminder — "رحلات من نور": a calm, accessible navigation shell with a dark-green anchor,
 * sand-gold route accents, and gentle assistant interactions that never overwhelm the journey.
 */
import { Link, useLocation } from "wouter";
import {
  Bot, Building2, ChevronLeft, Compass, Home, MessageCircle, Plane, Search, Sparkles, UserRound, X,
} from "lucide-react";
import { ReactNode, useState } from "react";

const logoUrl = "/manus-storage/rafiq-logo-mark-256_a6625f22.webp";
const notify = (message: string) => { void import("sonner").then(({ toast }) => toast.info(message)); };

const navItems = [
  { href: "/", label: "الرئيسية" },
  { href: "/offers", label: "عروض العمرة" },
  { href: "/agencies", label: "الوكالات" },
  { href: "/agency-growth", label: "حلول الوكالات" },
  { href: "/knowledge", label: "دليل المعتمر" },
  { href: "/planner", label: "AI Planner" },
];

export function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5" aria-label="الانتقال إلى الرئيسية">
      <span className={`grid h-10 w-10 place-items-center rounded-2xl ${light ? "bg-white/10" : "bg-[#eff5f1]"}`}>
        <img src={logoUrl} alt="علامة رفيق المعتمر" width="256" height="256" decoding="async" className="h-8 w-8 object-contain" />
      </span>
      <span className="leading-none">
        <span className={`block font-display text-[18px] font-extrabold tracking-tight ${light ? "text-white" : "text-[#073f31]"}`}>رفيق المعتمر</span>
        <span className={`mt-1 block text-[10px] font-bold tracking-[0.19em] ${light ? "text-[#e7d5a8]" : "text-[#aa7f33]"}`} dir="ltr">RAFIQ UMRAH AI</span>
      </span>
    </Link>
  );
}

export function DemoRibbon() {
  return (
    <div className="border-y border-[#dccda7] bg-[#fff7df] px-4 py-2 text-center text-xs font-medium text-[#6d5120]">
      <span className="font-bold">تحديث مصدرّي:</span> تعرض صفحة العروض بيانات منشورة مع رابط المصدر وتاريخ التحقق؛ الأسعار والتوفر متغيران ولا يعني الظهور اعتمادًا أو شراكة أو ضمانًا من رفيق المعتمر AI.
    </div>
  );
}

function Assistant() {
  const [open, setOpen] = useState(false);
  const prompts = ["ما أفضل عرض لي؟", "قارن هذه العروض", "ماذا أحتاج للعمرة؟", "أريد عمرة اقتصادية", "عرض مناسب لكبار السن"];
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 left-4 z-50 flex items-center gap-2 rounded-full bg-[#064e3b] px-4 py-3 text-sm font-bold text-white shadow-[0_16px_35px_rgba(6,78,59,.26)] transition hover:-translate-y-1 hover:bg-[#0a674f] md:bottom-7 md:left-7"
        aria-label="فتح رفيقك الذكي"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-[#d6b878] text-[#123b31]"><Bot size={16} /></span>
        <span className="hidden sm:block">رفيقك الذكي</span>
      </button>
      {open && (
        <div className="fixed inset-0 z-[60] bg-[#10251e]/30 backdrop-blur-[2px]" onClick={() => setOpen(false)}>
          <aside onClick={(event) => event.stopPropagation()} className="absolute bottom-4 left-4 right-4 max-w-md rounded-[28px] bg-[#fbfaf7] p-5 shadow-2xl md:bottom-7 md:left-7 md:right-auto md:w-[390px]">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#064e3b] text-[#d6b878]"><Bot size={21} /></span>
                <div><p className="font-display text-lg font-extrabold text-[#123b31]">رفيقك الذكي</p><p className="text-xs text-emerald-700">متاح للمساعدة</p></div>
              </div>
              <button className="rounded-full p-2 text-slate-500 hover:bg-slate-100" onClick={() => setOpen(false)} aria-label="إغلاق"><X size={18} /></button>
            </div>
            <div className="rounded-2xl rounded-tr-sm bg-[#e9f3ed] p-4 text-sm leading-7 text-[#264c40]">السلام عليكم. أنا رفيقك الذكي، أساعدك في مقارنة العروض وفهم تفاصيل البرامج وتجهيز رحلتك.</div>
            <p className="mt-5 text-xs font-bold tracking-wide text-[#967436]">اختر سؤالًا سريعًا</p>
            <div className="mt-2 grid gap-2">
              {prompts.map((prompt) => <button key={prompt} onClick={() => notify("هذه محادثة تجريبية — سيُربط المساعد الذكي لاحقًا.")} className="rounded-xl border border-[#e5dfce] bg-white px-3 py-2.5 text-right text-sm text-[#32554a] transition hover:border-[#d6b878] hover:bg-[#fffaf0]">{prompt}</button>)}
            </div>
            <p className="mt-4 text-[11px] leading-5 text-slate-500">للمسائل الدينية التفصيلية أو الحساسة، يرجى الرجوع إلى المصادر الرسمية أو أهل العلم الموثوقين.</p>
          </aside>
        </div>
      )}
    </>
  );
}

export default function AppChrome({ children, compact = false }: { children: ReactNode; compact?: boolean }) {
  const [location] = useLocation();
  const [language, setLanguage] = useState("العربية");
  return (
    <div dir="rtl" className="min-h-screen overflow-x-clip bg-[#fbfaf7] text-[#16231f]">
      <header className="sticky top-0 z-40 border-b border-[#e9e3d4] bg-[#fbfaf7]/95 backdrop-blur-xl">
        <div className="container flex h-[76px] items-center justify-between gap-4">
          <BrandMark />
          {!compact && <nav className="hidden items-center gap-4 lg:flex" aria-label="التنقل الرئيسي">
            {navItems.map((item) => <Link key={item.href} href={item.href} className={`text-sm font-semibold transition hover:text-[#0a7156] ${location === item.href ? "text-[#0a7156]" : "text-slate-600"}`}>{item.label}</Link>)}
          </nav>}
          <div className="flex items-center gap-2">
            <button onClick={() => setLanguage(language === "العربية" ? "Français" : language === "Français" ? "English" : "العربية")} className="hidden rounded-full border border-[#dcd7c8] bg-white px-3 py-2 text-xs font-bold text-[#35544a] sm:block" aria-label="تبديل اللغة">{language} <span className="mr-1 text-[#ad8438]">⌄</span></button>
            <Link href="/agency-growth" className="hidden items-center gap-2 rounded-full bg-[#064e3b] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#0a674f] md:flex"><Building2 size={15} /> وكالتك معنا</Link>
            <button onClick={() => notify("هذا الحساب جزء من نموذج العرض فقط.")} className="grid h-10 w-10 place-items-center rounded-full bg-[#eef2ec] text-[#285847]" aria-label="الحساب"><UserRound size={18} /></button>
          </div>
        </div>
      </header>
      <DemoRibbon />
      <main>{children}</main>
      {!compact && <MobileNav location={location} />}
      {!compact && <Assistant />}
      {!compact && <footer className="mt-16 border-t border-[#e4decf] bg-[#f3f0e8] pb-24 pt-12 md:pb-10"><div className="container flex flex-col justify-between gap-8 md:flex-row"><div><BrandMark /><p className="mt-4 max-w-sm text-sm leading-7 text-slate-600">منصة تجريبية تساعد المعتمر الجزائري على تنظيم المقارنة واتخاذ قرار أوضح.</p></div><div className="flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold text-[#476359]"><Link href="/offers">العروض</Link><Link href="/agencies">الوكالات</Link><Link href="/knowledge">دليل المعتمر</Link><Link href="/planner">المخطط الذكي</Link></div></div><div className="container mt-10 border-t border-[#ddd6c5] pt-5 text-xs text-slate-500">© 2026 رفيق المعتمر AI — نموذج تصميم وتجربة مستخدم.</div></footer>}
    </div>
  );
}

function MobileNav({ location }: { location: string }) {
  const items = [
    { href: "/", label: "الرئيسية", icon: Home },
    { href: "/offers", label: "العروض", icon: Search },
    { href: "/planner", label: "AI", icon: Sparkles, special: true },
    { href: "/agencies", label: "الوكالات", icon: Building2 },
    { href: "/agency-dashboard", label: "حسابي", icon: UserRound },
  ];
  return <nav className="fixed inset-x-0 bottom-0 z-40 flex h-[69px] items-end justify-around border-t border-[#e5e0d5] bg-[#fbfaf7]/95 px-1 pb-2 pt-1 backdrop-blur-xl md:hidden" aria-label="تنقل الهاتف">{items.map((item) => { const Icon = item.icon; const active = location === item.href; return <Link key={item.href} href={item.href} className={`flex min-w-[58px] flex-col items-center gap-1 text-[10px] font-bold ${active ? "text-[#087258]" : "text-slate-500"}`}>{item.special ? <span className="-mt-7 grid h-14 w-14 place-items-center rounded-full border-4 border-[#fbfaf7] bg-[#064e3b] text-[#d6b878] shadow-lg"><Icon size={21} /></span> : <Icon size={18} />}<span>{item.label}</span></Link>})}</nav>;
}

export function SectionIntro({ eyebrow, title, body, action }: { eyebrow: string; title: string; body?: string; action?: ReactNode }) {
  return <div className="relative mb-8 flex flex-col justify-between gap-4 overflow-hidden py-3 md:flex-row md:items-end"><div className="relative z-10"><span className="pointer-events-none absolute -right-10 -top-10 h-24 w-48 rounded-[100%] border border-[#d6b878]/55" /><span className="pointer-events-none absolute right-20 top-0 h-1.5 w-1.5 rounded-full bg-[#d6b878]" /><p className="mb-3 text-xs font-extrabold tracking-[0.18em] text-[#a78038]">{eyebrow}</p><h2 className="font-display text-3xl font-extrabold leading-tight text-[#103d32] md:text-4xl">{title}</h2>{body && <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">{body}</p>}</div>{action}</div>;
}

export function BackLink({ href = "/offers", label = "العودة إلى العروض" }: { href?: string; label?: string }) {
  return <Link href={href} className="inline-flex items-center gap-1 text-sm font-bold text-[#0c7257] transition hover:gap-2"><ChevronLeft size={17} /> {label}</Link>;
}

export function RouteTicket({ route, duration }: { route: string; duration: string }) {
  return <span className="inline-flex items-center gap-2 rounded-full border border-[#d9e3dc] bg-[#fffdf8] px-3 py-1.5 text-xs font-bold text-[#36564b] shadow-[0_5px_13px_rgba(38,70,56,.05)]"><span className="grid h-5 w-5 place-items-center rounded-full border border-[#e8d39b] bg-[#fff4d7]"><Plane size={11} className="text-[#a87b29]" /></span><span>{route}</span><span className="flex items-center gap-0.5" aria-hidden="true"><i className="h-px w-2 bg-[#d6b878]" /><i className="h-1 w-1 rounded-full bg-[#d6b878]" /><i className="h-px w-2 bg-[#d6b878]" /></span><span className="text-[#866620]">{duration}</span></span>;
}
