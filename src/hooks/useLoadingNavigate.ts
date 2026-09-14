import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook that shows a full-screen loading overlay for `delay` ms
 * before navigating to the target route.
 */
export const useLoadingNavigate = (delay = 900) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const navigateWithLoader = useCallback(
    (to: string) => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigate(to);
      }, delay);
    },
    [navigate, delay]
  );

  return { loading, navigateWithLoader };
};
