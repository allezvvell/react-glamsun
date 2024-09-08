import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useFirebase } from '../../context/FirebaseContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import CartItemCard from './components/CartItemCard';
import Modal from '../../components/Modal';

export default function Cart() {
  const {
    authContext: { initialAuthLoading, userData },
    databaseContext: { userHistory },
  } = useFirebase();
  const [modal, setModal] = useState(null);
  const totalPrice = Object.values(userHistory?.cart || {}).reduce(
    (acc, { price, qty }) => acc + price * qty,
    0
  );
  const shippingFee = totalPrice === 0 || totalPrice >= 300000 ? 0 : 4000;

  if (initialAuthLoading) return <LoadingSpinner />;

  return (
    <>
      {!userData && <Navigate to="/" />}
      {modal && <Modal onClick={() => setModal(null)}>{modal}</Modal>}
      <div className="px-5">
        <div className="pt-6 md:pt-10 flex flex-col max-w-7xl mx-auto md:flex-row md:gap-10">
          {/**카트 좌측 */}
          <div className="w-full mb-10 md:mb-0">
            <h2 className="text-lg font-bold mb-4">쇼핑백</h2>
            <div className="flex justify-between items-center text-sm font-bold pb-4 border-b">
              <span>상품</span>
              <span>가격</span>
            </div>
            {!userHistory?.cart && <p>쇼핑백에 상품이 없습니다.</p>}
            {userHistory?.cart && (
              <ul>
                {objectToArray(userHistory?.cart).map((item, index) => (
                  <CartItemCard
                    key={item.productId + index}
                    item={item}
                    setModal={setModal}
                  />
                ))}
              </ul>
            )}
          </div>
          {/**카트 우측 */}
          <div className="md:w-380 lg:shrink-0">
            <h2 className="text-lg font-bold border-b pb-4 md:pb-16">
              주문상세
            </h2>
            <ul className="text-sm md:text-base">
              <li className="flex justify-between items-center pt-4 mb-1">
                <span>소계</span>
                <span>{totalPrice}</span>
              </li>
              <li className="flex justify-between items-center pb-4 border-b">
                <span>배송비</span>
                <span>{shippingFee === 0 ? '무료' : shippingFee}</span>
              </li>
              <li className="flex justify-between items-center pt-5 mb-10">
                <span>합계</span>
                <span>{totalPrice + shippingFee}</span>
              </li>
            </ul>
            <button className="w-full bg-black text-white h-10 text-sm mb-3">
              결제하기
            </button>
            <p className="text-sm text-zinc-500 underline text-center mb-10">
              300000원 이상 구매시 배송비 무료
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

const objectToArray = (obj) => {
  const arr = Object.values(obj);
  //updatedAt 내림차순 정렬
  arr.sort((a, b) => b['updatedAt'].localeCompare(a['updatedAt']));
  return arr;
};
