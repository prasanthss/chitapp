
import React from 'react';
import '../loader/loader.css'

const Loader = ({ loading }) => {
  if (!loading) return null;
  return (
     <div id="preloader" className="preloader">
        <div className="page-preloader-middle">
          <span className="spinner-grow text-primary"></span>
          Loading...
        </div>
      </div>
  )
};

export default Loader