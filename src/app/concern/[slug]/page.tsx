import { concerns } from "@/lib/concerns";
import { ConcernPageClient } from "./ConcernPageClient";

export function generateStaticParams() {
  return concerns.map((concern) => ({ slug: concern.slug }));
}

export default async function ConcernPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <ConcernPageClient slug={slug} />;
}
