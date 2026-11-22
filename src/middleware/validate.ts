import { Request, Response, NextFunction } from 'express';
import z, { ZodType } from 'zod';

export function validate(schema: ZodType) {
    return function (req: Request, res: Response, next: NextFunction) {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const { formErrors, fieldErrors } = z.flattenError(result.error);
            return res.status(400).json({ error: formErrors.length ? formErrors.join(', ') : fieldErrors });
        }

        req.body = result.data;
        next();
    };
}
