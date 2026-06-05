"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { setSessionCookie, clearSessionCookie } from "@/lib/auth";

export async function signIn(formData: FormData) {
  // The AdminUser.email column doubles as the login username (we never
  // renamed the column). Usernames are case-insensitive.
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  if (!username || !password) {
    redirect(`/admin/login?error=missing&next=${encodeURIComponent(next)}`);
  }

  const user = await prisma.adminUser.findUnique({ where: { email: username } });
  if (!user || !user.active) {
    redirect(`/admin/login?error=invalid&next=${encodeURIComponent(next)}`);
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    redirect(`/admin/login?error=invalid&next=${encodeURIComponent(next)}`);
  }

  await prisma.adminUser.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });
  await setSessionCookie(user.id);
  redirect(next);
}

export async function signOut() {
  await clearSessionCookie();
  redirect("/");
}
