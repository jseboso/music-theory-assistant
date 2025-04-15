import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Use a fixed configuration that works with static exports
export const dynamic = 'force-static';

export async function GET(request: Request) {
  // This function will only run in the browser during development
  // When exported, it will become a static file

  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
      try {
        const cookieStore = cookies();
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
        await supabase.auth.exchangeCodeForSession(code);
      } catch (error) {
        console.error("Auth error:", error);
      }
    }

    return NextResponse.redirect(requestUrl.origin);
  } catch (error) {
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}