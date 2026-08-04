"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import "@/styles/Login.css";
import { FaMobileAlt } from "react-icons/fa";
import { useAppDispatch } from "@/hooks/hooks";
import { useTRPC, useTRPCClient } from "@/utils/trpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  SendOtpOutput,
  UsersendOtpInput,
  UserVerifyOtpInput,
  VerifyOtpOutput,
} from "@/types/types";

interface LoginPopupProps {
  open?: boolean;
  onClose?: () => void;
  mode?: "modal" | "page";
  onSuccess?: () => void;
}
const LoginPopup = ({ open, mode, onClose, onSuccess }: LoginPopupProps) => {
  const trpcClient = useTRPCClient();
  const OTP_LENGTH = 6;
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [termsAndPolicy, setTermsAndPolicy] = useState(false);
  const [otpMode, setOtpMode] = useState(false);
  const [otpValue, setOtpValue] = useState(Array(OTP_LENGTH).fill(""));
  const [otpStatus, setOtpStatus] = useState(null);
  const [verifying, setVerifyig] = useState(false);
  const otpRefId = useRef<string | null>(null);
  const otpRef = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const trpc = useTRPC();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const queryClient = useQueryClient();

  const startTimer = (expiryTime: number) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      const remaining = Math.floor((expiryTime - Date.now()) / 1000);

      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);

        localStorage.removeItem("otpExpiry");
        setTimeLeft(0);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);
  };
  // if alrady any timer exists and it is smaller than Date.now - reft ime set the start timer with that value
  // set the timer with start time

  useEffect(() => {
    const savedExpiry = localStorage.getItem("otpExpiry");
    if (!savedExpiry) return;

    const expiry = Number(savedExpiry);

    startTimer(expiry);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);
  const isValidPhone = useMemo(() => {
    return (
      /^[6-9]\d{9}$/.test(phoneNumber) && // Indian rule
      !/^(\d)\1{9}$/.test(phoneNumber) // all same digits block
    );
  }, [phoneNumber]);
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const mobilenumber = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhoneNumber(mobilenumber);
  };

  const sendOtpMutation = useMutation<SendOtpOutput, unknown, UsersendOtpInput>(
    {
      mutationFn: (variables) => trpcClient.users.sendOtp.mutate(variables),
    },
  );
  const handleSendOtp = () => {
    if (!isValidPhone || !termsAndPolicy) return;

    sendOtpMutation.mutate(
      { phoneNumber },
      {
        onSuccess: () => {
          toast.success("OTP sent successfully");

          const expiry = Date.now() + 300 * 1000;

          localStorage.setItem("otpExpiry", expiry.toString());
          setTimeLeft(300);

          startTimer(expiry);

          setOtpMode(true);
          setOtpValue(Array(OTP_LENGTH).fill(""));
        },
      },
    );
  };
  const verifyOtpMutation = useMutation<
    VerifyOtpOutput,
    unknown,
    UserVerifyOtpInput
  >({
    mutationFn: (variables) => trpcClient.users.verifyOtp.mutate(variables),
  });
  const mergeCartMutation = useMutation(
    trpc.cartItem.mergeCart.mutationOptions(),
  );
  const meregeWishlist = useMutation(
    trpc.wishlistItems.mergeWishlist.mutationOptions(),
  );
  const handleVerifyOtp = async () => {
    const otp = otpValue.join("");
    if (otp.length !== 6) {
      toast.error("Enter valid OTP");
      return;
    }
    verifyOtpMutation.mutate(
      { phoneNumber, otp },
      {
        onSuccess: async () => {
          try {
            await mergeCartMutation.mutateAsync();
            await meregeWishlist.mutateAsync();
            await queryClient.invalidateQueries({
              queryKey: trpc.users.me.queryKey(),
            });
            await queryClient.invalidateQueries(
              trpc.cartItem.getCart.queryFilter(),
            );
            toast.success("Login successful");
            setTimeLeft(0);
            setOtpMode(false);
            setPhoneNumber("");
            setTermsAndPolicy(false);
            localStorage.removeItem("otpExpiry");

            if (mode === "modal") {
              onSuccess?.();
              onClose?.();
            } else {
              router.push("/");
            }
          } catch (error) {
            console.error("Merge cart failed", error);
            router.push("/");
          }
        },
      },
    );
  };
  // Otp
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtpValues = [...otpValue];
    newOtpValues[index] = value;
    setOtpValue(newOtpValues);
    setOtpStatus(null);
    if (value && index < OTP_LENGTH - 1) {
      otpRef.current[index + 1]?.focus();
    }
    // if (newOtpValues.every((digit) => digit !== "")) {
    //   handleVerifyOtp(newOtpValues.join(""));
    // }
  };
  const isModal = mode === "modal";

  if (isModal && !open) return null;
  const loginContent = (
    <div className="bg-white w-full max-w-sm rounded-xl shadow-xl p-7 animate-fade relative">
      {isModal && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
        >
          ×
        </button>
      )}

      <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
        {otpMode ? "Enter OTP" : "Login / Signup"}
      </h1>

      {!otpMode && (
        <>
          <label className="text-sm font-medium text-gray-600 mb-1 block">
            Mobile Number
          </label>

          <div
            className={`flex items-center gap-2 border rounded-lg px-3 py-2 transition-all duration-200 
              ${
                isValidPhone ? "border-green-500 shadow-md" : "border-gray-300"
              }`}
          >
            <FaMobileAlt className="text-pink-600 text-lg" />
            <input
              type="tel"
              placeholder="Enter 10-digit number"
              maxLength={10}
              value={phoneNumber}
              onChange={handlePhoneChange}
              className="w-full outline-none text-gray-700"
            />
          </div>

          {errMsg && <p className="text-red-500 text-sm mt-1">{errMsg}</p>}

          <label className="flex items-center gap-2 text-sm mt-3 cursor-pointer">
            <input
              type="checkbox"
              checked={termsAndPolicy}
              onChange={() => setTermsAndPolicy((prev) => !prev)}
              className="accent-pink-600"
            />
            I agree to the Terms & Privacy
          </label>

          <button
            disabled={!termsAndPolicy || !isValidPhone}
            onClick={handleSendOtp}
            className={`w-full mt-4 py-3 font-semibold rounded-lg transition-all duration-200
                ${
                  !termsAndPolicy || !isValidPhone
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-pink-600 hover:bg-pink-700 shadow-md hover:shadow-lg text-white"
                }`}
          >
            Continue
          </button>
        </>
      )}

      {/* OTP MODE */}
      {otpMode && (
        <>
          <p className="text-gray-600 text-sm text-center mb-4">
            OTP sent to +91 {phoneNumber}
          </p>

          <div className="flex justify-center gap-3 mb-5">
            {Array.from({ length: OTP_LENGTH }).map((_, index) => (
              <input
                key={index}
                ref={(el) => {
                  otpRef.current[index] = el;
                }}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                className="w-11 h-11 text-center text-xl font-semibold border border-gray-300 
                  rounded-lg ring-pink-600 focus:ring-2 transition-all duration-200 
                  shadow-sm outline-none"
                maxLength={1}
              />
            ))}
          </div>

          <button
            onClick={handleVerifyOtp}
            className="w-full py-3 font-semibold 
              bg-pink-600 hover:bg-pink-700 text-white rounded-lg
              transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Verify & Login
          </button>
          {timeLeft && timeLeft > 0 ? (
            <p className="text-sm text-gray-500 mt-2">
              Resend OTP in {Math.floor(timeLeft / 60)}:
              {(timeLeft % 60).toString().padStart(2, "0")}
            </p>
          ) : (
            <button
              onClick={handleSendOtp}
              className="text-sm text-blue-600 mt-2"
            >
              Resend OTP
            </button>
          )}
          <button
            onClick={() => setOtpMode(false)}
            className="text-sm mt-3 w-full text-center text-pink-600 hover:underline"
          >
            Change mobile number
          </button>
        </>
      )}
    </div>
  );
  if (mode === "page") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        {loginContent}
      </div>
    );
  }
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      {loginContent}
    </div>
  );
};

export default LoginPopup;
