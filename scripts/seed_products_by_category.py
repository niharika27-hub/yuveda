import math
import pathlib

import pandas as pd


EXCEL_PATH = pathlib.Path("e:/yuveda/shop_by_product_compressed.xlsx")
MAPPING_CSV = pathlib.Path("e:/yuveda/product_image_mapping.csv")
SQL_PATH = pathlib.Path("e:/yuveda/supabase/seed_products_by_category.sql")


def normalize_text(value: object) -> str | None:
    if value is None:
        return None
    if isinstance(value, float) and math.isnan(value):
        return None
    return str(value).strip()


def escape_sql(value: str) -> str:
    return value.replace("'", "''")


def main() -> None:
    products = pd.read_excel(EXCEL_PATH, sheet_name=0)
    products = products.rename(columns=lambda c: c.strip())

    mapping = pd.read_csv(MAPPING_CSV)
    mapping = mapping.rename(columns=lambda c: c.strip())

    merged = products.merge(mapping, on="Product Name", how="left")

    required_cols = ["Product Name", "Category", "Quantity", "Price", "images", "Image Filename"]
    for col in required_cols:
        if col not in merged.columns:
            merged[col] = None

    values = []
    for _, row in merged.iterrows():
        name = normalize_text(row.get("Product Name"))
        if not name:
            continue

        category = normalize_text(row.get("Category"))
        quantity = normalize_text(row.get("Quantity"))
        price = normalize_text(row.get("Price"))

        image_list: list[str] = []
        raw_images = row.get("images")
        if isinstance(raw_images, str) and raw_images.strip():
            image_list.extend([item.strip() for item in raw_images.split(",") if item.strip()])

        image_filename = row.get("Image Filename")
        if isinstance(image_filename, str) and image_filename.strip():
            image_list.insert(0, f"/productimages/pdf-extract/{image_filename.strip()}")

        def sql_text(value: str | None) -> str:
            if value is None or value == "":
                return "null"
            return f"'{escape_sql(value)}'"

        if image_list:
            img_sql = "ARRAY[" + ",".join(f"'{escape_sql(item)}'" for item in image_list) + "]"
        else:
            img_sql = "ARRAY[]::text[]"

        values.append(
            f"({sql_text(name)},{sql_text(category)},{sql_text(quantity)},{sql_text(price)},{img_sql})"
        )

    sql = (
        "truncate table public.products_by_category;\n"
        "truncate table public.products_by_concern;\n\n"
        "insert into public.products_by_category (\"Product Name\",\"Category\",\"Quantity\",\"Price\",\"images\")\n"
        "values\n"
        + ",\n".join(values)
        + ";\n"
    )

    SQL_PATH.parent.mkdir(parents=True, exist_ok=True)
    SQL_PATH.write_text(sql, encoding="utf-8")
    print(SQL_PATH)
    print(f"Rows: {len(values)}")


if __name__ == "__main__":
    main()
