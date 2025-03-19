import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../transaction/entities/transaction.entity';

@Injectable()
export class CategoryService {
	constructor(
		@InjectRepository(CategoryEntity)
		private readonly categoryrepository: Repository<CategoryEntity>,
		@InjectRepository(Transaction)
		private readonly transactionService: Repository<Transaction>,
	) {}

	async create(createCategoryDto: CreateCategoryDto, id: number) {
		const isExist = await this.categoryrepository.findBy({
			user: { id },
			title: createCategoryDto.title,
		});

		if (isExist.length)
			throw new BadRequestException('This category is already exist');

		const newCategory = { title: createCategoryDto.title, user: { id } };

		return await this.categoryrepository.save(newCategory);
	}

	async findAll(id: number) {
		return await this.categoryrepository.find({
			where: {
				user: { id },
			},
			relations: {
				transactions: true,
			},
		});
	}

	async findOne(id: number) {
		const category = await this.categoryrepository.findOne({
			where: {
				id,
			},
			relations: {
				user: true,
				transactions: true,
			},
		});

		if (!category) throw new NotFoundException('Category not found');

		return category;
	}

	async update(id: number, updateCategoryDto: UpdateCategoryDto) {
		const category = await this.categoryrepository.findOne({
			where: { id },
		});

		if (!category) throw new NotFoundException('Category doesn`t exist');

		return await this.categoryrepository.update(id, updateCategoryDto);
	}

	async remove(id: number) {
		const category = await this.categoryrepository.findOne({
			where: { id },
			relations: ['transactions'],
		});

		if (!category) throw new NotFoundException('Category doesn`t exist');
		await this.transactionService.delete({ category: { id } });
		return await this.categoryrepository.delete(id);
	}
}
