import { invokeLLM, listLLMModels } from "./_core/llm.js";
import { listPublicOffers } from "./marketplace.js";

export async function answerMarketplaceQuestion(question: string) {
  const offers = await listPublicOffers({ limit: 8 });
  const catalog = await listLLMModels();
  const model = catalog.data.find(item => /gpt|claude|gemini/i.test(item.id))?.id ?? catalog.data[0]?.id;
  if (!model) throw new Error("No model is currently available");
  const allowedOffers = offers.map(offer => ({
    id: offer.id, title: offer.title, agency: offer.agencyName, priceDzd: offer.priceDzd, departureWilaya: offer.departureWilaya,
    departureDate: offer.departureDate, returnDate: offer.returnDate, durationDays: offer.durationDays, makkahHotel: offer.makkahHotel,
    madinahHotel: offer.madinahHotel, distanceToHaramMeters: offer.distanceToHaramMeters, flightType: offer.flightType,
    mealsIncluded: offer.mealsIncluded, transportIncluded: offer.transportIncluded, priceUpdatedAt: offer.priceUpdatedAt,
  }));
  const response = await invokeLLM({
    model,
    maxTokens: 420,
    messages: [
      { role: "system", content: `أنت مساعد رفيق المعتمر AI. أجب بالعربية الفصحى وباختصار واضح. استخدم فقط بيانات العروض التالية ولا تخترع سعرًا أو فندقًا أو وكالة أو توفرًا. إذا لم توجد معلومات كافية فقل ذلك واقترح فتح صفحة العروض أو إنشاء طلب عمرة. لا تقدّم فتاوى دينية أو نصيحة طبية أو قانونية. لا تقل إنك حجزت أو تواصلت مع وكالة. اذكر أن التوفر والسعر يتطلبان تأكيدًا نهائيًا من الوكالة. بيانات العروض المسموح بها: ${JSON.stringify(allowedOffers)}` },
      { role: "user", content: question },
    ],
  });
  const content = response.choices[0]?.message.content;
  if (typeof content !== "string" || !content.trim()) throw new Error("Advisor returned an empty response");
  return { answer: content, offerCount: allowedOffers.length };
}
