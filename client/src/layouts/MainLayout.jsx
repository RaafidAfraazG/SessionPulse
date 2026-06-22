/**
 * @file MainLayout.jsx
 * @description Root layout: persistent sidebar (desktop) + header + scrollable content.
 *
 * @param {{
 *   currentPage: string,
 *   onNavigate: (page: string) => void,
 *   headerProps?: Object,
 *   children: React.ReactNode,
 * }} props
 */

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const MainLayout = ({ currentPage, onNavigate, headerProps = {}, children }) => (
  <div className="flex h-screen bg-white text-slate-900 overflow-hidden">
    {/* Sidebar — hidden on mobile, visible on lg+ */}
    <Sidebar currentPage={currentPage} onNavigate={onNavigate} />

    {/* Main content area */}
    <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
      {/* Sticky header */}
      <Header
        currentPage={currentPage}
        onNavigate={onNavigate}
        {...headerProps}
      />

      {/* Page content — scrollable */}
      <main className="flex-1 overflow-y-auto sp-scrollbar">
        {children}
      </main>
    </div>
  </div>
);

export default MainLayout;
