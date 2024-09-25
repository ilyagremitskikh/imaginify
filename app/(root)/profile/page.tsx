'use client';

import { Button } from '@/components/ui/button';
import { getApiStatus, getAvailableCurrencies, getEstimatedPrice } from '@/lib/actions/now-payments.action';
import React from 'react';

const ProfilePage = () => {
  const onClickHandler = async () => {
    let response = await getApiStatus();
    console.log(response);
    response = await getAvailableCurrencies();
    console.log(response);
    response = await getEstimatedPrice();
    console.log(response);
  };
  return (
    <>
      <Button onClick={onClickHandler}>Api test</Button>
    </>
  );
};

export default ProfilePage;
