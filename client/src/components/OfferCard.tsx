/**
 * Style reminder — "رحلات من نور": source-backed cards behave like travel tickets;
 * their first duty is provenance and scannability, not simulated rating or opaque recommendation.
 */
import { Check, ChevronLeft, ExternalLink, Hotel, MapPin, ShieldCheck } from "lucide-react";
import { Offer, formatDzd } from "@/lib/mockData";
import { Link } from "wouter";
import { RouteTicket } from "./AppChrome";

export default function OfferCard({ offer, featured = false }: { offer: Offer; featured?: boolean }) {
  return <article className={`group relative overflow-hidden rounded-[26px] border bg-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(24,58,46,.13)] ${featured ? "border-[#d7bc7b] shadow-[0_16px_40px_rgba(83,64,23,.12)]" : "border-[#e6e2d7]"}`}>
    {featured && <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-l from-[#d6b878] via-[#f5e5ae] to-[#d6b878]" />}
    <div className="flex items-start justify-between gap-3 pt-1"><div><span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-extrabold ${featured ? "bg-[#fff4d9] text-[#8c651f]" : "bg-[#eef6f0] text-[#127355]"}`}><ShieldCheck size={12} />{offer.badge}</span><h3 className="mt-3 font-display text-xl font-extrabold leading-8 text-[#163f34]">{offer.title}</h3></div><div className="text-left"><span className="block text-xl font-extrabold tracking-tight text-[#0c4f3d]" dir="ltr">{formatDzd(offer.price)}</span><span className="text-[11px] text-slate-500">السعر الظاهر</span></div></div>
    <div className="mt-4"><RouteTicket route={offer.route} duration={offer.duration} /></div>
    <div className="my-5 border-y border-dashed border-[#dfd5bf] py-4"><div className="mb-3 flex items-center gap-2 text-[10px] font-extrabold tracking-[.14em] text-[#9c7731]"><span className="h-1.5 w-1.5 rounded-full bg-[#d6b878]" /> ما ظهر في المصدر <span className="h-px flex-1 bg-[#eadfc6]" /></div><div className="grid grid-cols-2 gap-x-3 gap-y-3 text-xs text-[#496157]"><span className="flex items-center gap-1.5"><Hotel size={14} className="text-[#b48736]" />{offer.makkahHotel}</span><span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#b48736]" />{offer.transport}</span><span>{offer.meals}</span><span>{offer.room}</span></div></div>
    <p className="mb-4 text-[11px] leading-5 text-slate-500">المصدر: {offer.sourceLabel} · تحقق: {offer.lastChecked}</p><div className="flex items-center justify-between gap-3"><Link href={`/offer/${offer.id}`} className="inline-flex items-center gap-1 rounded-xl bg-[#073f31] px-3.5 py-2.5 text-xs font-bold text-white transition hover:bg-[#0b644e]">التفاصيل <ChevronLeft size={14} /></Link><a href={offer.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-extrabold text-[#0c7155] hover:text-[#9c7731]">فتح المصدر <ExternalLink size={14} /></a></div>
  </article>;
}
