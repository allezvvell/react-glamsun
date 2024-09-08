import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFirebase } from '../context/FirebaseContext';
import { FaRegHeart } from 'react-icons/fa';
import { FaHeart } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import BeatLoader from 'react-spinners/BeatLoader';
import { useWishButton } from '../hooks/useWishButton';

export default function ProductDetail() {
  const { productId } = useParams();
  const {
    databaseContext: { database },
    authContext: { userData },
  } = useFirebase();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [modal, setModal] = useState(null);
  const [addCartLoading, setAddCartLoading] = useState(false);
  const { isHover, setIsHover, isInWish, handleWishButtonClick } =
    useWishButton(productId);

  const handleSubmit = async () => {
    //로그인 확인
    if (!userData) {
      setModal('로그인 해주세요.');
      return;
    }

    //옵션선택 확인
    if (product?.options && !selectedOption) {
      setShowWarning(true);
      return;
    }

    setAddCartLoading(true);
    try {
      await database.addToCart(product, selectedOption);
    } catch (error) {
      console.log('상품 추가시 에러 발생', error.message);
      setModal('상품 추가에 실패했습니다.\n다시 시도해주세요.');
    } finally {
      setAddCartLoading(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const newProduct = await database.readProduct(productId);
        setProduct(newProduct);
      } catch (error) {
        console.log('fetchProduct 에서 에러 발생', error.message);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>{error}</div>;
  return (
    <>
      {modal && <Modal onClick={() => setModal(null)}>{modal}</Modal>}
      <div className="mx-auto max-w-7xl flex flex-col px-5 pt-5 pb-10 md:flex-row xl:px-0">
        <div className="grow">
          <img
            src={product?.imgUrl}
            alt={product?.title}
            onError={(e) => (e.currentTarget.src = '/data/noImage.png')}
            className="max-w-full"
          />
        </div>
        <div className="flex flex-col w-full bg-white pt-5 lg:w-500 lg:pl-10 md:w-380 md:pl-5 md:pr-5 md:shrink-0">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-bold text-2xl">{product?.title}</h2>

            <button
              onClick={handleWishButtonClick}
              onMouseEnter={() => {
                setIsHover(true);
              }}
              onMouseLeave={() => {
                setIsHover(false);
              }}
              className="text-2xl text-red-400"
            >
              {!isInWish && !isHover && <FaRegHeart />}
              {(isInWish || isHover) && <FaHeart />}
            </button>
          </div>
          <span className="text-sm text-zinc-400 mb-8">
            {Object.entries(product?.category)
              .map(([key, _]) => key)
              .join(' / ')}
          </span>
          <span className="text-xl font-bold text-zinc-800 mb-5">
            {product?.price} 원
          </span>
          {showWarning && !selectedOption && (
            <span className="text-xs mb-1 text-red-400">
              옵션을 선택해주세요
            </span>
          )}
          <div className="flex gap-2 flex-wrap mb-10">
            {product?.options.split(',').map((option, index) => (
              <button
                className={`uppercase border border-zinc-300 text-sm px-5 py-3 hover:bg-black hover:text-white ${
                  selectedOption === option ? 'bg-black text-white' : 'bg-white'
                }`}
                key={index}
                onClick={() => {
                  setSelectedOption(option);
                  setShowWarning(false);
                }}
              >
                {option}
              </button>
            ))}
          </div>
          <p className="text-sm leading-6 mb-10">{product?.desc}</p>
          <button
            className="w-full font-bold h-11 bg-black text-white text-sm"
            onClick={handleSubmit}
          >
            {addCartLoading ? (
              <BeatLoader color="white" size={13} />
            ) : (
              '쇼핑백에 추가'
            )}
          </button>
        </div>
      </div>
    </>
  );
}
