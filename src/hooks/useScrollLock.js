import { useEffect, useState } from 'react';

export const useScrollLock = () => {
  const [scrollLock, setScrollLock] = useState(false);
  useEffect(() => {
    if (scrollLock) {
      document.body.classList.add('scroll-lock');
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const y = document.body.style.top;
      document.body.classList.remove('scroll-lock');
      document.body.style.removeProperty('top');
      window.scrollTo(0, parseInt(y) * -1);
    }
  }, [scrollLock]);
  return { setScrollLock };
};
