import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NOWPAYMENTS_BASE_URL,
  headers: {
    'x-api-key': process.env.NEXT_PUBLIC_NOWPAYMENTS_API_KEY,
  },
});
