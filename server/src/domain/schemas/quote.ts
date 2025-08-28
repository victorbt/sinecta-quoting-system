import { z } from 'zod';
export const GeoJSONPolygonSchema = z.object({
  type: z.literal('Polygon'),
  coordinates: z.array(z.array(z.tuple([z.number(), z.number()])))
});

export const CreateQuoteSchema = z.object({
  clientName: z.string().min(2),
  crop: z.enum(['MAIZ', 'TRIGO', 'SORGO', 'CAFE', 'AGAVE']),
  state: z.enum(['JALISCO', 'MICHOACAN', 'SINALOA', 'CHIHUAHUA', 'SONORA']),
  areaHa: z.number().positive(),
  insuredAmount: z.number().positive(),
  validFrom: z.coerce.date(),
  validTo: z.coerce.date(),
  polygon: GeoJSONPolygonSchema
}).refine(d => d.validTo > d.validFrom, { message: 'validTo must be after validFrom', path: ['validTo'] });

export const UpdateQuoteSchema = z.object({
  clientName: z.string().min(2).optional(),
  crop: z.enum(['MAIZ', 'TRIGO', 'SORGO', 'CAFE', 'AGAVE']).optional(),
  state: z.enum(['JALISCO', 'MICHOACAN', 'SINALOA', 'CHIHUAHUA', 'SONORA']).optional(),
  areaHa: z.number().positive().optional(),
  insuredAmount: z.number().positive().optional(),
  validFrom: z.coerce.date().optional(),
  validTo: z.coerce.date().optional(),
  polygon: GeoJSONPolygonSchema.optional()
}).refine(d => {
  if (d.validTo && d.validFrom && (d.validTo > d.validFrom)) {
    return {
      message: 'validTo must be after validFrom', path: ['validTo']
    }
  }
  return
}
);

export const ListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  crop: z.enum(['MAIZ', 'TRIGO', 'SORGO', 'CAFE', 'AGAVE']).optional(),
  state: z.enum(['JALISCO', 'MICHOACAN', 'SINALOA', 'CHIHUAHUA', 'SONORA']).optional(),
  q: z.string().optional()
});
