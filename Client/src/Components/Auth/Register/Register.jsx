import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./Register.css";
import gsap from 'gsap';
import { registerUser } from "../../../Functions/Auth";

const RegisterPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const boxRef = useRef();

  useEffect(() => {
    gsap.from(boxRef.current, {
      duration: 2,
      opacity: 0,
      y: 50,
      ease: 'power2.out'
    });
  }, []);

  const { mutate, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success("Registered successfully!");
      setTimeout(() => navigate("/login"), 2000);
    },
    onError: (err) => {
      const msg = err.response?.data?.message || "Registration failed";
      toast.error(msg);
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("phone", data.phone);

    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    mutate(formData);
  };

  return (
    <div className="register-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <Container maxWidth="sm" className="register-container">
        <Box className="register-box" ref={boxRef}>
          <Typography style={{ color: "white" }} variant="h4">
            Register
            <hr />
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              {...register("name", { required: "Name is required" })}
              error={!!errors.name}
              helperText={errors.name?.message}
              sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderRadius: "8px" } } }}
            />

            <TextField
              label="Email"
              fullWidth
              margin="normal"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#2e7d32" },
                  "&.Mui-focused fieldset": { borderColor: "#2e7d32" },
                },
              }}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#2e7d32" },
                  "&.Mui-focused fieldset": { borderColor: "#2e7d32" },
                },
              }}
            />

            <TextField
              label="Phone"
              fullWidth
              margin="normal"
              {...register("phone", { required: "Phone is required" })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#2e7d32" },
                  "&.Mui-focused fieldset": { borderColor: "#2e7d32" },
                },
              }}
            />

            <TextField
              type="file"
              fullWidth
              margin="normal"
              {...register("image")}
              error={!!errors.image}
              helperText={errors.image?.message}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#2e7d32" },
                  "&.Mui-focused fieldset": { borderColor: "#2e7d32" },
                },
              }}
            />

            <Button
              variant="contained"
              color="success"
              type="submit"
              fullWidth
              disabled={isPending}
              sx={{ mt: 2 }}
            >
              {isPending ? "Registering..." : "Register"}
            </Button>
          </form>
        </Box>
      </Container>
    </div>
  );
};

export default RegisterPage;
