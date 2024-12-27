import { useState, useEffect } from 'react';

export const useServerManagement = () => {
  const [serverNames, setServerNames] = useState<string[]>([]);

  useEffect(() => {
    const savedRestaurantInfo = localStorage.getItem('restaurantInfo');
    if (savedRestaurantInfo) {
      const { serverNames: savedServerNames } = JSON.parse(savedRestaurantInfo);
      if (Array.isArray(savedServerNames)) {
        console.log("useServerManagement: Loading server names:", savedServerNames);
        setServerNames(savedServerNames);
      }
    }
  }, []);

  const updateServerNames = (names: string[]) => {
    console.log("useServerManagement: Updating server names:", names);
    setServerNames(names);
  };

  return { serverNames, updateServerNames };
};