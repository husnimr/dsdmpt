"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import NewsForm from '../../components/NewsForm';

export default function EditNewsPage() {
  const params = useParams();
  const id = params?.id;

  return <NewsForm mode="edit" newsId={id} />;
}
