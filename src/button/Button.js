import React from 'react';

export const Button = ({ onClick, type, children }) => {
  let style = 'px-4 py-2 rounded font-bold font-sans';
  if (type === 'secondary') {
    style += ' bg-gray-300 hover:bg-gray-400 text-gray-800';
  } else {
    style += ' bg-blue-500 hover:bg-blue-700 text-white';
  }
  return (
    <button className={style} onClick={onClick}>
      {children}
    </button>
  );
};
