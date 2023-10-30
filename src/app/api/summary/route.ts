import { connectToDB } from '@/db/mongodb';
import { ExpenseModel } from '@/models/expense';
import { NextRequest, NextResponse } from 'next/server';

export type ExpenseSummaryRequestBody = {
  groupBy: string;
  year: number;
};

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const { groupBy, year }: ExpenseSummaryRequestBody = await req.json();
    const email = req.headers.get('userEmail');

    const summary = await ExpenseModel.aggregate([
      {
        $match: {
          createdBy: email,
          $expr: {
            $eq: [{ $year: '$date' }, year],
          },
        },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: [groupBy, 'month'] },
              then: { $month: '$date' },
              else: '$category',
            },
          },
          totalAmount: { $sum: '$amount' },
        },
      },
      { $project: { group: '$_id', totalAmount: '$totalAmount' } },
    ]);

    return NextResponse.json(
      {
        summary,
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
