// AdSenseComponent.js - Component for Google AdSense integration in RiverForo.com

import React, { useEffect, useRef } from 'react';
import './AdSenseComponent.scss';

const AdSenseComponent = ({ adSlot, format, responsive, style }) => {
  const adRef = useRef(null);
  
  useEffect(() => {
    // Only add the ad if window.adsbygoogle is defined
    if (window.adsbygoogle && adRef.current) {
      try {
        // Push the ad to adsbygoogle for display
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, []);

  return (
    <div className="adsense-container" style={style}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with actual AdSense publisher ID
        data-ad-slot={adSlot}
        data-ad-format={format || 'auto'}
        data-full-width-responsive={responsive || 'true'}
      ></ins>
      <div className="ad-label">Publicidad</div>
    </div>
  );
};

export default AdSenseComponent;
