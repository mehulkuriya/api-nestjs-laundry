import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilePath } from 'src/constants/FilePath';
import { Roles } from 'src/decorator/roles.decorator';
import { Response } from 'src/dto/response.dto';
import { Role } from 'src/enum/role.enum';
import { fileUpload } from '../../multer/image-upload';
import { RolesGuard } from '../auth/guard/role.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@Controller()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.SUB_ADMIN)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('products')
  @Roles(Role.CUSTOMER)
  async getAll(): Promise<Response> {
    return await this.productService.getAll();
  }

  @Get('admin/products')
  async findAll(): Promise<Response> {
    return await this.productService.findAll();
  }

  @Get('admin/products/:id')
  async findOne(@Param('id') id: number): Promise<Response> {
    return await this.productService.findOne(id);
  }

  @Post('admin/products')
  @UseInterceptors(
    FileInterceptor('image', fileUpload(FilePath.PRODUCT_IMAGES)),
  )
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Response> {
    if (!file) {
      throw new HttpException('File must be provide', HttpStatus.BAD_REQUEST);
    }
    const imagepath = file
      ? FilePath.PRODUCT_IMAGES + '/' + file.filename
      : null;
    return this.productService.create(createProductDto, imagepath);
  }

  @Put('admin/products/:id')
  @UseInterceptors(
    FileInterceptor('image', fileUpload(FilePath.PRODUCT_IMAGES)),
  )
  async update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Response> {
    const imagepath = file
      ? FilePath.PRODUCT_IMAGES + '/' + file.filename
      : null;
    return await this.productService.update(id, updateProductDto, imagepath);
  }

  @Delete('admin/products/:id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<Response> {
    return await this.productService.delete(id);
  }
}
