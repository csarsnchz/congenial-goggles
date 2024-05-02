import { ApiProperty } from "@nestjs/swagger";
import { Product } from "src/products/entities";
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @Column('text', { unique: true })
    email: string;

    @ApiProperty()
    @Column('text')
    password: string;

    @ApiProperty()
    @Column('text')
    fullName: string;

    @ApiProperty()
    @Column('bool',{ default: true })
    isActive: boolean;

    @ApiProperty()
    @Column({
        type: 'text',
        array: true,
        default: ['user'],
    })
    roles: string[];

    @ApiProperty()
    @OneToMany(
        () => Product,
        (product) => product.user
    )
    product: Product;

    @BeforeInsert()
    emailToLowerCase() {
        this.email = this.email.toLowerCase();
    }
}
