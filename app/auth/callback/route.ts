import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { syncUserFromAuth } from "@/services/users";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  try {
    await syncUserFromAuth(user);
  } catch {
    return NextResponse.redirect(`${origin}/login?error=sync`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
