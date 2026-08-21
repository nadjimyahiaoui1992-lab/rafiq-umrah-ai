import AppChrome, { SectionIntro } from "@/components/AppChrome";
import { trpc } from "@/lib/trpc";
import { BadgeCheck, Building2, SearchX } from "lucide-react";
import { Link } from "wouter";

export default function Agencies() {
  const { data, isLoading, isError } = trpc.agencies.list.useQuery({ limit: 30 });
  return <AppChrome><section className="container py-12 sm:py-16"><SectionIntro eyebrow="دليل الوكالات" title="وكالات متحققة داخل المنصة" body="تعني الشارة أن المنصة راجعت ملف الوكالة وفق إجراءاتها الداخلية؛ ولا تمثل اعتمادًا حكوميًا أو تقييمًا للخدمة." />
    {isLoading && <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{[1,2,3].map(item => <div key={item} className="h-48 animate-pulse rounded-[26px] bg-[#edf1ec]" />)}</div>}
    {isError && <p className="mt-8 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">تعذر تحميل دليل الوكالات الآن.</p>}
    {data?.length ? <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{data.map(agency => <Link key={agency.id} href={`/agencies/${agency.slug}`} className="rounded-[26px] border border-[#e7e0d2] bg-white p-6 transition hover:-translate-y-1 hover:border-[#d6b878] hover:shadow-lg"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#eaf3ed] text-[#0a7055]"><Building2 size={21} /></span><h2 className="mt-5 font-display text-xl font-extrabold text-[#173e33]">{agency.displayName}</h2><p className="mt-2 text-sm text-slate-600">{agency.city || "المدينة غير منشورة"}</p><p className="mt-4 min-h-10 text-sm leading-6 text-slate-600">{agency.description || "لا يوجد وصف منشور للوكالة بعد."}</p><span className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-[#0c7257]"><BadgeCheck size={15} /> متحقق داخل المنصة</span></Link>)}</div> : <div className="mt-8 grid place-items-center rounded-[28px] border border-dashed border-[#d8d2c4] bg-white p-14 text-center"><SearchX size={32} className="text-[#b38a37]" /><h2 className="mt-4 font-display text-2xl font-extrabold text-[#1d483b]">لا توجد وكالات متحققة منشورة الآن</h2><p className="mt-2 max-w-md text-sm leading-7 text-slate-600">سيظهر الدليل بعد استكمال وكالات لملفاتها ومراجعتها داخل المنصة.</p></div>}
  </section></AppChrome>;
}
