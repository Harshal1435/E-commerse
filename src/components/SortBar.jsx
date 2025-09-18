export default function SortBar({ sort, onSort }) {
  return (
    <div className="flex gap-4 p-4">
      <select
        value={sort}
        onChange={(e) => onSort(e.target.value)}
        className="border p-2 rounded-md"
      >
        <option value="">Sort By</option>
        <option value="price-asc">Price: Low → High</option>
        <option value="price-desc">Price: High → Low</option>
        <option value="title-asc">Title: A → Z</option>
        <option value="title-desc">Title: Z → A</option>
      </select>
    </div>
  );
}
