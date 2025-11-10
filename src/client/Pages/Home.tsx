import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface Props {
  name: string;
  success?: string[];
}

export default function Home({ name, success }: Props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    console.log('count', count);
  }, []);
  return (
    <>
      <Head title="Home" />
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Welcome to Inertia.js + React + Express!</h1>
        <p>This is the Home component rendered by React.</p>
        <p>Name prop from server: <strong>{name}</strong></p>

        <p>Count: {count}</p>
        <button onClick={() => setCount(count + 1)}>Increment</button>
        {success && success.length > 0 && (
          <div style={{ 
            padding: '10px', 
            backgroundColor: '#d4edda', 
            color: '#155724', 
            borderRadius: '4px',
            marginTop: '10px'
          }}>
            <strong>Success:</strong> {success[0]}
          </div>
        )}
      </div>
    </>
  );
}

