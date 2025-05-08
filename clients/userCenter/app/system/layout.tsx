'use client';

import React from 'react';
import BasicLayout from '../../components/layout/BasicLayout';

export default function SystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BasicLayout>{children}</BasicLayout>;
}
