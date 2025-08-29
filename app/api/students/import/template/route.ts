import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const csv = [
    'first_name,last_name,email,password,phone',
    'Jane,Doe,jane@example.com,TempPass#123,9999999999',
    'John,Smith,john@example.com,,8888888888',
  ].join('\n') + '\n'

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="students_template.csv"',
      'Cache-Control': 'no-store',
    },
  })
}
