import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="max-w-lg mx-auto p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">شعار الموقع هنا</h1>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
