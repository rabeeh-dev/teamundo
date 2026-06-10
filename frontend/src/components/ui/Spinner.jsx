import React from 'react';

export default function Spinner({ size = 36 }) {
  return (
    <div
      className="spinner"
      style={{ width: size, height: size }}
    />
  );
}
