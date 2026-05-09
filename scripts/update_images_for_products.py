import pathlib
import re

import pandas as pd


SOURCE_PATH = pathlib.Path("e:/yuveda/src/lib/products-live.ts")
EXCEL_PATH = pathlib.Path("e:/yuveda/shop_by_product_compressed.xlsx")
SQL_PATH = pathlib.Path("e:/yuveda/supabase/update_product_images.sql")


def extract_mapping(text: str) -> dict[str, str]:
    block_match = re.search(
        r"const\s+productImageByName\s*:[^{]*\{([\s\S]*?)\}\s*;",
        text,
        re.MULTILINE,
    )
    if not block_match:
        raise SystemExit("productImageByName block not found")

    block = block_match.group(1)

    mapping: dict[str, str] = {}

    for key, value in re.findall(r'"([^"]+)"\s*:\s*"([^"]+)"', block):
        mapping[key.strip().lower()] = value.strip()

    for key, value in re.findall(r"\b([a-zA-Z0-9_]+)\b\s*:\s*\"([^\"]+)\"", block):
        normalized_key = key.strip().lower()
        if normalized_key not in mapping:
            mapping[normalized_key] = value.strip()

    return mapping


def normalize_name(value: str) -> str:
    return " ".join(value.strip().lower().split())


def build_variants(value: str) -> list[str]:
    variants = [value]

    replacements = [
        ("trifla", "triphala"),
        ("triphla", "triphala"),
        ("lawki", "lauki"),
        ("gaujawan", "gajwan"),
        ("arq", "ark"),
        ("bowl", "bowel"),
    ]

    for src, dst in replacements:
        if src in value:
            variants.append(value.replace(src, dst))

    return list(dict.fromkeys(variants))


def escape_sql(value: str) -> str:
    return value.replace("'", "''")


def main() -> None:
    text = SOURCE_PATH.read_text(encoding="utf-8")
    mapping = extract_mapping(text)

    products = pd.read_excel(EXCEL_PATH, sheet_name=0)
    products = products.rename(columns=lambda c: c.strip())

    if "Product Name" not in products.columns:
        raise SystemExit("Missing Product Name")

    statements = []
    matched = 0

    for raw_name in products["Product Name"].tolist():
        if not isinstance(raw_name, str):
            continue

        name = normalize_name(raw_name)
        image_path = None

        for variant in build_variants(name):
            if variant in mapping:
                image_path = mapping[variant]
                break

        if not image_path:
            continue

        matched += 1
        sql_name = escape_sql(raw_name)
        sql_value = escape_sql(image_path)
        statements.append(
            "update public.products_by_category "
            "set images = ARRAY['%s'] "
            "where \"Product Name\" = '%s';" % (sql_value, sql_name)
        )

    sql = "\n".join(statements) + "\n"
    SQL_PATH.parent.mkdir(parents=True, exist_ok=True)
    SQL_PATH.write_text(sql, encoding="utf-8")

    print(SQL_PATH)
    print(f"Matched products: {matched}")
    print(f"Statements: {len(statements)}")


if __name__ == "__main__":
    main()
