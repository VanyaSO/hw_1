export class OutOfStockError extends Error {
    constructor(productName: string) {
        super(`Not enough stock for ${productName}`);
        this.name = 'OutOfStockError';
    }
}
