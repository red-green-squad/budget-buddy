import { getModelForClass, prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import mongoose from 'mongoose';

export interface User extends Base {}

export class User extends TimeStamps {
  @prop({ required: true, unique: true })
  public email!: string;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public password!: string;

  @prop({ required: false })
  public profileImage?: string;
}

export const UserModel = mongoose.models.User || getModelForClass(User);
