import { CreateExpenseRequest } from '@/components/expenses/CreateExpenseModal';
import { connectToDB } from '@/db/mongodb';
import { ExpenseModel } from '@/models/expense';
import { ExpenseListPage } from '@/types/expenses';
import { Filter } from '@/types/filters';
import { translateFilters } from '@/utils/filters';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export type ExpenseRequestBody = {
  sort?: { field: string; value: 'asc' | 'desc' };
  pagination: { page: number; pageSize: number };
  filters: Filter[];
};

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const expenseDetails: CreateExpenseRequest = await req.json();
    const email = req.headers.get('userEmail');

    const expense = await ExpenseModel.create({
      ...expenseDetails,
      createdBy: email,
      fileKeys: expenseDetails.files,
    });

    return NextResponse.json({ expense }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest
): Promise<NextResponse<ExpenseListPage | { message: string }>> {
  try {
    await connectToDB();
    const searchParams = req.nextUrl.searchParams;
    const email = req.headers.get('userEmail');

    const paginationParams = searchParams.get('pagination');
    const sortParams = searchParams.get('sort');
    const filtersParams = searchParams.get('filters');

    const pagination = paginationParams
      ? JSON.parse(paginationParams)
      : { page: 1, pageSize: 100 };
    const filters = filtersParams ? JSON.parse(filtersParams) : [];
    const sort = sortParams
      ? JSON.parse(sortParams)
      : { field: 'name', value: 'asc' };

    const filterStages = translateFilters(filters);

    const expenses = await ExpenseModel.aggregate([
      { $match: { createdBy: email } },
    ])
      .append(...filterStages)
      .append({
        $sort: { [sort!.field]: sort!.value === 'asc' ? 1 : -1 },
      })
      .append(
        { $skip: pagination.pageSize * (pagination.page - 1) },
        { $limit: pagination.pageSize },
        { $addFields: { id: '$_id' } },
        { $project: { _id: 0, __v: 0 } }
      );

    const totalItemCount = await ExpenseModel.countDocuments({});

    return NextResponse.json(
      {
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalItemCount,
        items: expenses,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDB();
    const expenseIds: string[] = await req.json();
    const email = req.headers.get('userEmail');
    const connection = mongoose.connection;

    const session = await connection.startSession();
    try {
      await session.withTransaction(async () => {
        await ExpenseModel.deleteMany(
          {
            createdBy: email,
            _id: { $in: expenseIds.map((id) => new Object(id)) },
          },
          { session }
        );
      });
      session.endSession();
      return NextResponse.json({ expenseIds }, { status: 200 });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (err) {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
