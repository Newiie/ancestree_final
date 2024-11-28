"use client";

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useProfile } from '../../../providers/ProfileProvider';
import useAuth from '@/hooks/useAuth';
import { SquarePenIcon } from 'lucide-react';

const ProfileHeader = () => {
  const { user } = useAuth();
  const { userData, updateProfileImage, updateBackgroundImage } = useProfile();

  const [isProfileHover, setIsProfileHover] = useState<boolean>(false);
  const [isBackgroundHover, setIsBackgroundHover] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<string>(userData?.profilePicture || '');
  const [backgroundImage, setBackgroundImage] = useState<string>(userData?.backgroundPicture || '/images/bg-arcade-1.jpg');
  const [newProfileImage, setNewProfileImage] = useState<string | null>(null);
  const [newBackgroundImage, setNewBackgroundImage] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [isEditingBackground, setIsEditingBackground] = useState<boolean>(false);
  const [selectedProfileFile, setSelectedProfileFile] = useState<File | null>(null);
  const [selectedBackgroundFile, setSelectedBackgroundFile] = useState<File | null>(null);

  useEffect(() => {
    if (userData?.profilePicture) {
      setProfileImage(userData.profilePicture);
    } else {
      setProfileImage('');
    }

    if (userData?.backgroundPicture) {
      setBackgroundImage(userData.backgroundPicture);
    } else {
      setBackgroundImage('');
    }
  }, [userData]);

  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      
      setIsEditingProfile(true);
      setNewProfileImage(imageUrl);
      setSelectedProfileFile(file);
    }
  };

  const handleBackgroundImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);

      setIsEditingBackground(true);
      setNewBackgroundImage(imageUrl);
      setSelectedBackgroundFile(file);
    }
  };

  const handleConfirmProfileImage = () => {
    if (selectedProfileFile) {
      setProfileImage(newProfileImage || '');
      updateProfileImage(selectedProfileFile);
      setNewProfileImage(null);
      setIsEditingProfile(false);
    }
  };

  const handleConfirmBackgroundImage = () => {
    if (selectedBackgroundFile) {
      setBackgroundImage(newBackgroundImage || '');
      updateBackgroundImage(selectedBackgroundFile);
      setNewBackgroundImage(null);
      setIsEditingBackground(false);
    }
  };

  const handleCancelProfileImage = () => {
    setNewProfileImage(null);
    setIsEditingProfile(false);
  };

  const handleCancelBackgroundImage = () => {
    setNewBackgroundImage(null);
    setIsEditingBackground(false);
  };

  return (
    <div className='w-full relative bg-white p-4 rounded-lg'>
      <div className='absolute inset-0 h-[13rem] w-full'>
        <div
          className='relative w-full h-full'
          onMouseEnter={() => setIsBackgroundHover(true)}
          onMouseLeave={() => setIsBackgroundHover(false)}
        >
          <Image
            src={isEditingBackground ? newBackgroundImage || backgroundImage : backgroundImage}
            alt='Background'
            layout='fill'
            objectFit='cover'
            className='rounded-t-lg'
          />
          <div className='absolute inset-0 h-[13rem] w-full bg-black opacity-30 rounded-t-lg'></div>
          {isBackgroundHover && (
            <>
              <SquarePenIcon
                className='absolute top-2 right-2 text-black w-5 h-5 cursor-pointer'
                onClick={() => document.getElementById('backgroundFileInput')?.click()}
              />
              <input
                id="backgroundFileInput"
                type="file"
                accept="image/*"
                onChange={handleBackgroundImageChange}
                className="hidden"
              />
            </>
          )}
        </div>
        {isEditingBackground && (
          <div className='flex gap-2 mt-2 absolute -bottom-10 right-2'>
            <button onClick={handleConfirmBackgroundImage} className='bg-green-500 text-white px-2 py-1 rounded-lg'>
              Confirm
            </button>
            <button onClick={handleCancelBackgroundImage} className='bg-red-500 text-white px-2 py-1 rounded-lg'>
              Cancel
            </button>
          </div>
        )}
      </div>
      <div className='relative flex flex-col w-[max-content] pl-[2rem] pb-[1rem] mt-[8rem]'>
        <div
          onMouseEnter={() => setIsProfileHover(true)}
          onMouseLeave={() => setIsProfileHover(false)}
          className='relative w-24 h-24 rounded-full bg-[#F5F5F5]'
        >
          <Image
            src={isEditingProfile ? newProfileImage || profileImage : profileImage}
            alt='Profile'
            width={100}
            height={100}
            className='w-24 h-24 z-10 rounded-full border-4 border-white'
          />
          {isProfileHover && user?.id === userData?.userId && (
            <>
              <SquarePenIcon
                className='text-black z-20 w-5 h-5 cursor-pointer absolute bottom-0 right-0'
                onClick={() => document.getElementById('profileFileInput')?.click()}
              />
              <input
                id="profileFileInput"
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="hidden"
              />
            </>
          )}
        </div>
        {isEditingProfile && (
          <div className='flex gap-2 mt-2'>
            <button onClick={handleConfirmProfileImage} className='bg-green-500 text-white px-2 py-1 rounded-lg'>
              Confirm
            </button>
            <button onClick={handleCancelProfileImage} className='bg-red-500 text-white px-2 py-1 rounded-lg'>
              Cancel
            </button>
          </div>
        )}
        
        <h1 className='text-xl font-bold mt-2'>{userData?.generalInformation.firstname} {userData?.generalInformation.middlename} {userData?.generalInformation.lastname}</h1>
        <p className='text-gray-700'>ID: {userData?.userId}</p>
        <div className='flex mt-2'>
          <Link href={'/dashboard/FamilyTree'} className='bg-white hover:bg-btn-secondary text-primary border-1 border-green px-2 py-1 rounded-lg mr-2'>
            View Tree
          </Link>
          {user?.id !== userData?.userId && (
            <button className='bg-white hover:bg-btn-secondary cursor-pointer text-primary border-1 border-green px-2 py-1 rounded-lg'>
              Connect
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;