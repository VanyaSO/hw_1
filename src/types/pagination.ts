export type PaginationQuery = {
    page?: string;
    limit?: string;
};

export type PaginationResponse<T> = {
    items: T[];
    page: number;
    limit: number;
    pages: number;
    total: number;
};
