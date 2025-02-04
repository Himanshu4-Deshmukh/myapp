import React, { useEffect, useState } from "react";

const App = () => {
  const [jobStories, setJobStories] = useState([]);
  const [jobIds, setJobIds] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobIds = async () => {
      try {
        const response = await fetch("https://hacker-news.firebaseio.com/v0/jobstories.json");
        if (!response.ok) throw new Error("Failed to fetch data");
        const ids = await response.json();
        setJobIds(ids);
        fetchJobStories(ids.slice(0, 5));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobIds();
  }, []);

  const fetchJobStories = async (ids) => {
    try {
      setLoading(true);
      const details = await Promise.all(
        ids.map(async (id) => {
          const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          if (!response.ok) throw new Error("Failed to fetch data");
          return await response.json();
        })
      );
      setJobStories((prevStories) => [...prevStories, ...details]);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    const nextPage = page + 1;
    const start = nextPage * 5;
    const end = start + 5;
    fetchJobStories(jobIds.slice(start, end));
    setPage(nextPage);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Job Details only the title</h1>
      <p>Total job stories: {jobStories.length}</p>
      <ul>
        {jobStories.map((story) => (
          <li key={story.id}>{story.title}</li>
        ))}
      </ul>
      {jobIds.length > (page + 1) * 5 && <button onClick={handleNext}>Next</button>}
    </div>
  );
};

export default App;
