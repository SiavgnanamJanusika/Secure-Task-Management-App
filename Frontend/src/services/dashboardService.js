import api from './api';

export const getUserSummary = async () => (await api.get('/dashboard/user-summary')).data;

export const adminListUsers = async () => (await api.get('/admin/users')).data;

export const adminTasksHistory = async () => (await api.get('/admin/tasks-history')).data;

export const adminCreateTaskForUser = async (userId, payload) =>
  (await api.post(`/admin/tasks/${userId}`, payload)).data;
