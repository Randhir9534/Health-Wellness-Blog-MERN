import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Chip,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CardMedia,
} from "@mui/material";
import "./BlogDetails.css";
import gsap from "gsap";
import { fetchBlogDetails } from "../../../Functions/Content";
import { end_points } from "../../../Api/api";
import axiosInstance from "../../../Api/axiosInstance";

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: blog,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => fetchBlogDetails(id),
    enabled: !!id,
  });
  let api=end_points.FetchBlogs
  const { data: allBlogs = [] } = useQuery({
    queryKey: ["allBlogs"],
    queryFn: async () => {
      const { data } = await axiosInstance.get(api);
      return data;
    },
  });

  useEffect(() => {
    gsap.from(".blog-detail-container",{
      opacity:0,
      duration:2,
      delay:1,
      y:30,
      stagger:1,
    })
    }, []);

  const relatedBlogs = allBlogs.filter(
    (b) => b.category === blog?.category && b._id !== id
  );

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error || !blog)
    return <Typography color="error">Blog not found</Typography>;  

  return (
    <Container maxWidth="md" className="blog-detail-container">
      {/* Display Full Image */}
      <Box marginBottom={3}>
        <img
        className="blogImG"
          src={`http://localhost:9001/${blog.image}`}
          alt={blog.title}
          style={{
            width: "100%",
            maxHeight: "500px",
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />
      </Box>

      <Typography variant="h3" gutterBottom>
        {blog.title}
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Author: {blog.authorId} | Date:{" "}
        {new Date(blog.date).toLocaleDateString()}
      </Typography>

      <Box marginTop={2}>
        {blog.tags && blog.tags.length > 0 ? (
          blog.tags.map((tag, index) => (
            <Chip
              label={tag}
              key={index}
              size="small"
              style={{ marginRight: "4px", marginBottom: "4px" }}
            />
          ))
        ) : (
          <Typography variant="body2" color="textSecondary">
            No tags available
          </Typography>
        )}
      </Box>

      <Typography variant="body1" paragraph className="blog-content">
        {blog.content}
      </Typography>

      <Box marginTop={4}>
        <Typography variant="h5" gutterBottom>
          Related Posts
        </Typography>
        <Grid container spacing={3}>
          {relatedBlogs.length === 0 && (
            <Typography>No related posts found.</Typography>
          )}
          {relatedBlogs.map((relatedBlog) => (
            <Grid item xs={12} md={4} key={relatedBlog._id}>
              <Card className="blog-card">
                <CardMedia
                  id="img"
                  component="img"
                  height="200"
                  image={`http://localhost:9001/${relatedBlog.image}`}
                  alt={blog.title}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {relatedBlog.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {relatedBlog.content.substring(0, 80)}...
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => navigate(`/blogs/${relatedBlog._id}`)}
                  >
                    Read More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default BlogDetailPage;
