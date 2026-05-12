update public.products_by_category
set images = ARRAY['/images/coming-soon.svg']
where "Product Name" = 'Rosemary Oil'
  and (
    images is null
    or '/productimages/Methi_oil.jpeg' = any(images)
  );
