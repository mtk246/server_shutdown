import Head from 'next/head';
import { getApi } from '@/utils/api';
import { useEffect, useCallback } from 'react';

export default function Home() {

  const getProductDetails = useCallback(async () => {
    const fetchApi = getApi(process.env.API_URL);

    await fetchApi.then((res) => {
      console.log(res.data);
    });
  }, []);

  useEffect(() => {
    getProductDetails();
  }, [getProductDetails]);

  return (
    <>
      <Head>
        <title>NextJS Interview</title>
      </Head>
      <div className="text-danger">hello</div>
    </>
  )
}