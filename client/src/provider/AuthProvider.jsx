import { createContext, useContext, useMemo, useReducer } from 'react';

const AuthContext = createContext();

const ACTIONS = {
  setToken: 'setToken',
  clearToken: 'clearToken',
};

const authReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.setToken:
      localStorage.setItem('token', action.payload);

      return { ...state, token: action.payload };

    case ACTIONS.clearToken:
      localStorage.removeItem('token');

      return { ...state, token: null };

    default:
      console.error(
        `You passed an action.type: ${action.type} which doesn't exist`
      );
  }
};

const initialData = {
  token: localStorage.getItem('token'),
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialData);

  const setToken = newToken => {
    dispatch({ type: ACTIONS.setToken, payload: newToken });
  };

  const clearToken = () => {
    dispatch({ type: ACTIONS.clearToken });
  };

  const contextValue = useMemo(
    () => ({
      ...state,
      setToken,
      clearToken,
    }),
    [state]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
