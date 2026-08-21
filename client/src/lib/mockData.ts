/**
 * Style reminder — "رحلات من نور": source-backed offers remain calm and legible;
 * visible provenance, date, and unknown fields matter more than filling a card with assumptions.
 */
export type Offer = {
  id: string;
  title: string;
  badge: string;
  price: number;
  duration: string;
  route: string;
  makkahHotel: string;
  madinahHotel: string;
  distance: string;
  transport: string;
  meals: string;
  room: string;
  match: number;
  agency: string;
  tags: string[];
  description: string;
  sourceLabel: string;
  sourceUrl: string;
  lastChecked: string;
  dataNote: string;
};

/**
 * Current source list reviewed on 21 August 2026.
 * Values below are copied only where visible on the public listing; unknown fields remain explicitly unknown.
 */
export const offers: Offer[] = [
  { id: "touggourt-22", title: "عمرة المولد النبوي الشريف 22 أوت 2026", badge: "منشور في المصدر", price: 211000, duration: "15 يومًا", route: "مغادرة من تقرت", makkahHotel: "غير مذكور في القائمة", madinahHotel: "غير مذكور في القائمة", distance: "غير منشورة", transport: "مباشرة", meals: "غير مذكورة", room: "غير منشورة", match: 0, agency: "غير مذكور في قائمة المصدر", tags: ["تقرت", "مباشرة"], description: "عرض منشور في قائمة ElOmraDZ بتاريخ ظاهر 21 أغسطس 2026 لرحلة 22 أوت 2026.", sourceLabel: "ElOmraDZ — القائمة المنشورة", sourceUrl: "https://elomradz.com/offre/948f67f5-75ee-4bed-a266-5b35bde7ba2e", lastChecked: "21 أغسطس 2026", dataNote: "لم تظهر تفاصيل الفندق أو الوجبات أو اسم الوكالة في القائمة التي تم التحقق منها." },
  { id: "chlef-22", title: "عمرة 22 أوت 2026", badge: "منشور في المصدر", price: 215000, duration: "15 يومًا", route: "مغادرة من الشلف", makkahHotel: "غير مذكور في القائمة", madinahHotel: "غير مذكور في القائمة", distance: "غير منشورة", transport: "مباشرة", meals: "غير مذكورة", room: "غير منشورة", match: 0, agency: "غير مذكور في قائمة المصدر", tags: ["الشلف", "مباشرة"], description: "عرض مدرج في ElOmraDZ بتاريخ ظاهر 21 أغسطس 2026 لرحلة 22 أوت 2026.", sourceLabel: "ElOmraDZ — القائمة المنشورة", sourceUrl: "https://elomradz.com/offre/cc5f09c7-e000-45ea-80d4-8544e9ffddf8", lastChecked: "21 أغسطس 2026", dataNote: "تحقق من تفاصيل الإقامة والتوفر مباشرة من المصدر قبل اتخاذ أي إجراء." },
  { id: "ghardaia-22", title: "عمرة المولد النبوي الشريف 22 أوت 2026", badge: "منشور في المصدر", price: 245000, duration: "15 يومًا", route: "مغادرة من غرداية", makkahHotel: "غير مذكور في القائمة", madinahHotel: "غير مذكور في القائمة", distance: "غير منشورة", transport: "مباشرة", meals: "غير مذكورة", room: "غير منشورة", match: 0, agency: "غير مذكور في قائمة المصدر", tags: ["غرداية", "مباشرة"], description: "عرض مدرج في ElOmraDZ بتاريخ ظاهر 21 أغسطس 2026 لرحلة 22 أوت 2026.", sourceLabel: "ElOmraDZ — القائمة المنشورة", sourceUrl: "https://elomradz.com/offre/7a1b9585-6219-43f2-a400-b79e93acd797", lastChecked: "21 أغسطس 2026", dataNote: "عنوان المصدر احتوى على سنة مكتوبة 206؛ لذلك يعتمد تاريخ القائمة الظاهر ولا تُستنتج بيانات إضافية." },
  { id: "skikda-22", title: "عمرة 22 أوت 2026", badge: "تاريخ قريب", price: 195000, duration: "15 يومًا", route: "مغادرة من سكيكدة", makkahHotel: "غير مذكور في القائمة", madinahHotel: "غير مذكور في القائمة", distance: "غير منشورة", transport: "مباشرة", meals: "غير مذكورة", room: "غير منشورة", match: 0, agency: "غير مذكور في قائمة المصدر", tags: ["سكيكدة", "مباشرة"], description: "عرض مدرج في ElOmraDZ؛ تاريخ النشر/الظهور في القائمة 22 أغسطس 2026.", sourceLabel: "ElOmraDZ — القائمة المنشورة", sourceUrl: "https://elomradz.com/offre/44b8642f-c96a-4a58-940b-f4a43dc144a2", lastChecked: "21 أغسطس 2026", dataNote: "السعر والمدة ونمط الرحلة من القائمة؛ التوفر قابل للتغير." },
  { id: "oran-23", title: "عمرة 23 أوت 2026", badge: "أقل سعر ظاهر", price: 165000, duration: "15 يومًا", route: "مغادرة من وهران", makkahHotel: "غير مذكور في القائمة", madinahHotel: "غير مذكور في القائمة", distance: "غير منشورة", transport: "غير مباشرة", meals: "غير مذكورة", room: "غير منشورة", match: 0, agency: "غير مذكور في قائمة المصدر", tags: ["وهران", "غير مباشرة"], description: "عرض مدرج في ElOmraDZ بتاريخ ظاهر 23 أغسطس 2026 لرحلة مدتها 15 يومًا.", sourceLabel: "ElOmraDZ — القائمة المنشورة", sourceUrl: "https://elomradz.com/offre/a6d3dfa2-0141-45e8-bfcc-74885d381fb8", lastChecked: "21 أغسطس 2026", dataNote: "وصف «أقل سعر ظاهر» مقارنة بالعروض المعروضة في هذا التحديث فقط، وليس توصية أو ضمانًا." },
  { id: "annaba-23", title: "عمرة 23 أوت 2026", badge: "منشور في المصدر", price: 205000, duration: "15 يومًا", route: "مغادرة من عنابة", makkahHotel: "غير مذكور في القائمة", madinahHotel: "غير مذكور في القائمة", distance: "غير منشورة", transport: "مباشرة", meals: "غير مذكورة", room: "غير منشورة", match: 0, agency: "غير مذكور في قائمة المصدر", tags: ["عنابة", "مباشرة"], description: "عرض مدرج في ElOmraDZ بتاريخ ظاهر 23 أغسطس 2026 لرحلة مدتها 15 يومًا.", sourceLabel: "ElOmraDZ — القائمة المنشورة", sourceUrl: "https://elomradz.com/offre/7bfdcdc5-00ce-4157-a948-625d23176ada", lastChecked: "21 أغسطس 2026", dataNote: "تفاصيل العرض التي لا تظهر في القائمة لا تُملأ افتراضًا." },
  { id: "algiers-23", title: "عمرة 23 أوت 2026", badge: "منشور في المصدر", price: 219000, duration: "15 يومًا", route: "مغادرة من الجزائر", makkahHotel: "غير مذكور في القائمة", madinahHotel: "غير مذكور في القائمة", distance: "غير منشورة", transport: "مباشرة", meals: "غير مذكورة", room: "غير منشورة", match: 0, agency: "غير مذكور في قائمة المصدر", tags: ["الجزائر", "مباشرة"], description: "عرض مدرج في ElOmraDZ بتاريخ ظاهر 23 أغسطس 2026 لرحلة مدتها 15 يومًا.", sourceLabel: "ElOmraDZ — القائمة المنشورة", sourceUrl: "https://elomradz.com/offre/3482f78f-ee8d-4c7c-97d3-ff0c3065bf63", lastChecked: "21 أغسطس 2026", dataNote: "السعر المعلن وتاريخ الرحلة يخضعان للتحديث من المصدر الخارجي." },
];

export const allOffers: Offer[] = offers;

/** Still a design-only agency directory. It is deliberately kept separate from source-backed offers. */
export const agencies = [
  { name: "رحلات النور للسياحة", city: "الجزائر", offers: 4, rating: "4.8", tone: "from-[#0b5b45] to-[#1f7a5d]", initials: "رن" },
  { name: "أطلس الحرمين", city: "وهران", offers: 3, rating: "4.7", tone: "from-[#ad7a2b] to-[#d6b878]", initials: "أح" },
  { name: "رفاق المشاعر", city: "قسنطينة", offers: 5, rating: "4.9", tone: "from-[#20384c] to-[#496477]", initials: "رم" },
  { name: "بوابة المناسك", city: "سطيف", offers: 2, rating: "4.6", tone: "from-[#805644] to-[#b88768]", initials: "بم" },
  { name: "دروب الحجاز", city: "باتنة", offers: 3, rating: "4.5", tone: "from-[#31524e] to-[#668b83]", initials: "دح" },
];

export const knowledgeCards = ["كيف أستعد للعمرة؟", "ماذا آخذ معي؟", "كيف أختار الفندق؟", "الفرق بين برامج العمرة", "نصائح للمسنين", "دليل مكة", "دليل المدينة", "الأسئلة الشائعة"];
export const formatDzd = (price: number) => `${new Intl.NumberFormat("en-US").format(price)} دج`;
