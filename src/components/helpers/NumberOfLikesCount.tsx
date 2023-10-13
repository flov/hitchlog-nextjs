import { Trip } from '@/types'
import { Tooltip } from 'flowbite-react'
import React, { FC } from 'react'
import { FaHeart } from 'react-icons/fa'

interface NumberOfLikesCountProps { trip: Trip };

export const NumberOfLikesCount: FC<NumberOfLikesCountProps> = ({ trip }) => {
  if (trip.likes_count === 0) return null;

  return (
    <Tooltip content={`Received ${trip.likes_count} likes`}>
      <div className='relative gap-2 flex items-center'>
        {trip.likes_count}
        <FaHeart className='text-red-500' />
      </div>
    </Tooltip>
  )
}
