import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function Search() {
  const { keyword } = useParams();
  useEffect(() => {}, [keyword]);
  return (
    <div className="px-5 py-4">
      <h2>{keyword}</h2>
      <ul className="grid-layout-default"></ul>
    </div>
  );
}
