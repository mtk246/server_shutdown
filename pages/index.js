import Head from 'next/head';
import { getApi } from '@/utils/api';
import { useEffect, useCallback, useState } from 'react';

export default function Home() {
  const [obj, setObj] = useState({});

  const getProductDetails = useCallback(async () => {
    const fetchApi = getApi("https://test-api.takeitnow.io/api/product");

    await fetchApi.then((res) => {
      console.log(res.data);
      setObj(res.data.obj[0]);
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
      <div className='row'>
        {
          Object.keys(obj).map(key => {
            return (
              <div key={key} className='col-md-4 col-lg-2 mb-2'>
                <h1>{key}</h1>
                <h4>Min - {obj[key].min}</h4>
                <h4>Max - {obj[key].max}</h4>
              </div>
            )
          })
        }
      </div>
    </>
  )
}