import { saveServerList } from './ssh';

export default function handler(req, res) {
  const { serverList } = req.body;
  saveServerList(serverList);
  res.status(200).json({ message: 'Server list saved successfully.' });
}
