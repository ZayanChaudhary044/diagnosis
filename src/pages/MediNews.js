import React, { useState, useEffect } from 'react';
import '../news.css';

function MediNews() {

    const apiKey = 'e732bf85fe3cfa8c18adb2df66d0be7c';
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      fetchData();
    }, []);

    const fetchData = async() => {
      try{
        const response = await fetch(`https://gnews.io/api/v4/top-headlines?category=health&lang=en&max=10&apikey=${apiKey}`);
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
          { loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <ul className="articles">
              {data.map((articles, index) => (
                <li key={index}>
                  <div className="newsborder">
                    <h2 className="title">{articles.title}</h2>
                    <p>{articles.description}</p>
                    <p className="source">-{articles.source.name}</p>
                  </div>    
                </li>     
              ))}
            </ul>
          )
        }
        </header>
      </div>
    );
  }
  
  export default MediNews;
