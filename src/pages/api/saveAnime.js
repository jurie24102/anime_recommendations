import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const filePath = path.join(process.cwd(), 'public', 'anime.json');
    const animeData = req.body;

    fs.writeFile(filePath, JSON.stringify(animeData, null, 2), (err) => {
      if (err) {
        res.status(500).json({ error: 'Failed to save data' });
        return;
      }
      res.status(200).json({ message: 'Data saved successfully' });
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
