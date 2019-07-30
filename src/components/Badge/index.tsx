import React from 'react';

import { classname } from '../../utils/classname';

import './styles.css';

export const statuses = ['danger', 'normal', 'warning'] as const;

type Status = typeof statuses[number];

type Props = {
  className?: string;
  status?: Status;
  children?: React.ReactNode;
};

const cn = classname('badge');

export const Badge = ({ className, status, children }: Props) => (
  <span className={cn(null, { status }, className)}>{children}</span>
);