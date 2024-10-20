import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import React from 'react'
import Avatar from './Avatar';

type Props = {
  user: User|null;
}

const Navbar = ({user}:Props) => {
  
  return (
    <nav className="flex py-4 px-4 items-center border border-b-gray-200 min-w-max">
      <div className='sm:w-11/12 w-full mx-auto flex justify-between gap-2'>
        <div className='flex items-center'>
          <span className='text-xl sm:text-3xl font-semibold'>SlideScribe</span>
        </div>
        <ul className='flex list-none items-center'>
          <li>
            <Avatar user={user}></Avatar>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar