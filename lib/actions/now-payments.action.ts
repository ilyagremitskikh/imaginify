import { apiClient } from '../services/axios';

export const getApiStatus = async () => {
  const { data } = await apiClient.get('status');
  return data;
};

export const getAvailableCurrencies = async () => {
  const { data } = await apiClient.get('currencies?fixed_rate=true');
  return data;
};

export const getEstimatedPrice = async () => {
  try {
    const { data } = await apiClient.get('estimate?amount=40&currency_from=usd&currency_to=tusd');
    return data;
  } catch (error) {
    console.log(error);
  }
};
