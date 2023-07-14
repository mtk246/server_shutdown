import fs from 'fs';
import path from 'path';
import { Client } from 'ssh2';

export default function handler(req, res) {
  const { server_ip, server_user, server_password } = req.body;

  const conn = new Client();

  conn.on('ready', () => {
    conn.exec('echo ' + server_password + ' | sudo -S shutdown -r now', (err, stream) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred during the shutdown command execution.' });
        return;
      }
      stream.on('close', (code, signal) => {
        conn.end();
        res.status(200).json({ message: `Shutdown command executed with code ${code}` });
      }).on('data', (data) => {
        console.log('STDOUT: ' + data);
      }).stderr.on('data', (data) => {
        console.log('STDERR: ' + data);
      });
    });
  }).connect({
    host: server_ip,
    port: 22,
    username: server_user,
    password: server_password,
  });
}

export function loadServerList() {
  const filePath = path.join(process.cwd(), 'server.json');
  const serverList = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(serverList);
}

export function saveServerList(serverList) {
  const filePath = path.join(process.cwd(), 'server.json');
  fs.writeFileSync(filePath, JSON.stringify(serverList));
}

export function deleteServerList(serverIP) {
  const filePath = path.join(process.cwd(), 'server.json');
  const serverList = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const serverIndex = serverList.findIndex(server => server.server_ip === serverIP);

  if (serverIndex !== -1) {
    serverList.splice(serverIndex, 1);
    fs.writeFileSync(filePath, JSON.stringify(serverList));
  }
}