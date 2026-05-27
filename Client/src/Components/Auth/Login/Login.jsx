import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';
import { loginUser } from '../../../Functions/Auth';

const LoginPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const boxRef = useRef();

  useEffect(() => {
    gsap.from(boxRef.current, {
      duration: 2,
      opacity: 0,
      y: 50,
      ease: 'power2.out'
    });
  }, []);

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log("da",data);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('userImg', data.data.image);
      localStorage.setItem('userName', data.data.name);
      toast.success('Login successful!');
      setTimeout(() => navigate('/'), 2000);
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Login Failed';
      toast.error(msg);
    }
  });

  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <div className="login-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <Container maxWidth="sm" className="login-container">
        <Box className="login-box" ref={boxRef}>
          <Typography sx={{ color: "#fff" }} variant="h3">
            Login
            <hr />
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              {...register('password', { required: 'Password is required' })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button
              variant="contained"
              color="success"
              type="submit"
              fullWidth
              disabled={isLoading}
              style={{ marginTop: '16px' }}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <a style={{color:"white", textDecoration:"none"}} href="/register">Create new account</a>
        </Box>
      </Container>
    </div>
  );
};

export default LoginPage;
