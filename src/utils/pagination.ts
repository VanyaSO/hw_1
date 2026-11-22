import { PaginationQuery, PaginationResponse } from '../types/pagination';
import { PAGINATION_DEFAULT_LIMIT, PAGINATION_MAX_LIMIT } from '../config/constants';
import { HydratedDocument, Model, QueryFilter, SortOrder } from 'mongoose';
import { HttpError } from '../errors/HttpError';

type PaginateParams<T> = {
    model: Model<T>;
    query: PaginationQuery;
    sort?: Record<string, SortOrder>;
    filter?: QueryFilter<T>;
};

export async function paginate<T>({
    model,
    query,
    sort = { createdAt: -1, _id: -1 },
    filter = {},
}: PaginateParams<T>): Promise<PaginationResponse<HydratedDocument<T>>> {
    const { page: pageParam, limit: limitParam } = query;
    const page = pageParam ? Number(pageParam) : 1;
    const limit = limitParam ? Number(limitParam) : PAGINATION_DEFAULT_LIMIT;

    if (!Number.isInteger(page) || !Number.isInteger(limit) || page < 1 || limit < 1 || limit > PAGINATION_MAX_LIMIT) {
        throw new HttpError(400, `Page and limit must be positive integers, limit <= ${PAGINATION_MAX_LIMIT}`);
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
        model.find(filter).sort(sort).skip(skip).limit(limit),
        model.countDocuments(filter),
    ]);

    return {
        items,
        page,
        limit,
        pages: Math.ceil(total / limit),
        total,
    };
}
