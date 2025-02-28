import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'src/dto/response.dto';
import { Repository } from 'typeorm';
import { Category } from '../../entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getAll(): Promise<Response> {
    const category = await this.categoryRepository.find({
      where: { deleted_at: null },
    });

    return {
      statusCode: 200,
      message: 'Category retrived successfully',
      data: { category },
    };
  }

  async findAll(): Promise<Response> {
    const result = await this.categoryRepository.find({
      where: { deleted_at: null },
    });

    return {
      statusCode: 200,
      message: 'Category retrieved successfully',
      data: { result },
    };
  }

  async findOne(id: number): Promise<Response> {
    const result = await this.categoryRepository.findOne({
      where: { category_id: id, deleted_at: null },
    });

    if (!result) {
      throw new NotFoundException('Category not found');
    }
    return {
      statusCode: 200,
      message: 'Category retrieved successfully',
      data: { result },
    };
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Response> {
    const category = this.categoryRepository.create(createCategoryDto);
    const result = await this.categoryRepository.save(category);

    return {
      statusCode: 201,
      message: 'category added successfully',
      data: { result },
    };
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Response> {
    const category = await this.categoryRepository.findOne({
      where: { category_id: id, deleted_at: null },
    });

    if (!category) {
      return {
        statusCode: 404,
        message: 'category not found',
        data: null,
      };
    }
    await this.categoryRepository.update(id, updateCategoryDto);

    const update_category = await this.categoryRepository.findOne({
      where: { category_id: id, deleted_at: null },
    });

    return {
      statusCode: 200,
      message: 'Category updated successfully',
      data: { update_category },
    };
  }

  async delete(id: number): Promise<Response> {
    const category = await this.categoryRepository.findOne({
      where: { category_id: id, deleted_at: null },
    });
    if (!category) {
      return {
        statusCode: 404,
        message: 'Category not found',
        data: null,
      };
    }
    category.deleted_at = new Date();
    await this.categoryRepository.save(category);

    return {
      statusCode: 200,
      message: 'Category deleted successfully',
      data: category,
    };
  }
}
