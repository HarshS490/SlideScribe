import { User } from '@prisma/client';
import React from 'react'
import Avatar from './Avatar';

type Props = {
  user: User|null;
}

const Navbar = ({user}:Props) => {
  
  return (
    <nav className="fixed top-0 z-30 w-full  bg-white flex items-center justify-center border-b  p-4 border-b-gray-200 min-w-max">
      <div className='w-full sm:w-11/12 flex justify-between gap-2'>
        <div className='flex items-center'>
          <span className='text-2xl sm:text-3xl font-semibold'>SlideScribe</span>
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