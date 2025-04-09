"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(!!auth);

    // Redirect logic
    if (auth && pathname === "/auth/login") {
      router.push("/verify-otp");
    } else if (!auth && pathname !== "/auth/login") {
      router.push("/auth/verify-otp");
    }
  }, [pathname, router]);

  // Show nothing while checking authentication
  if (isAuthenticated === null) {
    return null;
  }

  return <>{children}</>;
}
