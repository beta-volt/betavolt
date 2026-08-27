'use server';

import { createClient } from '@supabase/supabase-js';
import type { Role } from '@/lib/admin-roles';
export type { Role } from '@/lib/admin-roles';

/* ─── Admin Supabase client (service role) ────────────── */
function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xdkfmduiftxisifetfmu.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhka2ZtZHVpZnR4aXNpZmV0Zm11Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODY5MDYyNywiZXhwIjoyMDk0MjY2NjI3fQ.9uiexLgZd-3jvUl1XOi-KxD80Oonw1lTqsRY2kA99y0';
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

/* ─── Password generator ──────────────────────────────── */
function generatePassword(length = 12): string {
  const chars = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$';
  let out = '';
  for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

/* ─── Types ───────────────────────────────────────────── */
export interface AdminUser {
  id:              string;
  email:           string;
  created_at:      string;
  last_sign_in_at: string | null;
  role:            Role | null;
}

/* ─── Actions ─────────────────────────────────────────── */
export async function fetchAdmins(): Promise<AdminUser[]> {
  const admin = supabaseAdmin();
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 200 });
  if (error) throw new Error(error.message);
  return (data.users ?? []).map(u => ({
    id:              u.id,
    email:           u.email ?? '',
    created_at:      u.created_at,
    last_sign_in_at: u.last_sign_in_at ?? null,
    role:            (u.user_metadata?.role as Role) ?? null,
  }));
}

export async function createAdmin(email: string, role: Role): Promise<{ password: string }> {
  const password = generatePassword(12);
  const admin = supabaseAdmin();
  const { error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role },
  });
  if (error) throw new Error(error.message);
  return { password };
}

export async function updateAdminRole(userId: string, role: Role): Promise<void> {
  const admin = supabaseAdmin();
  const { error } = await admin.auth.admin.updateUserById(userId, {
    user_metadata: { role },
  });
  if (error) throw new Error(error.message);
}

export async function resetAdminPassword(userId: string): Promise<{ password: string }> {
  const password = generatePassword(12);
  const admin = supabaseAdmin();
  const { error } = await admin.auth.admin.updateUserById(userId, { password });
  if (error) throw new Error(error.message);
  return { password };
}

export async function deleteAdmin(userId: string): Promise<void> {
  const admin = supabaseAdmin();
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) throw new Error(error.message);
}
