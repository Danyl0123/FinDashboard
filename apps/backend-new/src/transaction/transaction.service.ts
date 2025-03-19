import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';

@Injectable()
export class TransactionService {
	constructor(
		@InjectRepository(Transaction)
		private readonly transcarionRepositoriy: Repository<Transaction>,
	) {}
	async create(createTransactionDto: CreateTransactionDto, id: number) {
		const newTransaction = {
			title: createTransactionDto.title,
			amount: createTransactionDto.amount,
			type: createTransactionDto.type,
			user: { id },
			category: { id: +createTransactionDto.category.id },
		};

		if (!newTransaction)
			throw new BadRequestException('Something went wrong...');

		return await this.transcarionRepositoriy.save(newTransaction);
	}

	async findAll(id: number) {
		const transactions = await this.transcarionRepositoriy.find({
			where: {
				user: { id },
			},
			order: {
				createdAt: 'DESC',
			},
			relations: {
				category: true,
			},
		});
		return transactions;
	}

	async findOne(id: number) {
		const transaction = await this.transcarionRepositoriy.findOne({
			where: {
				id,
			},
			relations: {
				user: true,
				category: true,
			},
		});

		if (!transaction) throw new NotFoundError('transaction is not found');
		return transaction;
	}

	async update(id: number, updateTransactionDto: UpdateTransactionDto) {
		const isExist = await this.transcarionRepositoriy.findOne({
			where: {
				id,
			},
		});
		if (!isExist) throw new NotFoundException('not found');

		return await this.transcarionRepositoriy.update(id, updateTransactionDto);
	}

	async remove(id: number) {
		const isExist = await this.transcarionRepositoriy.findOne({
			where: {
				id,
			},
		});
		if (!isExist) throw new NotFoundException('not found');
		return await this.transcarionRepositoriy.delete(id);
	}

	async findAllWithPagination(id: number, page: number, limit: number) {
		const transactions = await this.transcarionRepositoriy.find({
			where: {
				user: { id },
			},
			relations: {
				category: true,
				user: true,
			},
			order: {
				createdAt: 'DESC',
			},
			take: limit,
			skip: (page - 1) * limit,
		});

		return transactions;
	}
}
