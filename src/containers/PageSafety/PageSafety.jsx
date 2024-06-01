import React, { useEffect, useState } from 'react';
import { Flex, Result, Typography } from 'antd';
import axios from 'axios';

const PageSafety = ({ url }) => {
  const [percentage, setPercentage] = useState(null);
  useEffect(() => {
    if (url) {
      // get if page sage or not
      const getPrediction = async () => {
        try {
          const res = await axios.post('http://localhost:5000', {
            url,
          });
          const percentage = parseFloat(
            res.data.prediction.match(/\d+\.\d+/g)[0]
          );
          setPercentage(percentage);
        } catch (error) {
          console.error('Error:', error);
        }
      };

      getPrediction();
    }
  }, [url]);
  return (
    <Flex vertical align="center">
      <Typography.Title level={5}>Current Page:</Typography.Title>
      <Typography.Text>{url}</Typography.Text>
      {percentage !== null ? (
        <Typography.Title level={5}>
          {percentage < 50 ? (
            <>
              <Result
                status="error"
                title="This page is not safe."
                subTitle={`It is ${percentage.toFixed(2)}% safe to browse.`}
              />
            </>
          ) : (
            <>
              <Result
                status="success"
                title="This page is safe."
                subTitle={`It is ${percentage.toFixed(2)}% safe to browse.`}
              />
            </>
          )}
        </Typography.Title>
      ) : (
        <Typography.Title level={5}>Loading...</Typography.Title>
      )}
    </Flex>
  );
};

export default PageSafety;
