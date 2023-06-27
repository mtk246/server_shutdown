import { Client } from 'ssh2';

export default function handler(req, res) {
  const conn = new Client();

  conn.on('ready', () => {
    conn.exec('sudo reboot', (err, stream) => {
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
    host: '52.14.190.240',
    port: 22,
    username: 'ubuntu',
    // password: 'your-password',
    privateKey: require('fs').readFileSync('./postgres_ec2.pem'),
  });
}
