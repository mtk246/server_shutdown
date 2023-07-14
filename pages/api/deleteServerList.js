import { saveServerList, loadServerList } from './ssh';

export default function handler(req, res) {
  const { serverIP } = req.body;
  const serverList = loadServerList();

  const updatedServerList = serverList.filter(server => server.server_ip !== serverIP);
  saveServerList(updatedServerList);

  res.status(200).json({ message: 'Server deleted successfully.' });
}
