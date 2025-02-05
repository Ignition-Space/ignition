import { useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { currentUserAtom } from '@/atoms/userAtom';

const publicPaths = ['/login', '/register'];

export const RouteGuard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useAtomValue(currentUserAtom);

  useEffect(() => {
    if (!currentUser && !publicPaths.includes(location.pathname)) {
      navigate('/login', { replace: true });
    }
  }, [currentUser, location.pathname, navigate]);

  return <Outlet />;
};
