import fs from "node:fs";
import path from "node:path";
import { ProductPageClient } from "./ProductPageClient";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateStaticParams() {
  const seedPath = path.join(process.cwd(), "supabase", "seed_products_by_category.sql");
  const seedSql = fs.readFileSync(seedPath, "utf8");
  const names = Array.from(seedSql.matchAll(/^\('((?:''|[^'])*)'/gm)).map((match) =>
    match[1].replace(/''/g, "'")
  );

  return names.map((name) => ({ id: slugify(name) }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ProductPageClient id={id} />;
}
