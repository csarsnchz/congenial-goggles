import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
//@Entity({name: 'product_images'})
export class ProductImage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    url: string;

    @ManyToOne(
        () => Product, 
        (product) => product.images,
        {onDelete: 'CASCADE'}
    )
    product: Product;
}