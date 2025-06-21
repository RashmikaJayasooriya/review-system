import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';

export async function GET() {
  try {
    await connectToDatabase();
    return NextResponse.json({ status: 'connected' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
}
