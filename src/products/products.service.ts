import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly cacheService: CacheService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = await this.productsRepository.save(createProductDto);
    await this.cacheService.delete('products:all');
    return product;
  }

  async findAll() {
    const cacheKey = 'products:all';
    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      return cached;
    }
    const products = await this.productsRepository.find();
    await this.cacheService.set(cacheKey, products);
    return products;
  }

  async findOne(id: number) {
    const cacheKey = `products:${id}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      return cached;
    }
    const product = await this.productsRepository.findOneBy({ id });
    if (product) {
      await this.cacheService.set(cacheKey, product);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.productsRepository.update(id, updateProductDto);
    await this.cacheService.delete(`products:${id}`);
    await this.cacheService.delete('products:all');
    return this.productsRepository.findOneBy({ id });
  }

  async remove(id: number) {
    await this.productsRepository.delete(id);
    await this.cacheService.delete(`products:${id}`);
    await this.cacheService.delete('products:all');
  }
}
