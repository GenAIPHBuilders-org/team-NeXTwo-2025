import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src/backend/qore/knowledge/user.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const userData = JSON.parse(fileContents);
    
    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error reading user data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
} 