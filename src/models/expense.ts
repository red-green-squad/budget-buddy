import { ExpenseCategories } from '@/constants/expenseCategories';
import { getModelForClass, prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import mongoose from 'mongoose';

export interface Expense extends Base {}

export class Expense extends TimeStamps {
  @prop({ required: true })
  public name!: string;

  @prop({ required: false })
  public description?: string;

  @prop({ required: true })
  public amount!: number;

  @prop({ required: true })
  public date!: Date;

  @prop({
    required: true,
    validate: {
      validator: (category: (typeof ExpenseCategories)[number]) =>
        ExpenseCategories.includes(category),
      message: 'Invalid Category type',
    },
  })
  public category!: string;

  @prop({ required: false })
  public files?: string[];

  @prop({ required: true })
  public createdBy!: string;
}

export const ExpenseModel =
  mongoose.models.Expense || getModelForClass(Expense);
