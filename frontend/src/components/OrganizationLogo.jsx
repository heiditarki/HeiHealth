import React from 'react'
import './OrganizationLogo.css'

const OrganizationLogo = ({ org }) => {
  if (!org) return null

  const getLogoContent = () => {
    // Normalize organization name
    const orgNormalized = org?.toUpperCase()
    
    if (orgNormalized === 'OYS' || orgNormalized === 'OULUHVA') {
      return (
        <div className="org-logo oys-logo">
          <div className="oys-star">✦</div>
          <div className="oys-text">
            <span className="oys-acronym">oys</span>
            <span className="oys-full">Oulun yliopistollinen sairaala</span>
          </div>
        </div>
      )
    }
    
    if (orgNormalized === 'HUS' || orgNormalized === 'HELSINKIHUS') {
      return (
        <div className="org-logo hus-logo">
          <span className="hus-text">HUS</span>
          <span className="hus-cross">✚</span>
        </div>
      )
    }
    
    if (orgNormalized === 'TAYS' || orgNormalized === 'TAMPEREtays') {
      return (
        <div className="org-logo tays-logo">
          <img 
            src="/tays-logo.png" 
            alt="Tays logo" 
            className="tays-logo-image"
            onError={(e) => {
              // Fallback if image not found
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'block'
            }}
          />
          <div className="tays-fallback" style={{ display: 'none' }}>
            <span className="tays-text">Tays</span>
          </div>
        </div>
      )
    }
    
    return <div className="org-logo default-logo">{org}</div>
  }

  return getLogoContent()
}

export default OrganizationLogo
