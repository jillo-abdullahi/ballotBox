import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

export const ScrollToTop = () => {
  const router = useRouter();

  useEffect(() => {
    const unsub = router.subscribe("onResolved", () => {
      window.scrollTo(0, 0);
    });
    return unsub;
  }, [router]);

  return null;
};
