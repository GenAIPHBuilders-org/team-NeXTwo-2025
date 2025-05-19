import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { agentType } = await request.json();
    
    // Path to the Python script
    const scriptPath = path.join(process.cwd(), 'src', 'backend', 'qore', 'qore', 'main.py');
    
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python', [scriptPath, 'run', agentType]);
      
      let output = '';
      let error = '';

      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        error += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          reject(NextResponse.json({ error: `Process exited with code ${code}: ${error}` }, { status: 500 }));
        } else {
          resolve(NextResponse.json({ output }));
        }
      });
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process agent request' }, { status: 500 });
  }
} 