import { useState, useMemo } from 'react';
import { useUsersContext } from '../context/UsersContext';

export function useUsers() {
  const {
    users,
    createUser,
    updateUser,
    toggleUserStatus,
    getAssignedUsersCount,
    error,
    setError
  } = useUsersContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Filtrado reactivo por texto y por rol
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'ALL' || u.roleId === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  return {
    users,
    filteredUsers,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    createUser,
    updateUser,
    toggleUserStatus,
    getAssignedUsersCount,
    error,
    setError
  };
}
