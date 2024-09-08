import React from 'react';

export default function Modal({ children, onClick }) {
  const formatText = (text) => {
    const textArr = text.split('\n');
    const newTextArr = textArr.map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index !== textArr.length - 1 && <br />}
      </React.Fragment>
    ));
    return newTextArr;
  };
  return (
    <>
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white border border-zinc-300 flex flex-col p-5 max-w-xs min-w-72 items-center justify-center text-sm">
        <p className="text-sm text-center">{formatText(children)}</p>
        <button
          onClick={onClick}
          className="bg-black text-white py-1 w-40 mt-3"
        >
          닫기
        </button>
      </div>
      <div className="fixed left-0 top-0 right-0 bottom-0 z-40 bg-black opacity-70" />
    </>
  );
}
