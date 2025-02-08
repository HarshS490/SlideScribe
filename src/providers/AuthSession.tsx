"use client";

import { SessionProvider } from 'next-auth/react';
import React from 'react'

interface AuthContextProps{
  children:React.ReactNode;
}

function AuthSessionProvider({children}: AuthContextProps) {
  return (
    <SessionProvider>{children}</SessionProvider>
  )
}

export default AuthSessionProvider;