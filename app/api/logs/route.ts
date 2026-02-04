// app/api/logs/route.ts
import { NextResponse } from 'next/server'
import { NodeSSH } from 'node-ssh'

const ssh = new NodeSSH()

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const file = searchParams.get('file') || 'backup.log'
  
  try {
    await ssh.connect({
      host: process.env.SSH_HOST!,
      port: parseInt(process.env.SSH_PORT || '22'),
      username: process.env.SSH_USER!,
      privateKey: process.env.SSH_PRIVATE_KEY!, // Store key content in environment variable
    })

    // Define remote log file mapping
    const remoteFiles: Record<string, string> = {
      'WeifanWrt_backup.log': '/backup/weifanwrt/backup.log',  // Change to your actual path
      // Add more in the future:
      // 'system.log': '/var/log/system.log',
    }

    const remotePath = remoteFiles[file]
    if (!remotePath) {
      return new Response('File not found', { status: 404 })
    }

    // Read remote file content directly
    const result = await ssh.execCommand(`cat ${remotePath}`)
    ssh.dispose()

    if (result.code !== 0) {
      return NextResponse.json(
        { error: 'Failed to read log file' },
        { status: 500 }
      )
    }

    return new Response(result.stdout, {
      headers: { 'Content-Type': 'text/plain' }
    })

  } catch (error) {
    ssh.dispose()
    return NextResponse.json(
      { error: 'SSH connection failed' },
      { status: 500 }
    )
  }
}