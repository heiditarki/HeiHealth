import React from 'react'

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', letter: 'O' },
    { id: 'details', label: 'Details', letter: 'D' },
  ]

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
            title={item.label}
          >
            <span className="sidebar-icon">{item.letter}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
