import {z} from 'zod';

export const RatingDTO = z.object({
  food: z.number().int().min(1).max(5),
  service: z.number().int().min(1).max(5),
  ambience: z.number().int().min(1).max(5),
  value: z.number().int().min(1).max(5),
});

export const ReviewCreateDTO = z.object({
  restaurantId: z.string().min(1),
  menuItemId: z.string().optional(),
  ratings: RatingDTO,
  text: z.string().min(5).max(2000),
  // authorSub will be derived from auth in production; for assignment we accept via body or headers.
  authorSub: z.string().min(3),
});

export const CommentCreateDTO = z.object({
  text: z.string().min(2).max(1000),
  role: z.enum(['customer', 'owner', 'moderator']),
  authorSub: z.string().min(3),
});

export const ModerationDecisionDTO = z.object({
  reason: z.string().max(500).optional(),
});
