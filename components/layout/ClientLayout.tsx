"use client";

import AuthWrapper from "@/components/auth/AuthWrapper";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthWrapper>{children}</AuthWrapper>;
}
