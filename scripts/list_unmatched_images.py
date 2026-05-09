import pathlib
import re

import pandas as pd

SOURCE_PATH = pathlib.Path("e:/yuveda/src/lib/products-live.ts")
EXCEL_PATH = pathlib.Path("e:/yuveda/shop_by_product_compressed.xlsx")


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


def normalize(value: str) -> str:
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


def main() -> None:
    mapping = extract_mapping(SOURCE_PATH.read_text(encoding="utf-8"))

    products = pd.read_excel(EXCEL_PATH, sheet_name=0)
    products = products.rename(columns=lambda c: c.strip())

    unmatched: list[str] = []

    for raw_name in products["Product Name"].tolist():
        if not isinstance(raw_name, str):
            continue
        name = normalize(raw_name)
        found = False
        for variant in build_variants(name):
            if variant in mapping:
                found = True
                break
        if not found:
            unmatched.append(raw_name)

    print("Unmatched:")
    for item in unmatched:
        print(item)
    print(f"Total unmatched: {len(unmatched)}")


if __name__ == "__main__":
    main()
