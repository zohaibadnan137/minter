import { NextResponse } from "next/server";
import { ethers } from "ethers";

// Import contract ABI and address
import contractABI from "@/contracts/contractABI";
import contractAddress from "@/contracts/contractAddress";

export async function POST(req) {
  const data = await req.json();
  const { to, numberOfTokens } = data;

  try {
    // Create a provider instance
    const providerURL = process.env.PROVIDER_URL;
    const provider = new ethers.providers.JsonRpcProvider(providerURL);

    // Create a signer instance
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // Create a contract instance
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    // Call the mintToken function in the contract
    const transaction = await contract.mintToken(to, numberOfTokens);
    await transaction.wait();

    return NextResponse.json(
      {
        data: "Tokens minted successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        data: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url, "http://localhost:3000");
  const owner = searchParams.get("owner");

  try {
    // Create a provider instance
    const providerURL = process.env.PROVIDER_URL;
    const provider = new ethers.providers.JsonRpcProvider(providerURL);

    // Create a signer instance
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // Create a contract instance
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    // Call the getOwnedTokens function
    const tokens = await contract.getOwnedTokens(owner);

    if (tokens.length === 0) {
      return NextResponse.json(
        {
          data: ["No tokens owned!"],
        },
        {
          status: 200,
        }
      );
    }

    const _tokens = tokens.map((token) => "Token " + token.toString());
    return NextResponse.json(
      {
        data: _tokens,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        data: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
