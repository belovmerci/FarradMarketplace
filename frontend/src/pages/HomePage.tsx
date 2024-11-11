// src/pages/HomePage.tsx
import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../services/api';
import { Card, Row, Col } from 'antd';

const HomePage: React.FC = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  return (
    <Row gutter={16}>
      {products.map((product: any) => (
        <Col span={8} key={product.ProductID}>

        </Col>
      ))}
    </Row>
    // <Card title={product.Name} description={product.Description} />
  );
};

export default HomePage;
