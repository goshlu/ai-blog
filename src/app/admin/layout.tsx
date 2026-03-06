import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  ADMIN_SESSION_COOKIE,
  isAdminAuthConfigured,
  verifyAdminSessionToken,
} from '@/lib/admin-auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isAdminAuthConfigured()) {
    redirect('/login?reason=admin_not_configured&next=/admin');
  }

  const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  if (!token || !verifyAdminSessionToken(token)) {
    redirect('/login?next=/admin');
  }

  return children;
}
