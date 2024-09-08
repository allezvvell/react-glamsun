import React from 'react';

export default function SearchBanner({ isOn }) {
  return (
    <>
      <div
        className={`fixed left-0 right-0 top-0 bottom-0 z-10 bg-black tran-opacity ${
          isOn ? 'visible opacity-50' : 'invisible opacity-0'
        }`}
      />
    </>
  );
}
