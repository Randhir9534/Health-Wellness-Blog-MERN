import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Button,
  TextField,
  Chip,
  Box,
  IconButton,
  Modal,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CommentIcon from "@mui/icons-material/Comment";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Home.css";

import {
  addBookmark,
  fetchBlogs,
  fetchUserBookmarks,
  postComment,
  toggleLike,
} from "../../../Functions/Content";
import TermsPage from "../StaticPages/Terms/Terms";
import PrivacyPolicyPage from "../StaticPages/PrivacyPolicy/PrivacyPolicy";

gsap.registerPlugin(ScrollTrigger);
const HomePage = () => {
  const [page, setPage] = useState(1);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});
  const [likedBlogs, setLikedBlogs] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const navigate = useNavigate();

  const {
    data: blogs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blogs", page, tagFilter],
    queryFn: () => fetchBlogs(page, tagFilter),
  });

  const { data: userBookmarks = [], refetch: refetchBookmarks } = useQuery({
    queryKey: ["userBookmarks"],
    queryFn: fetchUserBookmarks,
    onSuccess: (data) => setBookmarkedIds(data),
  });

  const bookmarkMutation = useMutation({
    mutationFn: addBookmark,
    onSuccess: (_, blogId) => {
      setBookmarkedIds((prev) => [...prev, blogId]);
      refetchBookmarks();
      toast.success("Blog bookmarked!");
    },
    onError: () => {
      toast.error("Failed to bookmark blog.");
    },
  });

  const commentMutation = useMutation({
    mutationFn: postComment,
    onSuccess: (data) => {
      toast.success("Comment added!");
      handleCloseModal();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to add comment");
    },
  });

  const handleBookmark = (blogId) => {
    if (!bookmarkedIds.includes(blogId)) {
      bookmarkMutation.mutate(blogId);
    } else {
      toast.info("Already bookmarked");
    }
  };

  const likeMutation = useMutation({
  mutationFn: toggleLike,
  onSuccess: (data, blogId) => {
    setLikedBlogs((prev) =>
      prev.includes(blogId)
        ? prev.filter((id) => id !== blogId)
        : [...prev, blogId]
    );

    setLikeCounts((prev) => ({
      ...prev,
      [blogId]: data.likes,
    }));
  },
  onError: (err) => {
    toast.error(err?.response?.data?.message || "Failed to like blog.");
  },
});


  const handleLike = (blogId) => {
  likeMutation.mutate(blogId);
};


  const handleOpenCommentModal = (blogId) => {
    setSelectedBlogId(blogId);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCommentText("");
    setSelectedBlogId(null);
  };

  const handleSubmitComment = () => {
    if (!commentText.trim() || !selectedBlogId) {
      toast.warn("Please write something!");
      return;
    }
    commentMutation.mutate({ blogId: selectedBlogId, text: commentText });
  };
  useEffect(() => {
    const counts = {};
    const liked = [];

    blogs.forEach((blog) => {
      counts[blog._id] = blog.likes?.length || 0;
      if (blog.likes?.includes(localStorage.getItem("userId"))) {
        liked.push(blog._id);
      }
    });

    setLikeCounts(counts);
    setLikedBlogs(liked);
  }, [blogs]);

  useEffect(() => {
    gsap.from(".hero-title", {
      opacity: 0,
      y: -40,
      duration: 1,
      ease: "power3.out",
    });

    gsap.from(".hero-subtitle", {
      opacity: 0,
      x: 40,
      duration: 0.5,
      ease: "power2.out",
    });
  }, []);

  useEffect(() => {
    gsap.from(".blog-card", {
      opacity: 0,
      y: 30,
      duration: 1,
      stagger: 0.5,
      delay: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".blog-card",
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  }, [blogs]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <section className="hero-section">
        <Container maxWidth="md">
          <Typography variant="h2" className="hero-title">
            Our Wellness Journey
          </Typography>
          <Typography variant="subtitle1" className="hero-subtitle">
            Discover the story behind WellnessBloom and our commitment to your
            health and happiness
          </Typography>
        </Container>
      </section>

      <div className={darkMode ? "dark-mode" : "light-mode"}>
        <Container maxWidth="lg" className="home-container">
          <Typography variant="h3" gutterBottom className="title">
            Health & Wellness Blogs
          </Typography>
          <hr />
          <Box
            className="filter-section"
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }} // column for phones
            gap={2}
            alignItems={{ xs: "stretch", sm: "center" }}
            justifyContent="space-between"
            mb={2}
          >
            <TextField
              label="Search by Tag"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              variant="outlined"
              sx={{ flex: 1 }}
            />

            <Button
              variant="contained"
              color="success"
              onClick={() => setTagFilter(searchTerm.trim())}
              sx={{
                minWidth: "120px",
                alignSelf: { xs: "stretch", sm: "center" },
                marginTop: "-1.5%",
              }}
            >
              Filter
            </Button>

            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
              }
              label="Dark Mode"
              sx={{
                ml: { xs: 0, sm: "auto" },
                alignSelf: { xs: "flex-start", sm: "center" },
              }}
            />
          </Box>

          {isLoading && <Typography>Loading...</Typography>}
          {error && <Typography color="error">Error loading blogs</Typography>}

          <Grid container spacing={3}>
            {blogs.map((blog) => {
              const isBookmarked = bookmarkedIds.includes(blog._id);
              const isLiked = likedBlogs.includes(blog._id);

              return (
                <Grid item xs={12} md={4} key={blog._id}>
                  <Card className="blog-card">
                    <CardMedia
                      component="img"
                      height="200"
                      image={`http://localhost:9001/${blog.image}`}
                      alt={blog.title}
                    />
                    <CardContent>
                      <Typography variant="h5" gutterBottom>
                        {blog.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {blog.content.substring(0, 100)}...
                      </Typography>
                      <Box mt={1}>
                        {blog.tags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            sx={{ mr: 0.5, mt: 1 }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => navigate(`blogs/${blog._id}`)}
                      >
                        Read More
                      </Button>

                      <IconButton onClick={() => handleBookmark(blog._id)}>
                        {isBookmarked ? (
                          <FaBookmark color="#2e7d32" />
                        ) : (
                          <FaRegBookmark />
                        )}
                      </IconButton>

                      <Box display="flex" alignItems="center">
                        <IconButton onClick={() => handleLike(blog._id)}>
                          {likedBlogs.includes(blog._id) ? (
                            <FavoriteIcon color="error" />
                          ) : (
                            <FavoriteBorderIcon />
                          )}
                        </IconButton>
                        <Typography variant="body2" sx={{ ml: 0.5 }}>
                          {likeCounts[blog._id] || 0}
                        </Typography>
                      </Box>

                      <IconButton
                        onClick={() => handleOpenCommentModal(blog._id)}
                      >
                        <CommentIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
          <Box display="flex" justifyContent="center" mt={4}>
            <Button
              variant="outlined"
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              sx={{ mr: 2 }}
            >
              Previous
            </Button>
            <Button
              variant="outlined"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={blogs?.length < 3} // Disable if fewer blogs than per_page
            >
              Next
            </Button>
          </Box>
        </Container>

        {/* Comment Modal */}
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Leave a Comment
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write your comment..."
            />
            <Box mt={2} textAlign="right">
              <Button onClick={handleSubmitComment} variant="contained">
                Submit
              </Button>
            </Box>
          </Box>
        </Modal>
        <TermsPage/>
        <PrivacyPolicyPage/>
      </div>
    </>
  );
};

export default HomePage;
