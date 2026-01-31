import api from "@/lib/api";
import ProductDetailClient from "@/components/ProductDetailClient";

type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    tags: string;
};

// Generate static params for all products
export async function generateStaticParams() {
    try {
        let allProducts: Product[] = [];
        let skip = 0;

        while (true) {
            // Fetch products with skip/limit
            const res = await api.get(`/products?limit=100&skip=${skip}`);
            const data: Product[] = res.data.data || [];
            const total = res.data.count || 0;

            if (data.length === 0) break;

            allProducts = [...allProducts, ...data];
            skip += data.length;

            // Stop if we have fetched all items
            if (allProducts.length >= total) break;

            // Safety break to prevent infinite loops (optional, but good practice)
            if (skip > 10000) break;
        }

        return allProducts.map((product) => ({
            id: product.id.toString(),
        }));
    } catch (error) {
        console.error("Error generating static params:", error);
        return [];
    }
}

export default function ProductDetailPage() {
    return <ProductDetailClient />;
}
