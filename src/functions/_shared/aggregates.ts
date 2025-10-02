import {db} from '@libs/database-manager';

/**
 * Recompute and upsert restaurant-level aggregates from APPROVED reviews.
 */
export async function recomputeRestaurantAggregates(restaurantId: string) {
  const sql = `
    WITH src AS (
      SELECT
        ( (ratings->>'food')::int
        + (ratings->>'service')::int
        + (ratings->>'ambience')::int
        + (ratings->>'value')::int ) / 4.0 AS overall,
        (ratings->>'food')::int AS food,
        (ratings->>'service')::int AS service,
        (ratings->>'ambience')::int AS ambience,
        (ratings->>'value')::int AS value
      FROM review.reviews
      WHERE restaurant_id = $1 AND status = 'APPROVED'
    )
    INSERT INTO review.restaurant_ratings AS r
      (restaurant_id, count_reviews, avg_overall, avg_food, avg_service, avg_ambience, avg_value, updated_at)
    SELECT
      $1,
      COUNT(*)::int,
      COALESCE(AVG(overall),0)::numeric(4,2),
      COALESCE(AVG(food),0)::numeric(4,2),
      COALESCE(AVG(service),0)::numeric(4,2),
      COALESCE(AVG(ambience),0)::numeric(4,2),
      COALESCE(AVG(value),0)::numeric(4,2),
      now()
    FROM src
    ON CONFLICT (restaurant_id)
    DO UPDATE SET
      count_reviews = EXCLUDED.count_reviews,
      avg_overall   = EXCLUDED.avg_overall,
      avg_food      = EXCLUDED.avg_food,
      avg_service   = EXCLUDED.avg_service,
      avg_ambience  = EXCLUDED.avg_ambience,
      avg_value     = EXCLUDED.avg_value,
      updated_at    = now();
  `;
  await db.query(sql, [restaurantId]);
}

/**
 * Recompute and upsert item-level aggregates from APPROVED reviews.
 */
export async function recomputeItemAggregates(menuItemId: string) {
  const sql = `
    WITH src AS (
      SELECT
        ( (ratings->>'food')::int
        + (ratings->>'service')::int
        + (ratings->>'ambience')::int
        + (ratings->>'value')::int ) / 4.0 AS overall
      FROM review.reviews
      WHERE menu_item_id = $1 AND status = 'APPROVED'
    )
    INSERT INTO review.item_ratings AS r
      (menu_item_id, count_reviews, avg_overall, updated_at)
    SELECT
      $1,
      COUNT(*)::int,
      COALESCE(AVG(overall),0)::numeric(4,2),
      now()
    FROM src
    ON CONFLICT (menu_item_id)
    DO UPDATE SET
      count_reviews = EXCLUDED.count_reviews,
      avg_overall   = EXCLUDED.avg_overall,
      updated_at    = now();
  `;
  await db.query(sql, [menuItemId]);
}
