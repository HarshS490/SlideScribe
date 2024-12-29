"use client";
import React from 'react'
import { AvatarType } from '@/app/types/user.types';
import { UserMenuBar } from './UserMenuBar';
import { signOut } from 'next-auth/react';

type Props = {
  user: AvatarType|null;
}

const Navbar = ({user}:Props) => {
  const logout=()=>{
    signOut();
  }

  const onProfileClick= ()=>{

  }
  return (
    <nav className="fixed top-0 z-30 w-full  bg-white flex items-center justify-center border-b  p-4 border-b-gray-200 min-w-max">
      <div className='w-full sm:w-11/12 flex justify-between gap-2'>
        <div className='flex items-center'>
          <span className='text-2xl sm:text-3xl font-semibold'>SlideScribe</span>
        </div>
        <ul className='flex list-none items-center'>
          <li>
            <UserMenuBar onLogout={logout} onProfileClick={onProfileClick} user={user}/>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar