import { connectToDB } from '@/db/mongodb';
import { ExpenseModel } from '@/models/expense';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    const email = req.headers.get('userEmail');

    const years = await ExpenseModel.aggregate([
      { $match: { createdBy: email } },
      { $group: { _id: { $year: '$date' } } },
      { $sort: { _id: 1 } },
      { $project: { year: '$_id' } },
    ]);

    return NextResponse.json(
      {
        years: years.map((year) => year.year),
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
