import React, { useState, useRef, useEffect } from 'react';
import DisplayIcon from "../assets/Display.svg"; // Renamed for clarity
import DownArrowIcon from "../assets/down.svg"; // Renamed for clarity
import "../styles/Navbar.css"; // Updated CSS file

const DisplayOptions = ({ display, setDisplay, groupBy, setGroupBy, orderBy, setOrderBy }) => {
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const overlayRef = useRef(null);

  const toggleOverlayVisibility = () => {
    setOverlayVisible(prev => !prev);
  };

  const handleClickOutside = (event) => {
    if (overlayRef.current && !overlayRef.current.contains(event.target)) {
      setOverlayVisible(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('groupBy', groupBy);
    localStorage.setItem('orderBy', orderBy);
  }, [groupBy, orderBy]);

  useEffect(() => {
    if (isOverlayVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOverlayVisible]);

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setOverlayVisible(false);
    }
  };

  useEffect(() => {
    setDisplay('Grouping');
  }, [groupBy]);

  useEffect(() => {
    setDisplay('Ordering');
  }, [orderBy]);

  return (
    <div className='navbar'>
      <div className="display-options-container">
        <button 
          onClick={toggleOverlayVisibility} 
          className="display-btn" 
          aria-haspopup="true" 
          aria-expanded={isOverlayVisible}
        >
          <img src={DisplayIcon} alt="Display options icon" className="filter-icon" />
          Display
          <img src={DownArrowIcon} alt="Down arrow" className="down-arrow" />
        </button>

        {isOverlayVisible && (
          <div className="overlay-panel" ref={overlayRef}>
            <div className="dropdown-container">
              <Dropdown label="Grouping" value={groupBy} onChange={setGroupBy} options={["status", "user", "priority"]} />
              <Dropdown label="Ordering" value={orderBy} onChange={setOrderBy} options={["Priority", "Title"]} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Dropdown = ({ label, value, onChange, options }) => (
  <div className="dropdown">
    <label htmlFor={label.toLowerCase() + 'Select'}>{label}</label>
    <select
      id={label.toLowerCase() + 'Select'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map(option => (
        <option key={option} value={option}>
          {option.charAt(0).toUpperCase() + option.slice(1)} {/* Capitalize the first letter */}
        </option>
      ))}
    </select>
  </div>
);

export default DisplayOptions;
