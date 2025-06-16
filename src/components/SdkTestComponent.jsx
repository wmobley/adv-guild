import React, { useState, useEffect } from 'react';
// Assuming your SDK generates a function named 'getPublicQuests' for your query
import { getPointOfInterests } from '@firebasegen/adv-guild-backend-connector';

function SdkTestComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testSdkFunction = async () => {
      try {
        setLoading(true);
        // Calling the getPublicQuests function from your SDK
        const result = await getPointOfInterests(); // Add arguments if your query/SDK function expects them
        setData(result);
        setError(null);
      } catch (err) {
        console.error("SDK Test Error:", err);
        setError(err.message || 'Failed to execute SDK function');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    testSdkFunction();
  }, []); // Empty dependency array ensures this runs once on component mount

  if (loading) return <p>Testing SDK: Loading...</p>;
  if (error) return <p>SDK Test Error: {error}</p>;

  return (
    <div>
      <h2>SDK Test Output:</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default SdkTestComponent;