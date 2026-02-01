import React, { useCallback, useEffect, useRef, useState } from 'react';
import { OpenStreetMapService } from '../utils/OpenStreetMapService';

interface OSMAutocompleteProps {
  inputRef: React.RefObject<HTMLInputElement>;
  onPlaceSelect: (place: {
    place_id: string;
    formatted_address: string;
    lat: number;
    lng: number;
    city: string;
    country: string;
    country_code: string;
  }) => void;
  placeholder?: string;
  className?: string;
  types?: string[];
}

export const OSMAutocomplete: React.FC<OSMAutocompleteProps> = ({
  inputRef,
  onPlaceSelect,
  placeholder = "Search for a place...",
  className = "",
  types = []
}) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const searchPlaces = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    
    try {
      const results = await OpenStreetMapService.searchPlaces(query, 5);
      setSuggestions(results);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error searching places:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    
    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Set new timeout for debounced search
    debounceTimeoutRef.current = setTimeout(() => {
      searchPlaces(query);
    }, 300); // 300ms debounce
  }, [searchPlaces]);

  const handleSuggestionClick = useCallback((suggestion: any) => {
    onPlaceSelect({
      place_id: suggestion.place_id,
      formatted_address: suggestion.formatted_address,
      lat: suggestion.lat,
      lng: suggestion.lng,
      city: suggestion.city,
      country: suggestion.country,
      country_code: suggestion.country_code
    });
    
    if (inputRef.current) {
      inputRef.current.value = suggestion.formatted_address;
    }
    
    setShowSuggestions(false);
    setSuggestions([]);
  }, [onPlaceSelect, inputRef]);

  const handleInputFocus = useCallback(() => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  }, [suggestions.length]);

  const handleInputBlur = useCallback(() => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        autoComplete="off"
      />
      
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.place_id || index}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="font-medium text-sm text-gray-900">
                {suggestion.formatted_address}
              </div>
              {(suggestion.city || suggestion.country) && (
                <div className="text-xs text-gray-500">
                  {[suggestion.city, suggestion.country].filter(Boolean).join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

