'use client';

import { Suspense } from 'react';
import NormalComponent from '../components/live/NormalComponent';

export default function Normal() {
  return (
    <>
      <Suspense>
        <NormalComponent />
      </Suspense>
    </>
  );
}
