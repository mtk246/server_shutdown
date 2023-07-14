import { loadServerList } from './ssh';

export default function handler(req, res) {
    const serverList = loadServerList();
    res.status(200).json(serverList);
}
