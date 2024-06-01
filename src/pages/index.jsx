import { useState } from 'react';
import fs from 'fs';
import path from 'path';
import { Container, Grid, Card, CardContent, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Image from 'next/image';

export default function Home({ initialAnimeData }) {
  const [animeData, setAnimeData] = useState(initialAnimeData);
  const [open, setOpen] = useState(false);
  const [newAnime, setNewAnime] = useState({ title: '', description: '', rating: '', site: '', image: '' });

  const handleChange = (e) => {
    setNewAnime({ ...newAnime, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/uploadImage', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setNewAnime({ ...newAnime, image: `/uploads/${data.fileName}` });
    console.log(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedAnimeData = [...animeData, newAnime];
    setAnimeData(updatedAnimeData);
    await fetch('/api/saveAnime', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedAnimeData),
    });
    setNewAnime({ title: '', description: '', rating: '', site: '', image: '' });
    handleClose();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container>
      <Fab color="primary" aria-label="add" onClick={handleClickOpen} style={{ position: 'fixed', bottom: 16, right: 16 }}>
        <AddIcon />
      </Fab>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Anime</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Title"
              name="title"
              value={newAnime.title}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Description"
              name="description"
              value={newAnime.description}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Rating"
              name="rating"
              value={newAnime.rating}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Site"
              name="site"
              value={newAnime.site}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            {/* <input
              accept="image/*"
              style={{ display: 'none' }}
              id="raised-button-file"
              type="file"
              onChange={handleImageUpload}
            /> */}
            {/* <label htmlFor="raised-button-file">
              <Button variant="contained" component="span" fullWidth>
                Upload Image
              </Button>
            </label> */}
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Add
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
      <Grid container spacing={4} style={{ marginTop: 20 }}>
        {animeData.map((anime, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              width={300}
              height={300}
              style={{ width: '100%', height: '100%' }}
            >
              {anime.image && (
                <Image
                  src={anime.image}
                  alt={anime.title}
                  width={300}
                  height={300}
                  style={{ width: '100%', height: '100%' }}
                />
              )}
              <CardContent>
                <Typography variant="h5" component="div">
                  {anime.title}
                </Typography>
                <Typography variant="body2" color="gray">
                  {anime.description}
                </Typography>
                <Typography fontSize={14}>
                  Rating: {anime.rating}/10
                </Typography>
                <Typography fontSize={14}>
                  Site: {anime.site}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export async function getServerSideProps() {
  const filePath = path.join(process.cwd(), 'public', 'anime.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  const initialAnimeData = JSON.parse(jsonData);
  return { props: { initialAnimeData } };
}
