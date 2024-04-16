import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate as isUUID } from 'uuid';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Product, ProductImage } from './entities';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productsImageRepository: Repository<ProductImage>,   
    
    private readonly dataSource: DataSource,
  ) {}
  async create(createProductDto: CreateProductDto) {
    try {
      const {images = [], ...productDetails } = createProductDto;
      const product = this.productsRepository.create({
        ...productDetails,
        images: images.map(image => this.productsImageRepository.create({url: image}))
      }); 
      await this.productsRepository.save(product);
      return {...product,images};
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException(error.detail);
      }
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error occurred while creating a product'); 
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const {limit = 100, offset = 0} = paginationDto;
    const products = await this.productsRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      }
    });
    return products.map(product => ({
      ...product, 
      images: product.images.map(image => image.url)}));
  }

  async findOne(term: string) {
    //const product = await this.productsRepository.findOne({where: {id}});
    let product: Product;
    if (isUUID(term)) {
      product = await this.productsRepository.findOneBy({ id: term});
    } else {
     //product = await this.productsRepository.findOneBy({ slug: term });
     const queryBuilder = this.productsRepository.createQueryBuilder('product');
     const query = term.toLowerCase();
     product = await queryBuilder
      .where("LOWER(title) = :title or slug = :slug", { 
        title: query,
        slug: query })
      .leftJoinAndSelect("product.images", "images")  
      .getOne();
    }
    if (!product) throw new NotFoundException(`Product with term ${term} not found`);
    return product;
  }

  async findOnePlain(term: string) {
    const {images = [], ...product} = await this.findOne(term);
    return {...product, images: images.map(image => image.url)};
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const {images, ...toUpdate} = updateProductDto;
    const product = await this.productsRepository.preload({id, ...toUpdate});
    if (!product) throw new NotFoundException(`Product with id ${id} not found`);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, {product: {id}});
        product.images = images.map(image => this.productsImageRepository.create({url: image}));
      }
      await queryRunner.manager.save(product);
      //await this.productsRepository.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return this.findOnePlain(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error occurred while updating a product'); 
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);
        if (!product) throw new NotFoundException(`Product with id ${id} not found`);
        //await this.productsRepository.delete(id);
        await this.productsRepository.remove(product);
        return {message: `Product with id ${id} deleted`};
  }

  async deleteAll() {
    const query = this.productsRepository.createQueryBuilder('product');
    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error occurred while deleting all products');       
    }
  }  
}
