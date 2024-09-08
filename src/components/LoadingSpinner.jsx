import React from 'react';
import BarLoader from 'react-spinners/BarLoader';

const cssStyle = {
  width: '150px',
  marginTop: '10px',
};

export default function LoadingSpinner() {
  return (
    <>
      <div className="fixed left-0 top-0 right-0 bottom-0 bg-white opacity-80 z-20" />
      <p className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 text-center -mt-5">
        <span className="font-bold text-sm">LOADING</span>
        <BarLoader size="" color="black" cssOverride={cssStyle} />
      </p>
    </>
  );
}
