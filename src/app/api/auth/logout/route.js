import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request) {
    cookies().delete('session');
    return NextResponse.redirect(new URL('/admin/login', request.url));
}
