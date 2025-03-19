import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Transaction } from '../transaction/entities/transaction.entity';
import { TransactionService } from '../transaction/transaction.service';


@Module({
	imports: [TypeOrmModule.forFeature([CategoryEntity, Transaction])],
	controllers: [CategoryController],
	providers: [CategoryService, TransactionService],
})
export class CategoryModule {}
