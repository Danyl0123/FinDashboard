// eslint-disable-next-line @nx/enforce-module-boundaries
import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';
import { CategoryEntity } from '../../category/entities/category.entity';

export class CreateTransactionDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
  @IsString()
  @MinLength(6)
  type: 'expense' | 'income';

  @IsNotEmpty()
  category: CategoryEntity;
  // @IsNotEmpty()
  // user: User;
}
