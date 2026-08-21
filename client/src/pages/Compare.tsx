import AppChrome, { BackLink } from "@/components/AppChrome";
import { formatArabicDate, formatDzd } from "@/lib/marketplace";
import { trpc } from "@/lib/trpc";
import { Check } from "lucide-react";
import { useMemo } from "react";

export default function Compare() {
  const ids = useMemo(() => new URLSearchParams(window.location.search).get("ids")?.split(",").filter(Boolean).slice(0, 3) ?? [], []);
  const { data, isLoading, isError } = trpc.offers.compare.useQuery({ ids: ids.length >= 2 ? ids : ["00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000001"] }, { enabled: ids.length >= 2 });
  if (ids.length < 2) return <AppChrome><section className="container py-20 text-center"><h1 className="font-display text-3xl font-extrabold text-[#173e33]">اختر عرضين للمقارنة</h1><p className="mt-3 text-sm text-slate-600">ارجع إلى قائمة العروض وأضف عرضين أو ثلاثة من البطاقات.</p></section></AppChrome>;
  type ComparisonOffer = NonNullable<typeof data>[number];
  const rows: Array<[string, (offer: ComparisonOffer) => string]> = [
    ["السعر", offer => formatDzd(offer.priceDzd)], ["مدينة الانطلاق", offer => offer.departureWilaya],
    ["الذهاب", offer => formatArabicDate(offer.departureDate)], ["المدة", offer => `${offer.durationDays} أيام`],
    ["فندق مكة", offer => offer.makkahHotel || "غير منشور"], ["فندق المدينة", offer => offer.madinahHotel || "غير منشور"],
    ["نمط الرحلة", offer => offer.flightType === "direct" ? "مباشرة" : offer.flightType === "stopover" ? "بتوقف" : "غير منشور"],
    ["التأشيرة", offer => offer.visaIncluded ? "مشمولة" : "غير منشورة"], ["الوجبات", offer => offer.mealsIncluded ? "مشمولة" : "غير منشورة"],
  ];
  return <AppChrome><section className="container py-10 sm:py-14"><BackLink href="/offers" label="العودة إلى العروض" /><h1 className="mt-7 font-display text-4xl font-extrabold text-[#153e32]">مقارنة العروض</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">نقارن ما نشرته الوكالات في المنصة فقط. تظل التفاصيل النهائية والتوفر مسؤولية الوكالة.</p>{isLoading && <div className="mt-8 h-72 animate-pulse rounded-3xl bg-[#edf1eb]" />}{isError && <p className="mt-8 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">تعذر استرجاع العروض المختارة؛ قد يكون أحدها غير نشط الآن.</p>}{data?.length ? <div className="mt-8 overflow-x-auto rounded-[28px] border border-[#e5dfd2] bg-white"><table className="w-full min-w-[720px] text-right text-sm"><thead><tr className="border-b bg-[#f7f6f0]"><th className="p-5 text-[#577066]">المعيار</th>{data.map(offer => <th key={offer.id} className="p-5 align-top"><b className="block font-display text-lg text-[#173e33]">{offer.title}</b><small className="mt-1 block text-slate-500">{offer.agencyName}</small></th>)}</tr></thead><tbody>{rows.map(([label, getter]) => <tr key={label} className="border-t border-[#efede5]"><td className="p-5 font-bold text-[#4d675d]">{label}</td>{data.map(offer => <td key={offer.id} className="p-5 text-[#27473d]">{getter(offer)}</td>)}</tr>)}</tbody></table></div> : null}<div className="mt-6 rounded-2xl bg-[#edf5ee] p-5 text-sm leading-7 text-[#426157]"><span className="inline-flex gap-1 font-bold text-[#0b7257]"><Check size={17} /> تلميح قرار:</span> قارن أولًا القيم التي لا يمكن تغييرها بسهولة: موعد السفر، نقطة الانطلاق، وشروط البرنامج. لا نقول إن عرضًا «أفضل» دون معرفة أولوياتك.</div></section></AppChrome>;
}
