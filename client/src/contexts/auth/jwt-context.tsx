import { createContext, useCallback, useContext, useEffect, useReducer, } from 'react';
import PropTypes from 'prop-types';
import { Issuer } from '../../utils/auth';
import { quotingsystem } from '../../api/quotingsystem'
import { Buffer } from 'buffer';
import { jwtDecode } from "jwt-decode";

let quotingSystemClient = new quotingsystem(
  {
    BASE: 'http://localhost:3000'
  }
)

export const STORAGE_KEY = 'accessToken';

export type Role = 'ADMIN' | 'SELLER';

var ActionType: Record<string, string> = {};
(function (ActionType) {
  ActionType['INITIALIZE'] = 'INITIALIZE';
  ActionType['SIGN_IN'] = 'SIGN_IN';
  ActionType['SIGN_UP'] = 'SIGN_UP';
  ActionType['SIGN_OUT'] = 'SIGN_OUT';
})(ActionType || (ActionType = {}));

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const handlers: Record<string, any> = {
  INITIALIZE: (state: any, action: any) => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  SIGN_IN: (state: any, action: any) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  SIGN_UP: (state: any, action: any) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  SIGN_OUT: (state: any) => ({
    ...state,
    isAuthenticated: false,
    user: null
  })
};

const reducer = (state: any, action: any) => (handlers[action.type]
  ? handlers[action.type](state, action)
  : state);

export const AuthContext = createContext({
  ...initialState,
  issuer: Issuer.JWT,
  signIn: (token: any, user: any) => Promise.resolve(),
  signUp: () => Promise.resolve(),
  signOut: () => Promise.resolve()
});

async function currentAuthenticatedUser() {
  try {

    const accessToken = globalThis.localStorage.getItem(STORAGE_KEY);
    if (accessToken) {
      const user = await jwtDecode(accessToken)
      console.log(user)
      // console.log(`The username: ${username}`);
      // console.log(`The userId: ${userId}`);
      // console.log(`The signInDetails: ${signInDetails}`);
    }
  } catch (err) {
    console.log(err);
  }
}

export const AuthProvider = (props: any) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {

    currentAuthenticatedUser()

    try {
      const accessToken = globalThis.localStorage.getItem(STORAGE_KEY);

      if (accessToken) {
        const user = await jwtDecode(accessToken)

        dispatch({
          type: ActionType.INITIALIZE,
          payload: {
            isAuthenticated: true,
            user
          }
        });
      } else {
        dispatch({
          type: ActionType.INITIALIZE,
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    } catch (err) {
      console.error(err);
      dispatch({
        type: ActionType.INITIALIZE,
        payload: {
          isAuthenticated: false,
          user: null
        }
      });
    }
  }, [dispatch]);

  useEffect(() => {
    initialize();
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

  const signIn = useCallback(async (email: any, password: any) => {
    console.log(email,password)
    const { data: { accessToken } } = await quotingSystemClient.auth.signin(`Basic ${Buffer.from(`${email}:${password}`, "utf8").toString("base64")}`);
    const user = await jwtDecode(accessToken)

    localStorage.setItem(STORAGE_KEY, accessToken);

    dispatch({
      type: ActionType.SIGN_IN,
      payload: {
        user
      }
    });
  }, [dispatch]);

  // const signUp = useCallback(async (email, name, password) => {
  //   const { accessToken } = await authApi.signUp({ email, name, password });
  //   const user = await authApi.me({ accessToken });

  //   localStorage.setItem(STORAGE_KEY, accessToken);

  //   dispatch({
  //     type: ActionType.SIGN_UP,
  //     payload: {
  //       user
  //     }
  //   });
  // }, [dispatch]);

  const signOut = useCallback(async () => {
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: ActionType.SIGN_OUT });
  }, [dispatch]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        issuer: Issuer.JWT,
        signIn,
        // signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const AuthConsumer = AuthContext.Consumer;
