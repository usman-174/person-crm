"use client"
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'

const GoBack = () => {
  const router = useRouter();

  return (
    <div className="ml-5">
        <button
          onClick={() => router.back()}
          className="flex items-center font-bold gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Go Back</span>
        </button>
      </div>
  )
}

export default GoBack