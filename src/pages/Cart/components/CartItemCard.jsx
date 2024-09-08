import React from 'react';
import { Link } from 'react-router-dom';
import { FaRegTrashAlt } from 'react-icons/fa';
import { useFirebase } from '../../../context/FirebaseContext';

export default function CartItemCard({ item, setModal }) {
  const {
    databaseContext: { database },
  } = useFirebase();
  const { imgUrl, option, price, productId, qty, title } = item;
  const itemKey = option ? productId + option : productId;

  const handleCartAction = async (action) => {
    try {
      await action();
    } catch (error) {
      console.log('쇼핑백 변경 에러', error.message);
      setModal('쇼핑백 변경에 실패했습니다.\n다시 시도해주세요.');
    }
  };
  const handleAddClick = async () =>
    handleCartAction(() => database.addToCart(item, option));

  const handleSubtractClick = async () =>
    handleCartAction(() => database.subtractFromCart(itemKey));

  const handleRemoveClick = async () =>
    handleCartAction(() => database.removeFromCart(itemKey));

  return (
    <li className="flex bg-white text-sm py-4 border-b">
      <Link
        to={`/products/product/${productId}`}
        className="w-20 mr-4 sm:w-36 lg:w-44"
      >
        <img src={imgUrl} alt={title} className="w-full" />
      </Link>
      <div className="flex flex-col items-start justify-between flex-grow">
        <p className="flex flex-col">
          <span className="font-bold">{title}</span>
          <span className="text-zinc-400 mb-2 uppercase">color : {option}</span>
          <span className="text-base">{price}원</span>
        </p>
        <div className="flex justify-center items-center border border-black text-base">
          <button
            onClick={handleSubtractClick}
            className="w-7 h-7 text-3xl leading-none flex justify-center"
          >
            <span className="-mt-0.5">-</span>
          </button>
          <span className="w-7 h-7 text-center -mb-1">{qty}</span>
          <button
            onClick={handleAddClick}
            className="w-7 h-7 text-xl leading-none flex justify-center items-center"
          >
            +
          </button>
        </div>
      </div>
      <div className="flex flex-col items-end justify-between">
        <span className="text-base">{price * qty}원</span>
        <button className="flex items-center" onClick={handleRemoveClick}>
          <FaRegTrashAlt />
          삭제
        </button>
      </div>
    </li>
  );
}
