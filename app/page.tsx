"use client";

import { useEffect, useState, useRef } from "react";
import api from "@/lib/api";
import ProductCard from "@/components/ProductCard";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  tags: string;
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allAvailableTags, setAllAvailableTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const fetchProducts = async (page: number, query: string = "", tags: string[] = []) => {
    try {
      setLoading(true);
      const skip = (page - 1) * itemsPerPage;
      const params: any = { skip };
      if (query) params.q = query;
      if (tags.length > 0) params.tags = tags.join(",");

      const res = await api.get("/products", { params });

      // API returns { count, data: Product[] }
      const { count = 0, data = [] } = res.data;
      const normalized = Array.isArray(data)
        ? data.map((p: any) => ({ ...p, price: Number(p.price) }))
        : [];

      setTotalCount(count);
      setProducts(normalized);
    } catch (error) {
      console.error("Failed to load products", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1, "", []);
  }, []);

  // Extract unique tags from all products for filter options
  useEffect(() => {
    const tags = new Set<string>();
    products.forEach((p) => {
      if (p.tags) {
        p.tags.split(",").forEach((tag) => tags.add(tag.trim()));
      }
    });
    setAllAvailableTags(Array.from(tags).sort());
  }, [products]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search (500ms)
    searchTimeoutRef.current = setTimeout(() => {
      fetchProducts(1, query, selectedTags);
    }, 500);
  };

  const handleTagToggle = (tag: string) => {
    let newTags: string[];
    if (selectedTags.includes(tag)) {
      newTags = selectedTags.filter((t) => t !== tag);
    } else {
      newTags = [...selectedTags, tag];
    }
    setSelectedTags(newTags);
    setCurrentPage(1);
    fetchProducts(1, searchQuery, newTags);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchProducts(nextPage, searchQuery);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      fetchProducts(prevPage, searchQuery);
    }
  };

  if (loading) {
    return (
      <div className="font-mono p-6">
        Loading products…
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl mb-8 border-b-4 border-[#333] pb-2 text-[#fce94f] uppercase tracking-widest font-bold">
        &gt; CATALOG_INDEX
      </h1>

      {/* Search Bar and Filter Button */}
      <div className="mb-6 flex gap-3">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-1 border-2 border-[#111] p-3 bg-[#222] text-[#fff] focus:outline-none focus:border-[#fce94f] shadow-[inset_2px_2px_4px_#000,inset_-2px_-2px_4px_#333]"
        />
        {allAvailableTags.length > 0 && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-6 py-3 font-bold border-b-4 border-r-4 border-[#b48f00] transition-all whitespace-nowrap ${showFilters
              ? "bg-[#fce94f] text-[#000] active:border-b-0 active:border-r-0 active:translate-x-[4px] active:translate-y-[4px]"
              : "bg-[#fce94f] text-[#000] hover:bg-[#ffe066] active:border-b-0 active:border-r-0 active:translate-x-[4px] active:translate-y-[4px]"
              }`}
          >
            {showFilters ? "▼ FILTERS" : "▶ FILTERS"}
          </button>
        )}
      </div>

      {/* Tag Filters */}
      {showFilters && allAvailableTags.length > 0 && (
        <div className="mb-6 p-4 border-2 border-[#111] bg-[#222]">
          <div className="text-xs font-bold text-[#729fcf] mb-3 uppercase">Filter by Category:</div>
          <div className="flex flex-wrap gap-2">
            {allAvailableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 text-xs font-bold border-b-3 border-r-3 border-[#111] ${selectedTags.includes(tag)
                  ? "bg-[#fce94f] text-[#000] active:border-b-0 active:border-r-0 active:translate-x-1 active:translate-y-1 hover:bg-[#ffe066]"
                  : "bg-[#333] text-[#aaa] hover:bg-[#444] active:border-b-0 active:border-r-0 active:translate-x-1 active:translate-y-1"
                  } transition-all`}
              >
                {tag}
              </button>
            ))}
          </div>
          {selectedTags.length > 0 && (
            <button
              onClick={() => {
                setSelectedTags([]);
                setCurrentPage(1);
                fetchProducts(1, searchQuery, []);
              }}
              className="mt-3 px-3 py-1 text-xs font-bold bg-[#333] text-[#aaa] border-b-2 border-r-2 border-[#111] hover:bg-[#444] active:border-b-0 active:border-r-0 active:translate-x-[2px] active:translate-y-[2px] transition-all"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col gap-6">
        {products.length > 0 ? (
          products.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              isLast={idx === products.length - 1}
            />
          ))
        ) : (
          <div className="text-center text-[#aaa] py-8">No products found.</div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalCount > itemsPerPage && (
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 border-b-4 border-r-4 border-[#b48f00] bg-[#fce94f] text-[#000] font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#ffe066] active:border-b-0 active:border-r-0 active:translate-x-[4px] active:translate-y-[4px] transition-all"
          >
            &lt;&lt; PREV
          </button>

          <div className="text-[#aaa] font-mono text-sm">
            Page {currentPage} of {totalPages} ({totalCount} total)
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border-b-4 border-r-4 border-[#b48f00] bg-[#fce94f] text-[#000] font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#ffe066] active:border-b-0 active:border-r-0 active:translate-x-[4px] active:translate-y-[4px] transition-all"
          >
            NEXT &gt;&gt;
          </button>
        </div>
      )}
    </div>
  );
}
