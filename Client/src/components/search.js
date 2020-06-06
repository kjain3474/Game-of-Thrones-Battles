import Bloodhound from 'corejs-typeahead';
import produce from 'immer';
import React, {useState, useCallback, useRef} from 'react';
import * as Icon from 'react-feather';
import {Link} from 'react-router-dom';
import {useTrail, animated} from 'react-spring';
import {useDebounce} from 'react-use';
import axios from 'axios';

var locationEngine = null;

axios.get(`/api/list`)
.then(res => {
  const locations = [];

  res.data.map(function(location)
  {
    locations.push({location: location});
    return null;
  })


  locationEngine = new Bloodhound({
    initialize: true,
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('location'),
    local: locations,
  });

})


function Search() {
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState([]);
  const searchInput = useRef(null);

  const handleSearch = useCallback((searchInput) => {
    const results = [];

    const locationSync = (datums) => {
      datums.map((result, index) => {
        const locationObj = {
          name: result.location,
        };
        results.push(locationObj);
        return null;
      });
      setResults([...results]);
    };

    const locationAsync = (datums) => {
      // to handle async remote call on initial launch
      locationEngine.search(searchInput, locationSync);
    };

    locationEngine.search(searchInput, locationAsync);
  }, []);

  useDebounce(
    () => {
      if (searchValue) {
        handleSearch(searchValue);
      } else {
        setResults(
          produce(results, (draftResults) => {
            draftResults.splice(0);
          })
        );
      }
    },
    10,
    [searchValue]
  );

  const [trail, set] = useTrail(3, () => ({
    transform: 'translate3d(0, 10px, 0)',
    opacity: 0,
  }));

  set({transform: 'translate3d(0, 0px, 0)', opacity: 1});

  return (
    <div className="Search">
      <animated.label style={trail[0]}>
        {'Search Battles by Location'}
      </animated.label>
      <animated.div className="line" style={trail[1]}></animated.div>

      <animated.div className="search-input-wrapper" style={trail[2]}>
        <input
          type="text"
          value={searchValue}
          ref={searchInput}
          onChange={(event) => {
            setSearchValue(event.target.value);
          }}
        />

        <div className={`search-button`}>
          <Icon.Search />
        </div>

        {searchValue.length > 0 && (
          <div
            className={`close-button`}
            onClick={() => {
              setSearchValue('');
              setResults([]);
            }}
          >
            <Icon.X />
          </div>
        )}
      </animated.div>

      {results.length > 0 && (
        <div className="results">
          {results.map((result, index) => {

              return (
                <Link key={index} to={`battles/${result.name}`}>
                  <div className="result">
                    <div className="result-left">
                      <div className="result-name">
                        {`${result.name}`}
                      </div>
                    </div>
                    <div className="result-type">
                      <Icon.ArrowRightCircle size={14} />
                    </div>
                  </div>
                </Link>
              );
  
          })}
        </div>
      )}
      
    </div>
  );
}


export default Search;
