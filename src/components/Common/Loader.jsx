import React from 'react';
import './loading.css'

const Loader = () => {
  return (
    <div style={containerStyle}>
      <div className="loader"></div>
    </div>
  );
}

export default Loader;

// Container style to center the loader
const containerStyle = {
  display: "flex",
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh', // Full viewport height to center vertically
};
