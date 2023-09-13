import { connectToDB } from '@/db/mongodb';
import { ExpenseModel } from '@/models/expense';
import { ExpenseValues } from '@/zod-schema/expense';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const expenseDetails: ExpenseValues = await req.json();

    const expense = await ExpenseModel.create({
      ...expenseDetails,
    });

    return NextResponse.json({ expense }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
