import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Button,
  Box,
  Divider,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import gsap from 'gsap';
import './BookMark.css';
import { fetchBookmarks, removeBookmarkApi } from '../../../Functions/Content';

const BookmarkPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: bookmarks = [], isLoading, error } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: fetchBookmarks,
    onError: () => {
      toast.error("Failed to load bookmarks");
    }
  });

  const { mutate: removeBookmark, isPending: removing } = useMutation({
    mutationFn: removeBookmarkApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      toast.success("Bookmark removed successfully");
    },
    onError: () => {
      toast.error("Failed to remove bookmark");
    }
  });

  useEffect(() => {
    const items = gsap.utils.toArray(".bookmark-item");

    items.forEach((item) => {
      gsap.from(item, {
        opacity: 0,
        y: 30,
        duration: 2,
        ease: "power3.out",
      });
    });
  }, [bookmarks]);

  return (
    <Container maxWidth="lg" className="bookmark-container">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Typography variant="h4" gutterBottom>Your Bookmarked Blogs</Typography>

      {isLoading ? (
        <Typography>Loading bookmarks...</Typography>
      ) : bookmarks?.data?.length === 0 ? (
        <Typography>You have no bookmarks yet.</Typography>
      ) : (
        <List>
          {bookmarks?.data.map((blog, index) => (
            <Box key={blog._id}>
              <ListItem
                alignItems="flex-start"
                className="bookmark-item"
                secondaryAction={
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      onClick={() => navigate(`/blogs/${blog._id}`)}
                    >
                      Read More
                    </Button>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => removeBookmark(blog._id)}
                      disabled={removing}
                      sx={{ color: 'error.main' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                }
              >
                <ListItemAvatar>
                  <Avatar
                    variant="rounded"
                    src={`http://localhost:9001/${blog.image}`}
                    alt={blog.title}
                    sx={{ width: 80, height: 80, mr: 2 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="h6" fontWeight="bold">
                      {blog.title}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {blog.content?.substring(0, 120)}...
                    </Typography>
                  }
                />
              </ListItem>
              {index !== bookmarks.data.length - 1 && <Divider component="li" />}
            </Box>
          ))}
        </List>
      )}
    </Container>
  );
};

export default BookmarkPage;
