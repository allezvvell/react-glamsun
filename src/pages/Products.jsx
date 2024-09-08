import React, { useEffect } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useParams, Link } from 'react-router-dom';
import { productCategories } from '../constant';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';

const navList = [['전체보기', 'all'], ...Object.entries(productCategories)];

export default function Products() {
  const { categoryName } = useParams();
  const category = !categoryName
    ? null
    : findKeyByValue(productCategories, categoryName);
  const {
    databaseContext: { database },
  } = useFirebase();

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', category],
    queryFn: () => database.readProductsByCategory(category),
    staleTime: 1000 * 60 * 60,
  });

  useEffect(() => {
    const unsubscribe = database.addProductsListener(category, queryClient);
    return () => unsubscribe();
    // eslint-disable-next-line
  }, [categoryName]);

  if (isLoading) return <LoadingSpinner />;

  if (error) return <div>{error.message}</div>;

  return (
    <div className="px-5 py-4">
      <div className="flex justify-center">
        <Swiper className="mb-6" slidesPerView="auto">
          {navList.map(([key, value], i) => (
            <SwiperSlide key={i} className=" mx-1 my-1 w-16 sm:mx-2 sm:w-20">
              <Link
                to={value === 'all' ? '/' : `/products/category/${value}`}
                className="flex flex-col items-center gap-1"
              >
                <span
                  className={`transition-all rounded-full p-1 border hover:border-black ${
                    !categoryName && value === 'all'
                      ? 'border-black'
                      : categoryName === value
                      ? 'border-black'
                      : ''
                  }`}
                >
                  <img
                    src={`/asset/category/category_${value}.avif`}
                    alt={key}
                    className="rounded-full w-full "
                  />
                </span>
                <span className="text-10 sm:text-xs">{key}</span>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <ul className="grid-layout-default">
        {data?.map((product) => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </ul>
    </div>
  );
}

const findKeyByValue = (obj, value) => {
  return Object.entries(obj).find(([_, val]) => val === value)[0];
};
