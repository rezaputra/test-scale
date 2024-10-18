'use client';

import { useEffect, useState } from 'react';

export function WeightInfo() {
   const [weight, setWeight] = useState<string | null>(null);
   const [error, setError] = useState<string | null>(null);

   const fetchScaleData = async () => {
      try {
         const response = await fetch('http://localhost:5000/api/scale/scale-test');
         if (!response.ok) {
            throw new Error('Error fetching scale data');
         }
         const data = await response.json();
         setWeight(data.data.weight);
         setError(null); // Reset error on success
      } catch (err) {
         const errorMessage = (err as Error).message || 'An unknown error occurred';
         setError(errorMessage);
      }
   };

   useEffect(() => {
      const intervalId = setInterval(fetchScaleData, 1000);
      fetchScaleData(); // Fetch immediately on component mount

      return () => clearInterval(intervalId);
   }, []);

   if (error) {
      return <div>Error: {error}</div>;
   }

   return (
      <button className="px-4 py-2 bg-green-400">
         {weight !== null ? `${weight} kg` : 'Loading...'}
      </button>
   );
}
