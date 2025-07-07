/** @jest-environment jsdom */

import { useUserStore, User } from './useUserStore';

const alice: User = {
  id: '1',
  name: 'Alice',
  favorites: [],
};

// Helper to reset store between tests
const resetStore = () => {
  useUserStore.setState({ user: null });
};

describe('useUserStore', () => {
  beforeEach(resetStore);

  it('logs in user', () => {
    useUserStore.getState().login(alice);
    expect(useUserStore.getState().user?.name).toBe('Alice');
  });

  it('toggles favorites', () => {
    useUserStore.getState().login({ ...alice });
    useUserStore.getState().toggleFavorite('job-1');
    expect(useUserStore.getState().user?.favorites).toContain('job-1');
    useUserStore.getState().toggleFavorite('job-1');
    expect(useUserStore.getState().user?.favorites).not.toContain('job-1');
  });

  it('logs out user', () => {
    useUserStore.getState().login(alice);
    useUserStore.getState().logout();
    expect(useUserStore.getState().user).toBeNull();
  });
}); 