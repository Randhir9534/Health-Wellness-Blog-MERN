import React, { useEffect } from "react";
import {
  Container,
  Typography,
  Avatar,
  Box,
  Grid,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { styled } from "@mui/material/styles";
import { fetchProfile } from "../../../Functions/Auth";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
  background: "#fdfdfd",
}));

const ProfilePage = () => {
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({ queryKey: ["userProfile"], queryFn: fetchProfile });

  useEffect(() => {
    document.title = "My Profile - WellnessBloom";
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress color="success" />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography color="error" align="center" mt={4}>
        Failed to load profile: {error.message}
      </Typography>
    );
  }

  const imageUrl = user?.image
    ? `http://localhost:9001/${user.image.replace(/\\/g, "/")}`
    : "https://via.placeholder.com/150";

  return (
    <div className="profilePage" style={{height:"450px"}}>
    <Container maxWidth="md" sx={{ mt: 5}}>
      <StyledPaper sx={{background:"linear-gradient(to bottom right, #f1f8e9,rgb(143, 255, 154))",'&:hover': {
      boxShadow: '0px 4px 20px rgba(0,0,0,0.3)',
    },}}>
        <Typography variant="h4" gutterBottom textAlign="center">
          My Profile
        </Typography>
        <hr />
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} sm={4} textAlign="center">
            <Avatar
              src={imageUrl}
              alt={user?.name}
              sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
            />
            <Typography variant="h6">{user?.name}</Typography>
          </Grid>
          <Grid item xs={12} sm={8} textAlign="left">
            <Typography variant="body1" gutterBottom>
              <strong>Email:</strong> {user?.email}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Phone:</strong> {user?.phone || "Not provided"}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Role:</strong> {user?.role || "User"}
            </Typography>
          </Grid>
        </Grid>
      </StyledPaper>
    </Container>
    </div>
  );
};

export default ProfilePage;
