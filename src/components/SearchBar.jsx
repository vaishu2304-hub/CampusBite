function SearchBar({ search, setSearch }) {
  return (
    <div className="search-container">

      <input
        type="text"
        value={search}
        maxLength={100}
        onChange={(event) => {
          setSearch(event.target.value);
        }}
        placeholder="Search burgers, pizza, biryani..."
        aria-label="Search food"
      />

      {search && (
        <button
          type="button"
          onClick={() => setSearch("")}
        >
          Clear
        </button>
      )}

    </div>
  );
}

export default SearchBar;