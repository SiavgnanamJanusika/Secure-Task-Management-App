import api from './api';

export const updateProfile = async (payload) => {
  const { data } = await api.put('/profile/update', payload);
  return data;
};
