import AppChrome, { BackLink, SectionIntro } from "@/components/AppChrome";
import OfferCard from "@/components/OfferCard";
import { trpc } from "@/lib/trpc";
import { BadgeCheck, Building2, ExternalLink, MapPin } from "lucide-react";
import { useRoute } from "wouter";

export default function AgencyProfile() {
  const [, params] = useRoute("/agencies/:slug");
  const slug = params?.slug ?? "";
  const { data, isLoading, isError } = trpc.agencies.bySlug.useQuery({ slug }, { enabled: !!slug });
  if (isLoading) return <AppChrome><div className="container py-20 text-center text-sm text-slate-500">جارٍ تحميل ملف الوكالة...</div></AppChrome>;
  if (isError || !data) return <AppChrome><div className="container py-20 text-center"><h1 className="font-display text-3xl font-extrabold text-[#173e33]">ملف الوكالة غير متاح</h1><p className="mt-3 text-sm text-slate-600">قد تكون حالة التحقق تغيرت أو لم يعد الملف منشورًا.</p></div></AppChrome>;
  return <AppChrome><section className="container py-10 sm:py-14"><BackLink href="/agencies" label="العودة إلى الوكالات" /><div className="mt-7 rounded-[30px] bg-[#073f31] p-7 text-white sm:p-10"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#d6b878] text-[#173d32]"><Building2 size={23} /></span><div className="mt-6 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><span className="inline-flex items-center gap-1 text-xs font-bold text-[#e6cd8b]"><BadgeCheck size={14} /> متحقق داخل المنصة</span><h1 className="mt-3 font-display text-4xl font-extrabold">{data.displayName}</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-[#c9d8d0]">{data.description || "لم تنشر الوكالة تعريفًا تفصيليًا بعد."}</p></div><div className="space-y-2 text-sm text-[#d6e4dd]"><p className="flex gap-2"><MapPin size={16} />{data.city || "المدينة غير منشورة"}</p>{data.websiteUrl && <a target="_blank" rel="noreferrer" href={data.websiteUrl} className="flex items-center gap-2 font-bold text-[#eed58f]"><ExternalLink size={15} /> موقع الوكالة</a>}</div></div></div><div className="mt-10"><SectionIntro eyebrow="العروض النشطة" title="ما نشرته الوكالة حاليًا" body="العروض التالية ما زالت نشطة في المنصة، وتخضع لشروط وتوفر الوكالة النهائي." />{data.offers.length ? <div className="grid gap-5 lg:grid-cols-3">{data.offers.map(offer => <OfferCard key={offer.id} offer={{ ...offer, agencyName: data.displayName, agencySlug: data.slug, agencyVerification: "verified" }} />)}</div> : <div className="rounded-[24px] border border-dashed border-[#dad2c0] bg-white p-8 text-sm leading-7 text-slate-600">لا توجد عروض نشطة منشورة لهذه الوكالة الآن.</div>}</div></section></AppChrome>;
}
