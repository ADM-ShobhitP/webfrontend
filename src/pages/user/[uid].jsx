import { useRouter } from 'next/router';
import { Box, Typography } from '@mui/material';
import Layout from '../../components/Layout';
import service from '../../../service_axios';
import { useEffect, useState } from 'react';

export async function getStaticProps(context) {
  const { params } = context
  console.log('params');

  const res = await service.get(`/users/${params.uid}`)
  const user = await res.data

  return {
    props: {
      user
    }
  }
}

export async function getStaticPaths() {
  const res = await service.get(`/users`)
  const users = await res.data
  const paths = users.map((user) => ({
    params: { uid: user.id.toString() },
  }));
  console.log('paths', paths)
  
  return {
    paths,
    fallback: true,
  }
}


export default function Userbyid({ user }) {
  const router = useRouter();

  return (
    <Layout>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
        <Typography variant="h3" sx={{ mt: 3, mb: 3 }}>User Details</Typography>
        <Typography variant='h5'>User: {user.username}</Typography>
        <Typography variant='h5'>Role: {user.role}</Typography>
        <Typography variant='h5'>Id: {user.id}</Typography>
      </Box>
    </Layout>
  )
}
