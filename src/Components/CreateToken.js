import React, { useEffect, useState } from "react";

import {
	Connection,
	clusterApiUrl,
	PublicKey,
	LAMPORTS_PER_SOL,
	Keypair,
	Transaction,
	sendAndConfirmTransaction,
} from "@solana/web3.js";

import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";

const CreateToken = ({
	walletAddress,
	setMintingWalletSecretKey,
	mintingWalletSecretKey,
	createdTokenPublicKey,
	setCreatedTokenPublicKey,
}) => {
	//declaring states
	const [isTokenCreated, setIsTokenCreated] = useState(false);

	const initialMintHelper = async () => {
		try {
			//creating connection
			const connection = new Connection(
				clusterApiUrl("devnet"),
				"confirmed"
			);

			//extracting wallet address
			const mintRequester = walletAddress;

			//generating new wallet for minting
			const mintingFromWallet = await Keypair.generate();

			setMintingWalletSecretKey(
				JSON.stringify(mintingFromWallet.secretKey)
			);
			//requesting airdrop
			const fromAirDropSignature = await connection.requestAirdrop(
				mintingFromWallet.publicKey,
				LAMPORTS_PER_SOL
			);

			//confirming transaction
			await connection.confirmTransaction(fromAirDropSignature, {
				commitment: "confirmed",
			});

			//-------------------------------
			const creatorToken = await Token.createMint(
				connection,
				mintingFromWallet,
				mintingFromWallet.publicKey,
				null,
				6,
				TOKEN_PROGRAM_ID
			);
			const fromTokenAccount =
				await creatorToken.getOrCreateAssociatedAccountInfo(
					mintingFromWallet.publicKey
				);
			await creatorToken.mintTo(
				fromTokenAccount.address,
				mintingFromWallet.publicKey,
				[],
				1000000
			);

			const toTokenAccount =
				await creatorToken.getOrCreateAssociatedAccountInfo(
					mintRequester
				);
			const transaction = new Transaction().add(
				Token.createTransferInstruction(
					TOKEN_PROGRAM_ID,
					fromTokenAccount.address,
					toTokenAccount.address,
					mintingFromWallet.publicKey,
					[],
					1000000
				)
			);
			const signature = await sendAndConfirmTransaction(
				connection,
				transaction,
				[mintingFromWallet],
				{ commitment: "confirmed" }
			);
			console.log("SIGNATURE:", signature);

			setCreatedTokenPublicKey(creatorToken.publicKey.toString());
			setIsTokenCreated(true);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<>
			{walletAddress ? (
				<p>
					Create your own token
					<button onClick={initialMintHelper}>Initial Mint </button>
				</p>
			) : (
				<></>
			)}
		</>
	);
};

export default CreateToken;
