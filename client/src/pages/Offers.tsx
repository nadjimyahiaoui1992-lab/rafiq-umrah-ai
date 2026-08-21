import AppChrome, { SectionIntro } from "@/components/AppChrome";
import OfferCard from "@/components/OfferCard";
import { trpc } from "@/lib/trpc";
import { Landmark, SearchX, SlidersHorizontal } from "lucide-react";
import { Link } from "wouter";
import { useMemo, useState } from "react";

const wilayas = ["", "الجزائر", "وهران", "قسنطينة", "سطيف", "عنابة", "غرداية", "الشلف", "سكيكدة", "تقرت"];

export default function Offers() {
  const [wilaya, setWilaya] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const input = useMemo(() => ({ wilaya: wilaya || undefined, maxPrice: maxPrice ? Number(maxPrice) : undefined, limit: 18 }), [wilaya, maxPrice]);
  const { data, isLoading, isError } = trpc.offers.list.useQuery(input);
  return <AppChrome><section className="container py-12 sm:py-16"><SectionIntro eyebrow="سوق العروض" title="اعثر على عرض واضح التفاصيل" body="تعرض هذه الصفحة عروضًا نشطة لوكالات تم التحقق منها داخل المنصة. يظل السعر والتوفر خاضعين للتأكيد النهائي من الوكالة." />
    <div className="mt-7 grid gap-3 rounded-[22px] border border-[#e6dfd0] bg-white p-4 sm:grid-cols-[1fr_1fr_auto]"><label className="text-xs font-bold text-[#496157]">مدينة الانطلاق<select value={wilaya} onChange={event => setWilaya(event.target.value)} className="mt-2 block w-full rounded-xl border border-[#ded8cb] bg-[#fdfcf8] px-3 py-3 text-sm text-[#284b40]"><option value="">كل المدن</option>{wilayas.filter(Boolean).map(city => <option key={city} value={city}>{city}</option>)}</select></label><label className="text-xs font-bold text-[#496157]">الميزانية القصوى (دج)<input value={maxPrice} onChange={event => setMaxPrice(event.target.value.replace(/\D/g, ""))} inputMode="numeric" placeholder="مثال: 220000" className="mt-2 block w-full rounded-xl border border-[#ded8cb] bg-[#fdfcf8] px-3 py-3 text-sm text-[#284b40]" /></label><div className="flex items-end"><span className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#eef5ef] px-4 py-3 text-xs font-extrabold text-[#0a7055]"><SlidersHorizontal size={15} /> فلاتر متصلة</span></div></div>
    <div className="mt-8 flex items-center gap-2 rounded-2xl border border-[#dbe5dc] bg-[#f1f6f1] p-4 text-xs leading-6 text-[#426157]"><Landmark size={18} className="shrink-0 text-[#0b7659]" /> لا تظهر هنا إلا العروض النشطة ووكالات حالة تحققها «متحقق». لا يعني ذلك اعتمادًا حكوميًا، ويجب مراجعة شروط السعر والتوفر قبل الدفع.</div>
    {isLoading && <div className="mt-8 grid gap-5 lg:grid-cols-3">{[1,2,3].map(key => <div key={key} className="h-[360px] animate-pulse rounded-[26px] bg-[#edf1eb]" />)}</div>}
    {isError && <div className="mt-8 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">تعذر تحميل العروض الآن. حاول مجددًا بعد لحظات.</div>}
    {data && data.length > 0 && <div className="mt-8 grid gap-5 lg:grid-cols-3">{data.map((offer, index) => <OfferCard key={offer.id} offer={offer} featured={index === 0 && offer.isFeatured} selected={compareIds.includes(offer.id)} onCompare={() => setCompareIds(current => current.includes(offer.id) ? current.filter(id => id !== offer.id) : current.length < 3 ? [...current, offer.id] : current)} />)}</div>}
    {data && data.length === 0 && <div className="mt-9 grid place-items-center rounded-[28px] border border-dashed border-[#d8d2c4] bg-white px-6 py-16 text-center"><SearchX size={32} className="text-[#b38a37]" /><h2 className="mt-4 font-display text-2xl font-extrabold text-[#1d483b]">لا توجد عروض مطابقة الآن</h2><p className="mt-2 max-w-md text-sm leading-7 text-slate-600">لم تنشر وكالات متحققة عروضًا تطابق هذه الفلاتر بعد. يمكنك تغيير المدينة أو الميزانية أو إرسال طلب عمرة مفصل.</p></div>}
    {compareIds.length > 0 && <div className="sticky bottom-20 z-30 mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#d9c58d] bg-[#fff9e9] p-4 shadow-lg md:bottom-6"><span className="text-sm font-bold text-[#61491b]">{compareIds.length} عروض مختارة · أضف عرضًا آخر للمقارنة.</span>{compareIds.length >= 2 ? <Link href={`/compare?ids=${compareIds.join(",")}`} className="rounded-xl bg-[#064e3b] px-4 py-3 text-sm font-extrabold text-white">قارن العروض الآن</Link> : <span className="text-xs text-[#826b3c]">اختر عرضًا ثانيًا للمتابعة.</span>}</div>}
  </section></AppChrome>;
}
