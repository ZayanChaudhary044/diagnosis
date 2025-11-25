import React, { useState, useEffect } from 'react';
import '../news.css';

function MediNews() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/news'); 

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      setData(result.articles);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Home">
      <header className="container">
        <h3>Current News</h3>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <ul className="articles">
            {data.map((article, index) => (
              <li key={index}>
                <div className="newsborder">
                  <h2 className="title">{article.title}</h2>
                  <p>{article.description}</p>
                  <p className="source">-{article.source.name}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

      </header>
    </div>
  );
}

export default MediNews;
