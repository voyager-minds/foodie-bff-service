import {z} from 'zod';

export const RestaurantCreateDTO = z.object({
  name: z.string().min(2),
  city: z.string().min(2),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  coverImageKey: z.string().optional(),
});
export type RestaurantCreate = z.infer<typeof RestaurantCreateDTO>;

export const MenuItemCreateDTO = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  priceCents: z.number().int().nonnegative(),
  currency: z.string().min(3).max(3).default('LKR'),
  images: z.array(z.string()).optional(),
  isAvailable: z.boolean().optional(),
});
export type MenuItemCreate = z.infer<typeof MenuItemCreateDTO>;
