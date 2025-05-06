'use client';

import React from 'react';
import BasicLayout from '../../src/layouts/BasicLayout';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BasicLayout>{children}</BasicLayout>;
} 