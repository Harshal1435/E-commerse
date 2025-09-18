export default function FilterBar({ categories, selected, onSelect }) {
  return (
    <div className="flex gap-2 p-4 overflow-x-auto">
      <button
        onClick={() => onSelect("all")}
        className={`px-4 py-2 rounded-full border ${
          selected === "all" ? "bg-blue-600 text-white" : "bg-white"
        }`}
      >
        All
      </button>
      {categories.map((c, idx) => {
        const value = typeof c === "string" ? c : c.name || c.slug || String(c);
        return (
          <button
            key={value + idx}  // ✅ unique key
            onClick={() => onSelect(value)}
            className={`px-4 py-2 rounded-full border whitespace-nowrap ${
              selected === value ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            {value}
          </button>
        );
      })}
    </div>
  );
}
