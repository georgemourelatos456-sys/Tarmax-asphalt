import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

/**
 * Refreshes the Supabase session cookie on admin requests.
 *
 * Without this, an expired access token is never rotated and the dashboard
 * signs the directors out mid-session. This only refreshes — authorization is
 * still checked in the page and in every server action.
 */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });

  const supabase = createSupabaseServerClient({
    getAll: () => request.cookies.getAll(),
    setAll: (items) => {
      items.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
    },
  });

  if (supabase) await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
