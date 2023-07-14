import { useState, useEffect, useCallback } from 'react';
import { Button } from 'react-bootstrap';

export default function Home() {
  const [response, setResponse] = useState('');
  const [serverList, setServerList] = useState([]);
  const [newServerIP, setNewServerIP] = useState('');
  const [newServerUser, setNewServerUser] = useState('');
  const [newServerPassword, setNewServerPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const getServerData = useCallback(async () => {
    try {
      const res = await fetch('/api/getServerLists', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const serverData = await res.json();
      
      setServerList(serverData);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleShutdown = async (serverIP, serverUsername, serverPassword) => {
    setLoading(true);

    try {
      const res = await fetch('/api/ssh', {
        method: 'POST',
        body: JSON.stringify({
          server_ip: serverIP,
          server_user: serverUsername,
          server_password: serverPassword
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      setResponse(data.message);
    } catch (error) {
      console.error(error);
      setResponse('An error occurred during the shutdown command execution.');
    }

    setLoading(false);
  };

  const handleAddServer = () => {
    if (newServerIP && newServerPassword && newServerUser) {
      const newServer = {
        server_ip: newServerIP,
        server_username: newServerUser,
        server_password: newServerPassword,
      };

      const updatedServerList = [...serverList, newServer];
      setServerList(updatedServerList);
      saveServerList(updatedServerList);

      setNewServerIP('');
      setNewServerPassword('');
    }
  };

  const saveServerList = async (serverList) => {
    try {
      const res = await fetch('/api/saveServerList', {
        method: 'POST',
        body: JSON.stringify({ serverList }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      console.log(data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteServer = async (serverIP) => {
    try {
      const res = await fetch('/api/deleteServerList', {
        method: 'POST',
        body: JSON.stringify({ serverIP }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();

      if (res.status === 200) {
        const updatedServerList = serverList.filter(server => server.server_ip !== serverIP);
        setServerList(updatedServerList);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getServerData();
  }, [getServerData]);

  return (
    <div className="container">
      <h1 className="text-center">Server Shutdown</h1>
      <h4>Add New Server</h4>
      <div className='row'>
        <div className="col-12 col-md-4">
          <input
            className="form-control my-2"
            type="text"
            placeholder="Server IP"
            value={newServerIP}
            onChange={(e) => setNewServerIP(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-4">
          <input
            className="form-control my-2"
            type="text"
            placeholder="Server UserName"
            value={newServerUser}
            onChange={(e) => setNewServerUser(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-4">
          <input
            className="form-control my-2"
            type="password"
            placeholder="Server Password"
            value={newServerPassword}
            onChange={(e) => setNewServerPassword(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-4 my-2">
          <Button onClick={handleAddServer}>Add Server</Button>
        </div>
      </div>
      <h2>Server List</h2>
      <div className="row">
        {serverList.map((server, index) => (
          <div className="col-12 col-md-4 my-2 card border-0" key={index}>
            <div className="card-body border rounded">
              <h5 className="card-title">Server IP: {server.server_ip}</h5>
              <p className="card-title">Server UserName: {server.server_username}</p>
              <p className="card-text">Server Password: {server.server_password}</p>
              {
                loading ? (
                  <Button variant="light">
                    <div className="d-flex flex-row align-items-center">
                      <div class="spinner-border text-primary" role="status">
                      </div>
                      <div className="mx-2"> Please wait while shutting down Server </div>
                    </div>
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    className="mx-2"
                    onClick={() => handleShutdown(server.server_ip, server.server_username, server.server_password)}
                  >
                    Shutdown Server
                  </Button>
                )
              }
              <Button
                variant="danger"
                className="mx-2"
                onClick={() => handleDeleteServer(server.server_ip)}
              >
                Delete Server
              </Button>
            </div>
          </div>
        ))}
      </div>
      <p>{response}</p>
    </div>
  );
}