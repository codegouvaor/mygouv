import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { localizedAlternates, resolveLocaleParam } from "@/lib/localized-metadata";
import { SectionPage, type SectionPageKind } from "@/components/public/content/section-page";

type PageProps = { params: Promise<{ locale: string }> };

const PATH = "publications-officielles";
const KIND: SectionPageKind = "publicationsOfficielles";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  return { ...localizedAlternates(locale, PATH) };
}

export default async function SectionPageRoute({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  setRequestLocale(locale);
  return <SectionPage locale={locale} kind={KIND} />;
}
