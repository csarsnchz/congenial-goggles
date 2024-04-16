import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";

@Entity()
//@Entity({name: 'products'})
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column('text', { unique: true })
    title: string;
      
    @Column('float', { default: 0.00})
    price: number;
    
    @Column({
        type: 'text',
        nullable: true,
    })
    description: string;
    
    @Column('text', {unique: true})
    slug: string;

    @Column('text', {array: true})
    sizes: string[];

    @Column('int', {default: 0})
    stock: number;

    @Column({
        type: 'text',
        array: true,
        default: [],
    })
    tags: string[];
      
    @Column('text')
    gender: string;

    @OneToMany(
        () => ProductImage, 
        (productImage) => productImage.product, 
        {cascade: true, eager: true}
    )
    images?: ProductImage[];



    @BeforeInsert()
    checkSlug() {
        if (!this.slug) {
            this.slug = this.title;
        }
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');
    } 
    
    @BeforeUpdate()
    checkSlugOnUpdate() {
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');
    }

}
