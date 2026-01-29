import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ResetScroll() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // instantly jump to top
  }, [pathname]);

  return null;
}
