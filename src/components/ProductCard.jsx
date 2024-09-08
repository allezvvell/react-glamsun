import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaRegHeart } from 'react-icons/fa';
import { FaHeart } from 'react-icons/fa';
import { useWishButton } from '../hooks/useWishButton';

export default function ({ product }) {
  const { isHover, setIsHover, isInWish, handleWishButtonClick } =
    useWishButton(product.productId);

  return (
    <li className="bg-white text-sm text-zinc-700">
      <Link to={`/products/product/${product.productId}`}>
        <img
          src={product.imgUrl}
          alt={product.title}
          onError={(e) => (e.currentTarget.src = '/asset/noImage.png')}
          className="w-full"
        />
        <div className="mt-3 flex flex-col">
          <p className="flex items-center justify-center">
            <span className="w-full font-bold line-clamp-1 break-all">
              {product.title}
            </span>
            <button
              onClick={handleWishButtonClick}
              onMouseEnter={() => {
                setIsHover(true);
              }}
              onMouseLeave={() => {
                setIsHover(false);
              }}
              className="text-lg text-red-400"
            >
              {!isInWish && !isHover && <FaRegHeart />}
              {(isInWish || isHover) && <FaHeart />}
            </button>
          </p>
          <p className="line-clamp-1">
            <span className="font-semibold">{product.price}</span>원
          </p>
          <p className="text-xs text-zinc-500 mt-2">
            +
            <span className="text-red-400">
              {product.options.split(',').length}
            </span>{' '}
            Colors
          </p>
        </div>
      </Link>
    </li>
  );
}
