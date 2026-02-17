import React, { useState } from "react";
import "../FormCard/form.css";
import "./searchbar.css";

function SearchBar(props) {
  const [currentValue, setCurrentValue] = useState('')

  return (
    <div className="search-bar-row">
      <input
        className="form-control form-control-lg"
        id="cssform"
        type="text"
        placeholder="City, state, or zip code"
        onKeyDown={e => e.key === 'Enter' ? props.setInput(currentValue) : null}
        onChange={e => setCurrentValue(e.target.value)}
      />
      <button
        type="submit"
        className="search-btn"
        onClick={() => props.setInput(currentValue)}
      >
        Search
      </button>
    </div>
  );
}

export default SearchBar;
