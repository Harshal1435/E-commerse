import { useState, useEffect } from "react";

export function useProducts(category, sort, page, limit = 12, query = "") {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://dummyjson.com/products/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        setError("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = "";

        if (query) {
          // 🔍 Search API
          url = `https://dummyjson.com/products/search?q=${query}&limit=${limit}&skip=${
            page * limit
          }`;
        } else if (category && category !== "all") {
          url = `https://dummyjson.com/products/category/${category}?limit=${limit}&skip=${
            page * limit
          }`;
        } else {
          url = `https://dummyjson.com/products?limit=${limit}&skip=${page * limit}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        let sorted = [...data.products];
        if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
        if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
        if (sort === "title-asc") sorted.sort((a, b) => a.title.localeCompare(b.title));
        if (sort === "title-desc") sorted.sort((a, b) => b.title.localeCompare(a.title));

        setProducts(sorted);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, sort, page, limit, query]);

  return { products, categories, loading, error };
}
