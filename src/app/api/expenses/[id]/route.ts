import { connectToDB } from '@/db/mongodb';
import { ExpenseModel } from '@/models/expense';
import { ExpenseValues } from '@/zod-schema/expense';
import { NextRequest, NextResponse } from 'next/server';

type RequestParams = {
  params: { id: string };
};

export async function PUT(req: NextRequest, { params }: RequestParams) {
  try {
    await connectToDB();
    const { id } = params;
    const expenseDetails: ExpenseValues = await req.json();
    const email = req.headers.get('userEmail');

    const expense = await ExpenseModel.findOneAndUpdate(
      { createdBy: email, _id: new Object(id) },
      {
        ...expenseDetails,
        createdBy: email,
      }
    );

    return NextResponse.json({ expense }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
