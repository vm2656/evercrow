import React from 'react';

const FlyingBirds: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="bird-container bird-container--one">
        <div className="bird bird--one"></div>
      </div>
      <div className="bird-container bird-container--two">
        <div className="bird bird--two"></div>
      </div>
      <div className="bird-container bird-container--three">
        <div className="bird bird--three"></div>
      </div>
      <div className="bird-container bird-container--four">
        <div className="bird bird--four"></div>
      </div>
    </div>
  );
};

export default FlyingBirds;