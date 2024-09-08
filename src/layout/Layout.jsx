import React from 'react';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';
import { useFirebase } from '../context/FirebaseContext';

export default function Layout() {
  const { isAdminUser } = useFirebase().authContext;
  return (
    <>
      <Header />
      <main className={`${isAdminUser ? 'pt-26' : 'pt-16'} pb-10`}>
        <Outlet />
      </main>
    </>
  );
}
