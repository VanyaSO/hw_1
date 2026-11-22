type JsonDocument = Record<string, unknown>;

export function toJSONTransform(hiddenFields: string[] = []) {
    return (_doc: unknown, ret: JsonDocument) => {
        const { _id, __v, ...rest } = ret;
        for (const field of hiddenFields) {
            delete rest[field];
        }

        return { id: _id, ...rest };
    };
}
