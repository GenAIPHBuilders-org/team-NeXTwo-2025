import { NextResponse } from 'next/server';
import userData from '../../../backend/qore/knowledge/user.json';

export async function GET() {
  return NextResponse.json(userData);
} 