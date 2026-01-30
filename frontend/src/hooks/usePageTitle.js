import { useLayoutEffect } from "react";

export default function usePageTitle(title) {
  useLayoutEffect(() => {
    document.title = title;
  }, [title]);
}