import pathlib
import re


SOURCE_PATH = pathlib.Path("e:/yuveda/src/lib/products-live.ts")
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


def escape_sql(value: str) -> str:
    return value.replace("'", "''")


def main() -> None:
    text = SOURCE_PATH.read_text(encoding="utf-8")
    mapping = extract_mapping(text)

    statements = []
    for key, value in sorted(mapping.items()):
        sql_key = escape_sql(key)
        sql_value = escape_sql(value)
        statements.append(
            "update public.products_by_category "
            "set images = ARRAY['%s'] "
            "where lower(\"Product Name\") = '%s';" % (sql_value, sql_key)
        )

    sql = "\n".join(statements) + "\n"
    SQL_PATH.parent.mkdir(parents=True, exist_ok=True)
    SQL_PATH.write_text(sql, encoding="utf-8")

    print(SQL_PATH)
    print(f"Statements: {len(statements)}")


if __name__ == "__main__":
    main()
