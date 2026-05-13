import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      return redirectToLogin(request, "missing");
    }

    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      return redirectToLogin(request, "config");
    }

    const response = NextResponse.redirect(new URL("/library", request.url));
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      },
    );

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirectToLogin(request, "credentials");
    }

    return response;
  } catch {
    return redirectToLogin(request, "failed");
  }
}

function redirectToLogin(request: NextRequest, error: string) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("error", error);
  return NextResponse.redirect(loginUrl);
}
