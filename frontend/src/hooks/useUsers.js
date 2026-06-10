import { useState, useEffect, useCallback } from 'react';
import { getDistrictUsers } from '../services/users/user.service';

export function useUsers(district) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async (profession = '') => {
    if (!district) return;
    setLoading(true);
    try {
      const { data } = await getDistrictUsers(district, profession);
      setUsers(data.users || []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [district]);

  useEffect(() => { fetchUsers(''); }, [fetchUsers]);

  return { users, loading, fetchUsers };
}
