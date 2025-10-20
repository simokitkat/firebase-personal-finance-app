"use client";

import { auth } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface IProps {
  children: React.ReactNode;
  checkingFor: "protected" | "public";
}

const Auth: React.FC<IProps> = ({ children, checkingFor }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (checkingFor === "protected") {
        if (!user) {
          router.replace("/");
        }
      } else if (checkingFor === "public") {
        if (user) {
          router.replace("/overview");
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router, checkingFor]);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return children;
};

export default Auth;
