"use client";

import Header from '@/components/dashboard/Header';
import React, { useEffect, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import Sidebar from '@/components/dashboard/Sidebar';
import Content from '@/components/dashboard/Profile/Content';
import { ProfileProvider } from '@/providers/ProfileProvider';
import { redirect } from 'next/navigation';

const Page = ({params}: {params: {id: string}}) => {
  const { user } = useAuth();
  const [isClient, setIsClient] = useState(false);

  const { id } = params;
  console.log(user?.id);


  useEffect(() => {
    if (user?.id) {
      redirect(`/dashboard/profile/${user?.id}`);
    }

    if (user?.id == null) {
      redirect(`/login`);
    }
  }, [user?.id]);

  if (!isClient || !id) {
    return null;  
  }

  return (
    <ProfileProvider userId={id as string}> 
      <div className="content | bg-[#DFDFDF] overflow-y-auto">
        <Content />
      </div>
    </ProfileProvider>
  );
};

export default Page;