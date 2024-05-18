import Tabs from '@/components/dashboard/Tabs';
import React from 'react';

export default function DashbordLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
    <div>
        <Tabs/>
        {children}
    </div>
    );
  }
  

