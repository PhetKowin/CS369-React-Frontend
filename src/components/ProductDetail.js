import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [datafilter, setDataFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDataForPosts = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/ship/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error: Status ${response.status}`);
      }
      const postsData = await response.json();
      setData(postsData.data[0]);
      setDataFilter(postsData.data[0]);
      setError(null);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataForPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>No data found.</div>;
  }

  return (
    <div style={{ display: 'block', minHeight: '100vh', margin: '5rem' }}>
      <div style={{ textAlign: 'left', marginLeft: '5rem' }}>
        <button onClick={() => navigate(-1)}>Back</button>
      </div>
      <div style={{ textAlign: 'center' }}>
        <h1>Product Detail</h1>
        <img src={data[0].ProductImage} alt={data[0].ProductName} style={{ width: '300px', height: '300px' }} />
      </div>
      <div style={{ textAlign: 'left', marginLeft: '5rem' }}>
        <p>Product ID: {data[0].ProductID}</p>
        <p>Product Name: {data[0].ProductName}</p>
        <p>Product Price: {data[0].ProductPrice}</p>
        <p>Product Detail: {data[0].ProductDetail}</p>
        <p>Product Size: {data[0].ProductSize}</p>
        <p>Product Material: {data[0].ProductMaterial}</p>
      </div>
    </div>
  );
}

export default ProductDetail;