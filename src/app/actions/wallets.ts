"use server";

import { adminDb } from "@/lib/firebase/admin";
import { getAuthenticatedUser } from "@/utils/auth";
import { redirect } from "next/navigation";

export async function getUserWallets() {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const walletsSnapshot = await adminDb
      .collection("wallets")
      .where("userId", "==", user.uid)
      .where("isActive", "==", true)
      .get();

    const wallets = walletsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      wallets,
      hasWallets: wallets.length > 0,
    };
  } catch (error) {
    console.error("Error fetching wallets:", error);
    throw new Error("Failed to fetch wallets");
  }
}

export async function createFirstWallet(formData: FormData) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const name = formData.get("name") as string;
    const currency = formData.get("currency") as string;
    const initialBalance =
      parseFloat(formData.get("initialBalance") as string) || 0;

    // Validate input
    if (!name?.trim()) {
      throw new Error("Wallet name is required");
    }

    if (!currency) {
      throw new Error("Currency is required");
    }

    if (isNaN(initialBalance)) {
      throw new Error("Invalid initial balance");
    }

    const walletData = {
      userId: user.uid,
      name: name.trim(),
      currency,
      balance: initialBalance,
      createdAt: new Date(),
      isActive: true,
    };

    // Create wallet in Firestore
    const walletRef = await adminDb.collection("wallets").add(walletData);

    console.log(`Created first wallet for user ${user.uid}: ${walletRef.id}`);

    // Redirect on success
    redirect("/overview");
  } catch (error) {
    console.error("Error creating wallet:", error);

    // Re-throw the error to be caught by error boundary
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to create wallet. Please try again.");
  }
}
