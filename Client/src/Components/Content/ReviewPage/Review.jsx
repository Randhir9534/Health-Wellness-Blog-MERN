import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  CircularProgress,
  Avatar,
} from "@mui/material";
import RateReviewIcon from "@mui/icons-material/RateReview";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import NotesIcon from "@mui/icons-material/Notes";
import { fetchReviews } from "../../../Functions/Content";

const ReviewPage = () => {
  const {
    data: reviews = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["reviews"],
    queryFn: fetchReviews,
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
        <RateReviewIcon
          fontSize="large"
          sx={{ verticalAlign: "middle", mr: 1 }}
        />
        Blog Reviews
      </Typography>
      <Typography variant="subtitle1" align="center" mb={4}>
        Here's what readers are saying about our blogs
      </Typography>

      {isLoading && (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Typography color="error" align="center">
          Failed to load reviews.
        </Typography>
      )}

      <Grid container spacing={4}>
        {reviews.map((review, index) => (
          <Grid sx={{marginBottom:"2%"}} item xs={12} md={6} lg={4} key={index}>
            <Card
              sx={{
                height: "100%",
                width:"350px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                backgroundColor: "#f3f4f6",
                boxShadow: 3,
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.03)",
                },
              }}
            >
              <CardContent
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                    <Avatar
                  src={`http://localhost:9001/${review.blogImg}`}
                  variant="rounded"
                  alt={review.blogTitle}
                   sx={{ width: 80, height: 80, mr: 2 }}
                />
                  <Typography variant="h6" gutterBottom color="primary">
                    <NotesIcon sx={{ fontSize: 18, mr: 1 }} />
                    {review.blogTitle}
                  </Typography>

                  <Typography variant="body1" gutterBottom>
                    <strong style={{ color: "green" }}>Comment:-</strong>{" "}
                    {review.text}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Typography display="flex" justifyContent="space-between" variant="caption" color="textSecondary">
                    <Avatar
                  src={`http://localhost:9001/${review.userImg}`}
                  alt={review.userName}
                  sx={{ width: 22, height: 22, mr: 1 , border: "2px solid #ccc" }}
                />
                    {review.userName}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    <CalendarTodayIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    {new Date(review.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ReviewPage;
