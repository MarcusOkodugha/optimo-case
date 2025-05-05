
CREATE TABLE IF NOT EXISTS sales (
  id SERIAL PRIMARY KEY,
  product TEXT NOT NULL,
  sale_date DATE NOT NULL,
  amount INT NOT NULL
);

CREATE TABLE IF NOT EXISTS purchase_orders (
  id SERIAL PRIMARY KEY,
  supplier TEXT NOT NULL,
  quantity INT NOT NULL,
  order_date DATE NOT NULL,
  estimated_delivery DATE NOT NULL
);

-- Seed 24 months of seasonally‐adjusted sales
INSERT INTO sales (product, sale_date, amount)
SELECT
  prod,
  (date_trunc('month', CURRENT_DATE) - (interval '1 month' * n))::date AS sale_date,

  -- base volume * seasonal factor * random noise
  (
    -- 1) base volume by product
    (CASE prod
       WHEN 'T-Shirts'    THEN 300
       WHEN 'Jeans'       THEN 200
       WHEN 'Shoes'       THEN 150
       WHEN 'Hoodies'     THEN 180
       WHEN 'Accessories' THEN  80
     END)

    *

    -- 2) seasonal multiplier by month (inline expression)
    (CASE extract(
        month FROM (date_trunc('month', CURRENT_DATE) - (interval '1 month' * n))
      )
       WHEN 12 THEN 1.4
       WHEN  1 THEN 1.3
       WHEN  2 THEN 1.2
       WHEN  6 THEN 1.5
       WHEN  7 THEN 1.4
       WHEN  8 THEN 1.3
       ELSE 1.0
     END)

    *

    -- 3) small random variance ±20%
    (0.8 + random() * 0.4)
  )::int AS amount

FROM generate_series(0, 23) AS n,
     unnest(ARRAY['T-Shirts','Jeans','Shoes','Hoodies','Accessories']) AS prod;

-- Seed a handful of purchase orders
INSERT INTO purchase_orders (supplier, quantity, order_date, estimated_delivery) VALUES
  ('Supplier A', 200, CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE + INTERVAL '15 days'),
  ('Supplier B', 150, CURRENT_DATE - INTERVAL '45 days', CURRENT_DATE + INTERVAL '5 days'),
  ('Supplier C', 300, CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '25 days');






