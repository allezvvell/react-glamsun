import { useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';

export const useWishButton = (productId) => {
  const {
    authContext: { userData },
    databaseContext: { database, userHistory },
    guestWish,
    toggleGuestWish,
  } = useFirebase();

  const [isHover, setIsHover] = useState(false);
  const wishList = userData ? userHistory?.wish || [] : guestWish || [];
  const isInWish = wishList.includes(productId);

  const handleWishButtonClick = (e) => {
    e.preventDefault();
    if (userData) {
      database.toggleWish(productId);
    } else {
      toggleGuestWish(productId);
    }
  };

  return { isHover, setIsHover, isInWish, handleWishButtonClick };
};
