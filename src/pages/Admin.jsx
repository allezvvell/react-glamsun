import React, { useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useFirebase } from '../context/FirebaseContext';
import { uploadImage } from '../api/cloudinary';
import LoadingSpinner from '../components/LoadingSpinner';
import { useScrollLock } from '../hooks/useScrollLock';
import Modal from '../components/Modal';
import { productCategories } from '../constant';

export default function Admin() {
  const {
    authContext: { initialAuthLoading, isAdminUser },
    databaseContext: { database },
  } = useFirebase();
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);
  const [productImageUrl, setProductImageUrl] = useState(null);
  const [isInvalid, setIsInvalid] = useState({});
  const { setScrollLock } = useScrollLock();
  const [productData, setProductData] = useState(initialProductData);
  const fileInputRef = useRef();

  const handleChange = (e) => {
    if (e.target.files.length !== 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setProductImageUrl(reader.result.toString());
      };
    } else {
      setProductImageUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //유효성 검사
    const newIsInvalid = {};
    if (!productImageUrl) {
      newIsInvalid['image'] = true;
    } else {
      newIsInvalid['image'] = false;
    }
    for (const key in productData) {
      const value = productData[key];
      if (typeof value === 'object') {
        const valueArr = Object.values(value);
        newIsInvalid[key] = valueArr.includes(true) ? false : true;
      } else {
        if (!value || (typeof value === 'text' && value.trim().length === 0)) {
          newIsInvalid[key] = true;
        } else {
          newIsInvalid[key] = false;
        }
      }
    }
    setIsInvalid(newIsInvalid);
    if (Object.values(newIsInvalid).includes(true)) return;

    //addProduct에 전달할 객체 정리
    let filteredProductData = { ...productData };
    for (const key in filteredProductData) {
      if (typeof filteredProductData[key] === 'object') {
        const obj = Object.fromEntries(
          Object.entries(filteredProductData[key]).filter(([_, value]) => value)
        );
        filteredProductData[key] = obj;
      }
    }

    //업로드 시작
    setLoading(true);
    setScrollLock(true);
    try {
      const imageUrl = await uploadImage(productImageUrl);
      await database.writeProduct(imageUrl, filteredProductData);
      setModal('상품을 업로드 했습니다.');
      setProductData(initialProductData);
      fileInputRef.current.value = '';
      setProductImageUrl(null);
    } catch (error) {
      console.log('상품 업로드 에러', error);
      setModal(`상품 업로드에 실패했습니다. ${error.message}`);
    } finally {
      setLoading(false);
      setScrollLock(false);
    }
  };

  if (initialAuthLoading) return <LoadingSpinner />;

  return (
    <>
      {!isAdminUser && <Navigate to="/" />}
      {loading && <LoadingSpinner />}
      {modal && (
        <Modal
          onClick={() => {
            setModal(null);
          }}
        >
          {modal}
        </Modal>
      )}
      <div className="flex flex-col items-center justify-center px-7 pt-8 pb-10">
        <h2 className="text-2xl font-semibold mb-8 text-black">상품 등록</h2>
        {productImageUrl && (
          <img
            src={productImageUrl}
            alt="선택된 파일"
            className="max-w-2xl mb-10"
          />
        )}
        <form
          className="flex flex-col w-full max-w-7xl items-center"
          onSubmit={handleSubmit}
        >
          {inputList.map((item, index) => {
            if (item.type === 'file') {
              return (
                <div key={index} className="w-full flex flex-col">
                  <input
                    type="file"
                    accept="image/*"
                    className={`input ${
                      isInvalid[item.name] ? 'border-red-400' : ''
                    }`}
                    ref={fileInputRef}
                    onChange={handleChange}
                  />
                  {isInvalid[item.name] && (
                    <span className="mb-3 text-xs text-red-400">
                      사진을 등록해주세요
                    </span>
                  )}
                </div>
              );
            }
            if (item.type === 'checkbox') {
              return (
                <div key={index} className="w-full flex flex-col">
                  <div>
                    {item.list.map((el, i) => (
                      <label
                        key={i}
                        className="text-sm text-zinc-600 mr-2 py-1 break-keep"
                      >
                        {el}
                        <input
                          type="checkbox"
                          name={el}
                          checked={productData[item.name][el]}
                          onChange={(e) =>
                            setProductData((prev) => ({
                              ...prev,
                              [item.name]: {
                                ...prev[item.name],
                                [e.target.name]: e.target.checked,
                              },
                            }))
                          }
                        />
                      </label>
                    ))}
                  </div>
                  {isInvalid[item.name] && (
                    <span className="mb-3 text-xs text-red-400">
                      카테고리를 1개 이상 선택해주세요
                    </span>
                  )}
                </div>
              );
            }
            return (
              <div key={index} className="w-full flex flex-col">
                <input
                  type="text"
                  placeholder={item.placeholder}
                  name={item.name}
                  className={`input ${
                    isInvalid[item.name] ? 'border-red-400' : ''
                  }`}
                  value={productData[`${item.name}`]}
                  onChange={(e) => {
                    const name = e.target.name;
                    const value = e.target.value;
                    setProductData((prev) => ({ ...prev, [name]: value }));
                  }}
                />
                {isInvalid[item.name] && (
                  <span className="mb-3 text-xs text-red-400">
                    빈칸을 입력해주세요
                  </span>
                )}
              </div>
            );
          })}
          <button
            type="submit"
            className="bg-black text-white w-11/12 p-4 mt-8"
          >
            상품 등록
          </button>
        </form>
      </div>
    </>
  );
}

const inputList = [
  { type: 'file', name: 'image' },
  { placeholder: '제품명', name: 'title' },
  { placeholder: '가격', name: 'price' },
  { placeholder: '옵션(콤마(,)로 구분)', name: 'options' },
  { placeholder: '제품설명', name: 'desc' },
  {
    type: 'checkbox',
    name: 'category',
    list: Object.keys(productCategories),
  },
];

const initialProductData = {
  title: '',
  price: '',
  desc: '',
  options: '',
  category: inputList
    .find((input) => input.name === 'category')
    .list.reduce((acc, prev) => {
      acc[prev] = false;
      return acc;
    }, {}),
  test: { a: true, b: false },
};
