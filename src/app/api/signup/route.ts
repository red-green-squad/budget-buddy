import { connectToDB } from '@/db/mongodb';
import { UserModel } from '@/models/User';
import bcryptjs from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

type UserDetails = {
  email: string;
  fullName: string;
  password: string;
};

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const userDetails: UserDetails = await req.json();

    const hashedPassword = await bcryptjs.hash(userDetails.password, 10);

    const user = await UserModel.create({
      email: userDetails.email,
      name: userDetails.fullName,
      password: hashedPassword,
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
