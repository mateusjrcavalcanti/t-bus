import { redirect } from "next/navigation";

import { auth } from "@unibus/auth";

export default async function DashboardPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session) return <>{children}</>;
  else redirect(`/api/auth/signin`);
}
