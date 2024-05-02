import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {
    @ApiProperty({
        description: 'The title of the product',
        example: 'Nike Air Max 90'
    })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty({
        description: 'The price of the product',
        example: 100.00
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @ApiProperty({
        description: 'The description of the product',
        example: 'The Nike Air Max 90 is a retro running shoe'
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'The slug of the product',
        example: 'nike_air_max_90'
    })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({
        description: 'The sizes of the product',
        example: ['US 7', 'US 8']
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    sizes?: string[];

    @ApiProperty({
        description: 'The stock of the product',
        example: 100
    })
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @ApiProperty({
        description: 'The tags of the product',
        example: ['running', 'retro']
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags?: string[];

    @ApiProperty({
        description: 'The images of the product',
        example: ['https://example.com/image.jpg']
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[];
    
    @ApiProperty({
        description: 'gender of the product',
        example: 'men'
    })
    @IsString()
    @IsIn(['men', 'women', 'unisex', 'kids'])
    gender: string;
}
