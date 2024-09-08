import { createContext, useContext, useEffect, useState } from 'react';
import { firebaseApp } from '../api/firebase';
import { Authentication } from '../api/authentication';
import { Database } from '../api/database';
import { localWishName } from '../constant';

const ADMIN_UID = 'gwhKByww2fZF5zBe27FqWZcwKED3';

const authentication = new Authentication(firebaseApp);

const FirebaseContext = createContext();

export const FirebaseProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [userHistory, setUserHistory] = useState(null);
  const [guestWish, setGuestWish] = useState(() => getLocalWish());
  const [initialAuthLoading, setInitialAuthLoading] = useState(true);
  const isAdminUser = userData?.uid === ADMIN_UID;

  const database = new Database(firebaseApp, userData, userHistory);

  const toggleGuestWish = (productId) => {
    let newWish = [...(guestWish || [])];
    if (!newWish.includes(productId)) {
      newWish.push(productId);
    } else {
      newWish = newWish.filter((id) => id !== productId);
    }
    setGuestWish(newWish);
  };

  const authContext = {
    authentication,
    userData,
    isAdminUser,
    initialAuthLoading,
  };
  const databaseContext = {
    database,
    userHistory,
  };

  useEffect(() => {
    localStorage.setItem(localWishName, JSON.stringify(guestWish));
  }, [guestWish]);

  useEffect(() => {
    // 로그인시 guestWish를 계정으로 업데이트
    const handleLogin = async () => {
      try {
        await database.sendGuestWish(guestWish, setGuestWish);
      } catch (error) {
        console.log('guestWish sending 에러', error.message);
      }
    };

    handleLogin();
  }, [userHistory]);

  useEffect(() => {
    // current user 관찰자
    const unsubscribeUsers = database.addUserListener(setUserHistory);

    return () => unsubscribeUsers();
  }, [userData]);

  useEffect(() => {
    //auth 관찰자
    const unsubscribeAuth = authentication.addAuthListener(
      setUserData,
      setInitialAuthLoading
    );

    return () => {
      unsubscribeAuth();
    };
  }, []);

  return (
    <FirebaseContext.Provider
      value={{
        authContext,
        databaseContext,
        guestWish,
        toggleGuestWish,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);

const getLocalWish = () => {
  const localWish = JSON.parse(localStorage.getItem('glamsun_wish'));
  return localWish;
};
