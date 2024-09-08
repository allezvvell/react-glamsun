import React, { useState } from 'react';
import { IoCloseCircle } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

export default function HeaderSearch({ isOn, setIsOn }) {
  const [txt, setTxt] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (txt.trim().length === 0) return;
    navigate(`/products/search/${txt}`);
    setIsOn(false);
    setTxt('');
  };
  return (
    <>
      <div
        className={`bg-white flex justify-center items-center ${
          isOn
            ? 'absolute w-full left-0 top-0 h-full'
            : 'relative invisible w-0 xl:visible xl:w-auto'
        }`}
      >
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={txt}
            onChange={(e) => {
              setTxt(e.target.value);
            }}
            onFocus={() => setIsOn(true)}
            placeholder="검색어를 입력하세요"
            className={`border border-black rounded-3xl text-sm px-3 h-9 placeholder:text-xs tran-width ${
              isOn ? 'w-500' : 'w-36'
            }`}
          />
        </form>
      </div>
      <button
        className={`absolute right-5 top-1/2 -translate-y-1/2 tran-opacity text-3xl ${
          isOn ? 'visible opacity-100' : 'invibisible opacity-0'
        }`}
        onClick={() => {
          setIsOn(false);
        }}
      >
        <IoCloseCircle />
      </button>
    </>
  );
}
