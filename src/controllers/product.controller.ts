import { Request, Response } from 'express';
import { Product } from '../models/product.model';
import { CreateProductDto, UpdateProductDto } from '../types/product';
import { paginate } from '../utils/pagination';
import { PaginationQuery } from '../types/pagination';

export async function getAllProducts(req: Request<{}, unknown, unknown, PaginationQuery>, res: Response) {
    const products = await paginate({
        model: Product,
        query: req.query,
    });

    return res.status(200).json(products);
}

export async function getProductById(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    return res.status(200).json(product);
}

export async function createProduct(req: Request<{}, unknown, CreateProductDto>, res: Response) {
    const productDto = req.body;
    const product = await Product.create(productDto);

    return res.status(201).json(product);
}

export async function updateProduct(req: Request<{ id: string }, unknown, UpdateProductDto>, res: Response) {
    const { id } = req.params;
    const updateProductDto = req.body;

    const product = await Product.findByIdAndUpdate(id, updateProductDto, {
        returnDocument: 'after',
        runValidators: true,
    });
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    return res.status(200).json(product);
}

export async function deleteProduct(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    const result = await Product.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Product not found' });
    }

    return res.status(204).end();
}
