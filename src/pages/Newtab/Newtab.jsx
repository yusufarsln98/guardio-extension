import React, { useState } from 'react';
import logo from '../../assets/img/logo.svg';
import './Newtab.css';
import './Newtab.scss';
import { Button, Flex, Form, Input, Space, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import Link from 'antd/es/typography/Link';

const Newtab = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(null);
  const [percentage, setPercentage] = useState(null);

  const onFinish = async () => {
    const { url } = form.getFieldsValue();
    try {
      setLoading(true);
      // response: { prediction: 'It is 81.23 % safe to go ' }
      const res = await axios.post('https://web-guard.onrender.com', { url });

      // extract percentage from the prediction
      const percentage = parseFloat(res.data.prediction.match(/\d+\.\d+/g)[0]);
      setPercentage(percentage);
      if (percentage < 50) {
        setLoading(null);
      } else {
        setTimeout(() => {
          window.open(form.getFieldValue('url'), '_self');
          setLoading(null);
          setPercentage(null);
          form.resetFields();
        }, 2000);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Typography.Title level={3}>Browse Safe.</Typography.Title>
      </header>
      <Flex
        vertical
        align="center"
        style={{
          width: '100%',
        }}
      >
        <Form
          layout="horizontal"
          form={form}
          style={{
            width: '100%',
            maxWidth: '840px',
            padding: '0 20px',
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="url"
            rules={[
              {
                pattern: new RegExp(
                  /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
                ),
                message: 'Please enter a valid URL.',
                validateTrigger: 'onSubmit',
              },
              {
                required: true,
                message: 'Please enter a URL.',
                validateTrigger: 'onSubmit',
              },
            ]}
          >
            <Space.Compact
              style={{
                width: '100%',
              }}
            >
              <Input
                placeholder="https://www.example.com"
                variant="filled"
                style={{
                  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                  background: 'white',
                }}
                size="large"
              />
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                disabled={loading}
                onClick={() => {
                  const url = form.getFieldValue('url');
                  if (url.startsWith('http') || url.startsWith('https')) {
                    return;
                  }
                  form.setFieldsValue({ url: `http://${url}` });
                }}
              >
                <SearchOutlined />
              </Button>
            </Space.Compact>
          </Form.Item>
        </Form>
        <Flex vertical>
          {percentage !== null && (
            <>
              <Flex vertical>
                <Typography.Text
                  type={percentage < 50 ? 'danger' : 'secondary'}
                >
                  It is {percentage.toFixed(2)}% safe to go to this website.
                </Typography.Text>
                {percentage < 50 ? (
                  <Link
                    href={form.getFieldValue('url')}
                    onClick={() => {
                      setPercentage(null);
                      form.resetFields();
                    }}
                    underline
                  >
                    Proceed anyway
                  </Link>
                ) : (
                  <Typography.Text>
                    Redirecting you to the website...
                  </Typography.Text>
                )}
              </Flex>
            </>
          )}
        </Flex>
      </Flex>
    </div>
  );
};

export default Newtab;
