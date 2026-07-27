"use client";
import Link from "next/link";
import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";
import { FaRegUser, FaSearch } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import "@/styles/layout/Header.css";
import { useAppDispatch } from "@/hooks/hooks";

import { CiHeart } from "react-icons/ci";

import { usePathname, useRouter } from "next/navigation";

import { setSearch } from "@/features/filters/filterSlice";
import { useTRPC } from "@/utils/trpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CartItem, CartOutput, WishlistItem } from "@/types/types";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { useAuthModal } from "@/context/AuthModalContext";
const Header = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const pathname = usePathname();

  const trpc = useTRPC();
  const wishlistQueryKey = trpc.wishlistItems.getWishlist.queryKey();
  const { data: wishlistData } = useQuery({
    ...trpc.wishlistItems.getWishlist.queryOptions(),
    queryKey: wishlistQueryKey,
    enabled: !isLoading,
    staleTime: 0,
    refetchOnMount: true,
  });

  const wishlistIds: WishlistItem = wishlistData ?? [];
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { data } = useQuery(
    trpc.cartItem.getCart.queryOptions(undefined, {
      staleTime: 0,
      enabled: !isLoading,
      // refetchOnWindowFocus: false,
    }),
  );
  const cartCount = ((data as CartOutput | undefined)?.cartItem ?? []).reduce(
    (total: number, item: CartItem) => total + item.quantity,
    0,
  );

  const logoutMutation = useMutation(trpc.users.logout.mutationOptions());
  const { openLoginModal } = useAuthModal();
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });
    if (!result.isConfirmed) return;
    logoutMutation.mutate(undefined, {
      onSuccess: async () => {
        // Clear cached user query
        await queryClient.removeQueries({
          queryKey: trpc.users.me.queryKey(),
        });

        toast.success("Logout Successfull");
      },
    });
  };
  useEffect(() => {
    setShowSearch(pathname === "/products");
  }, [pathname]);
  useEffect(() => {
    const searchTimer = setTimeout(() => {
      dispatch(setSearch(localSearch));
    }, 400);
    return () => {
      clearTimeout(searchTimer);
    };
  }, [localSearch]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="  container-custom header-section">
        <div className="flex justify-between items-center gap-4">
          <Link
            href="/"
            className="text-xl font-bold tracking-wide text-gray-900"
          >
            Ecommerce
          </Link>

          <div className="flex items-center gap-5">
            <Link href="/products">Products</Link>
            {showSearch && (
              <div className="product-search-input hidden sm:flex gap-2  items-center  bg-white focus-within:ring-2 focus-within:ring-gray-300  border border-gray-300 rounded-lg px-3 py-2 ">
                <FaSearch className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Search Products..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="outline-none text-sm  px-2 text-gray-600 placeholder:text-gray-400 bg-transparent"
                  name="search"
                />
              </div>
            )}
            <div className="profile-wrapper flex flex-col justify-center">
              <button className="flex flex-col justify-center items-center profile-btn">
                <span>
                  <FaRegUser />
                </span>
                <span className="hidden d-block">Profile</span>
              </button>

              <div className="profile-dropdown z-50">
                {isAuthenticated ? (
                  <ul>
                    <li>
                      <Link href="/" onClick={handleLogout}>
                        Logout
                      </Link>
                    </li>
                    <li>
                      <Link href="/orders">Orders</Link>
                    </li>
                  </ul>
                ) : (
                  <button onClick={() => openLoginModal()}>
                    Login/Register
                  </button>
                )}
                <ul>
                  {/* <li>
                  <Link href="/">Orders</Link>
                </li> */}
                  <li>
                    <Link href="/wishlist">Wishlist</Link>
                  </li>
                  {/* <li>
                  <Link href="/">Gift Cards</Link>
                </li> */}
                  {/* <li>
                  <Link href="/">Contact Us</Link>
                </li> */}
                </ul>
              </div>
            </div>
            <Link href="/wishlist" className="relative">
              <CiHeart size={28} className="text-gray-700" />
              {wishlistIds.length > 0 && (
                <span className="text-xs font-semibold absolute -right-4 -top-3 bg  text-white bg-red-500 rounded-[50%] h-5 w-5 flex items-center justify-center ">
                  {wishlistIds.length}
                </span>
              )}
            </Link>
            <Link href={"/cart"} className="relative">
              <div>
                <FiShoppingCart size={22} className="text-gray-700" />
                {cartCount > 0 && (
                  <span className="text-xs font-semibold absolute -right-4 -top-3 bg  text-white bg-red-500 rounded-[50%] h-5 w-5 flex items-center justify-center ">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>
        {/* {showSearch && (
        <div className="mt-3 sm:hidden  flex items-center gap-2  border bordergra-300 rounded-lg py-2 px-3 bg-white transition-all">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="outline-none text-sm text-gray-600 placeholder:text-gray-400 bg-transparent w-full"
          />
        </div>
      )} */}
      </div>
    </nav>
  );
};

export default Header;
