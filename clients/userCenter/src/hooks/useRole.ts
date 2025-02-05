import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { roleState } from '@/atoms/roleAtom';
import { getAllRoles, getAllRolesById, setUserRoles } from '@/services/role';
import { message } from 'antd';

export const useRole = () => {
  const [state, setState] = useAtom(roleState);

  const fetchAllRoles = useCallback(async () => {
    const res = await getAllRoles();
    setState((prev) => ({
      ...prev,
      roleData: res,
    }));
  }, [setState]);

  const fetchUserRoles = useCallback(async (userId: number) => {
    const res = await getAllRolesById(userId);
    return res || [];
  }, []);

  const assignRoles = useCallback(
    async (userId: number, bathRoles: { systemId: number }[]) => {
      setState((prev) => ({
        ...prev,
        roleTreeLoading: true,
      }));

      const res = await setUserRoles({ userId, bathRoles });
      message.success('分配成功');
      setState((prev) => ({
        ...prev,
        roleTreeShow: false,
      }));
      setState((prev) => ({
        ...prev,
        roleTreeLoading: false,
      }));
      return true;
    },
    [setState],
  );

  const showRoleTree = useCallback(
    async (userId: number) => {
      const roles = await fetchUserRoles(userId);
      setState((prev) => ({
        ...prev,
        roleTreeShow: true,
        roleTreeDefault: roles.map(
          (role) => `role_sys_${role.systemId}_${role.id}`,
        ),
      }));
    },
    [fetchUserRoles, setState],
  );

  const hideRoleTree = useCallback(() => {
    setState((prev) => ({
      ...prev,
      roleTreeShow: false,
    }));
  }, [setState]);

  return {
    ...state,
    fetchAllRoles,
    showRoleTree,
    hideRoleTree,
    assignRoles,
  };
};
