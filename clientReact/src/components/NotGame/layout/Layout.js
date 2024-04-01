import React from 'react';
import NavigationBar from '../navigationBar/navigationBar';

function Layout({ children }) {
  
  
  
    return (
    <div>
      <NavigationBar />
      <main>
        {children}
      </main>
    </div>
  );
}

export default Layout;