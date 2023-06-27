import { useState } from 'react';

export default function Home() {
  const [response, setResponse] = useState('');

  const handleShutdown = async () => {
    try {
      const res = await fetch('/api/ssh');
      const data = await res.json();
      setResponse(data.message);
    } catch (error) {
      console.error(error);
      setResponse('An error occurred during the shutdown command execution.');
    }
  };

  return (
    <div>
      <h1>Server Shutdown</h1>
      <button onClick={handleShutdown}>Shutdown Server</button>
      <p>{response}</p>
    </div>
  );
}
