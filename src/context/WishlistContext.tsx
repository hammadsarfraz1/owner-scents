"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type WishlistContextType = {
    wishlist: string[]; // List of product IDs
    toggleWishlist: (productId: string) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
};

const WishlistContext = createContext<WishlistContextType>({
    wishlist: [],
    toggleWishlist: async () => { },
    isInWishlist: () => false,
});

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: session } = useSession();
    const [wishlist, setWishlist] = useState<string[]>([]);

    useEffect(() => {
        if (session) {
            fetch("/api/wishlist")
                .then((res) => res.json())
                .then((data) => {
                    if (data.wishlist) setWishlist(data.wishlist);
                })
                .catch(console.error);
        } else {
            setWishlist([]);
        }
    }, [session]);

    const toggleWishlist = async (productId: string) => {
        if (!session) {
            alert("Please sign in to save items.");
            return;
        }

        // Optimistic update
        const isAdded = wishlist.includes(productId);
        setWishlist((prev) =>
            isAdded ? prev.filter(id => id !== productId) : [...prev, productId]
        );

        try {
            const res = await fetch("/api/wishlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId }),
            });

            if (!res.ok) {
                // Revert on failure
                setWishlist((prev) =>
                    isAdded ? [...prev, productId] : prev.filter(id => id !== productId)
                );
            }
        } catch (error) {
            console.error(error);
        }
    };

    const isInWishlist = (productId: string) => wishlist.includes(productId);

    return (
        <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};
