import { HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import Product, { ProductCategory } from '@product/entities/product.entity';
import { Repository } from 'typeorm';
import ProductService from './product.service';

describe('ProductService', () => {
  let productService: ProductService;
  let productRepository: Repository<Product>;

  let productRepositoryToken: string = 'PRODUCT_REPOSITORY';

  const mockProducts: Array<Product> = [];

  const mockNewProduct: Product = Product.create({
    identifier: '35838_10YA',
    name: 'Camiseta em interlock',
    image_url:
      'https://www.prada.com/content/dam/pradabkg_products/3/358/35838/10YIF0009/35838_10YI_F0009_S_161_SLF.jpg/_jcr_content/renditions/cq5dam.web.hebebed.1000.1000.jpg',
    list_price: 6100,
    selling_price: 5900.9,
    category: ProductCategory['TOP'],
  });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        ConfigService,
        {
          provide: productRepositoryToken,
          useValue: {
            find: jest.fn().mockReturnValue(Promise.resolve(mockProducts)),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    productRepository = module.get<Repository<Product>>(productRepositoryToken);
  });

  describe('When findAll function is called', () => {
    it('should return an array of products or []', async () => {
      const products = await productService.findAll();

      expect(productRepository.find).toHaveBeenCalledTimes(1);
      expect(products.length).toBe(mockProducts.length);
    });
  });

  describe('When create function is called', () => {
    it('should return a HttpException when the identifier already exists', async () => {
      jest
        .spyOn(productRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(mockNewProduct));

      jest.spyOn(productRepository, 'save').mockImplementation(() => {
        return (
          mockProducts.push(mockNewProduct) && Promise.resolve(mockNewProduct)
        );
      });

      try {
        await Promise.all([
          productService.create(mockNewProduct),
          productService.create(mockNewProduct),
        ]);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error?.message).toBe('Product identifier already exists');
        expect(error?.status).toBe(400);
      }
    });

    it('should create a new product succesfully and return it', async () => {
      jest
        .spyOn(productRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(undefined));

      jest.spyOn(productRepository, 'save').mockImplementation(() => {
        return (
          mockProducts.push(mockNewProduct) && Promise.resolve(mockNewProduct)
        );
      });

      const mockProductsLengthBefore = mockProducts.length;

      const productCreated: Product = (await productService.create({
        ...mockNewProduct,
      })) as Product;

      expect(productCreated['image_url']).toEqual(null);
      expect(productCreated['active']).toEqual(false);
      expect((await productService.findAll()).length).toBe(
        mockProductsLengthBefore + 1,
      );
    });
  });
});
