import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const agent = searchParams.get('agent');

  if (!agent) {
    return NextResponse.json(
      { error: 'Agent parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Forward the request to the FastAPI backend
    const response = await fetch(`http://localhost:8000/agent-output?agent=${agent}`);
    
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching agent output:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agent output' },
      { status: 500 }
    );
  }
} 