import store from '../store';

const getConfig = () => {
  const { isAuthenticated } = store.getState().auth;

  if (isAuthenticated) {
    const { token } = store.getState().auth;
    const config = {
      headers: { Authorization: `Token ${token}` }
    };
    return config;
  }
  return null;
};

export default getConfig;
