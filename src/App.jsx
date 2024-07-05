import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    setSearch(event.target.value);
  };

  useEffect(() => {
    if (search.trim() !== "") {
      fetchBooks();
    }
  }, [search]);

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${search}`
      );
      setBooks(response.data.items || []);
    } catch (error) {
      setError("Error fetching books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <Header />
      <Label search={search} handleInputChange={handleInputChange} />
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <List books={books} />
    </div>
  );
}

function Header() {
  return <h1>Find Book</h1>;
}

function Label({ search, handleInputChange }) {
  return (
    <label htmlFor="book-search">
      Search for a book:
      <input
        type="text"
        name="search"
        value={search}
        onChange={handleInputChange}
      />
    </label>
  );
}

function List({ books }) {
  if (books.length === 0) {
    return <p>No books found</p>;
  }

  return (
    <div className="book-list">
      {books.map((book) => (
        <div key={book.id} className="book">
          <h3>{book.volumeInfo.title}</h3>
          <p>{book.volumeInfo.authors?.join(", ")}</p>
          <p>{book.volumeInfo.description}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
