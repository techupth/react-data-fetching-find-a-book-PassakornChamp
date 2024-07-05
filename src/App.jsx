import { useState, useEffect } from "react";
import axios from "axios";
import { DebounceInput } from "react-debounce-input";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="App">
      <div className="app-wrapper">
        <Header />
        <Label search={search} setSearch={setSearch} />
        {loading && <p className="loading">Loading...</p>}
        {error && <p className="error">{error}</p>}
        <List books={books} truncateText={truncateText} />
      </div>
    </div>
  );
}

function Header() {
  return <h1>Find Book</h1>;
}

function Label({ search, setSearch }) {
  return (
    <label htmlFor="book-search">
      Search for a book:
      <DebounceInput
        minLength={2}
        debounceTimeout={300}
        type="text"
        name="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </label>
  );
}

function List({ books, truncateText }) {
  if (books.length === 0) {
    return <p>No books found</p>;
  }

  return (
    <div className="book-list">
      {books.map((book) => (
        <div key={book.id} className="book">
          {book.volumeInfo.imageLinks && (
            <img
              src={book.volumeInfo.imageLinks.thumbnail}
              alt={book.volumeInfo.title}
              className="book-image"
            />
          )}
          <div className="book-details">
            <h3>{book.volumeInfo.title}</h3>
            <p>{book.volumeInfo.authors?.join(", ")}</p>
            <p>{truncateText(book.volumeInfo.description || "", 100)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
