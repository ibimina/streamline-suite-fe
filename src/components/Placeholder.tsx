import React from 'react';

interface PlaceholderProps {
  title: string;
}

const Placeholder: React.FC<PlaceholderProps> = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center bg-white dark:bg-gray-800 rounded-xl p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-400">This module is under construction. Check back soon for updates!</p>
      <div className="mt-8 rounded-lg shadow-lg max-w-md w-full overflow-hidden">
        <img src="https://i.imgur.com/g3d3jPz.png" alt="Work in progress" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default Placeholder;