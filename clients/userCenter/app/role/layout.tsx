'use client';

import React from 'react';
import BasicLayout from '../../components/layout/BasicLayout';

export default function RoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BasicLayout>{children}</BasicLayout>;
}
