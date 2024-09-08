import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../context/FirebaseContext';
import { MdOutlineDriveFolderUpload } from 'react-icons/md';
import { BsCart4 } from 'react-icons/bs';
import { IoIosSearch } from 'react-icons/io';
import HeaderSearch from './HeaderSearch';
import SearchBanner from './SearchBanner';
import Modal from './Modal';

export default function Header() {
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);
  const [isSearchOn, setIsSearchOn] = useState(false);
  const [modal, setModal] = useState(null);
  const imgReplacementRef = useRef();
  const {
    authContext: { authentication, userData, isAdminUser },
    databaseContext: { userHistory },
  } = useFirebase();

  const handleCartBtnClick = () => {
    if (!userData) {
      setModal('로그인 해주세요.');
      return;
    }
    navigate('/cart');
  };

  const onImageError = (e) => {
    e.target.style.display = 'none';
    imgReplacementRef.current.style.display = 'flex';
  };

  return (
    <>
      <header className="bg-white fixed left-0 top-0 w-full z-30">
        {isAdminUser && (
          <p className="flex justify-center items-center text-sm bg-black text-white h-10 gap-2">
            관리자 모드로 로그인 중입니다
            <button
              onClick={() => navigate('/admin')}
              className="flex justify-between items-center px-2 py-1 bg-white text-black rounded-sm"
            >
              <MdOutlineDriveFolderUpload className="text-lg mr-1" />
              상품 추가
            </button>
          </p>
        )}
        <div className="flex px-5 justify-between items-center h-16">
          <h1 onClick={() => navigate('/')} className="flex-shrink-0">
            <img src="/asset/logo.png" alt="글램선" className="h-4 sm:h-6" />
          </h1>
          <div className="flex justify-between items-center gap-x-3 flex-shrink-0">
            {/* 헤더 검색폼 */}
            <HeaderSearch isOn={isSearchOn} setIsOn={setIsSearchOn} />
            {/* 헤더 검색폼 end */}
            <button
              className="text-2xl mt-1 xl:hidden"
              onClick={() => setIsSearchOn(true)}
            >
              <IoIosSearch />
            </button>
            <button
              className="flex flex-col items-center"
              onClick={handleCartBtnClick}
            >
              <span className="text-10 font-bold">
                {!userHistory || !userHistory.cart
                  ? 0
                  : countTotalQuantity(userHistory.cart)}
              </span>
              <BsCart4 className="text-2xl -mt-2" />
            </button>
            {userData ? (
              <div className="relative">
                <div onClick={() => setShowLogout((prev) => !prev)}>
                  <img
                    src={userData?.photoURL}
                    alt={userData?.displayName}
                    className="rounded-full w-9 h-9 cursor-pointer"
                    onError={(e) => onImageError(e)}
                  />
                  <span
                    ref={imgReplacementRef}
                    className="rounded-full w-9 h-9 cursor-pointer bg-green-700 text-white justify-center items-center hidden"
                  >
                    {userData?.displayName.slice(0, 1)}
                  </span>
                </div>
                <div
                  className={` ${
                    showLogout ? '' : 'hidden'
                  } absolute right-0 top-full mt-1 w-60 bg-orange-400 text-sm flex flex-col p-3 gap-y-2`}
                >
                  <p className="flex gap-x-1 flex-nowrap break-all items-center">
                    <span>{userData?.displayName}</span>
                    <span>님</span>
                  </p>
                  <button
                    onClick={() => {
                      setShowLogout(false);
                      authentication.handleSignOut();
                    }}
                    className="bg-black text-white py-1 rounded-md"
                  >
                    로그아웃
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={authentication.handleGoogleSignIn}
                className="text-sm"
              >
                로그인
              </button>
            )}
          </div>
        </div>
      </header>
      {modal && <Modal onClick={() => setModal(null)}>{modal}</Modal>}
      <SearchBanner isOn={isSearchOn} />
    </>
  );
}

const countTotalQuantity = (cartObj) => {
  let total = 0;
  for (const key in cartObj) {
    total += parseInt(cartObj[key].qty);
  }
  return total;
};
