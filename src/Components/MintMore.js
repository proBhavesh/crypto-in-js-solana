import React, { useEffect, useState } from "react";
// import "./Styles.css";
// import twitterLogo from "./assets/twitter-logo.svg";
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

const MintMore = ({
	walletAddress,
	mintingWalletSecretKey,
	createdTokenPublicKey,
}) => {
	const [supplyCapped, setSupplyCapped] = useState(false);

	const mintAgainHelper = async () => {
		try {
			// setLoading(true);
			const connection = new Connection(
				clusterApiUrl("devnet"),
				"confirmed"
			);
			const createMintingWallet = await Keypair.fromSecretKey(
				Uint8Array.from(
					Object.values(JSON.parse(mintingWalletSecretKey))
				)
			);
			const mintRequester = walletAddress;

			console.log(mintRequester);

			const fromAirDropSignature = await connection.requestAirdrop(
				createMintingWallet.publicKey,
				LAMPORTS_PER_SOL
			);
			await connection.confirmTransaction(fromAirDropSignature, {
				commitment: "confirmed",
			});

			const creatorToken = new Token(
				connection,
				createdTokenPublicKey,
				TOKEN_PROGRAM_ID,
				createMintingWallet
			);
			const fromTokenAccount =
				await creatorToken.getOrCreateAssociatedAccountInfo(
					createMintingWallet.publicKey
				);
			const toTokenAccount =
				await creatorToken.getOrCreateAssociatedAccountInfo(
					mintRequester
				);
			await creatorToken.mintTo(
				fromTokenAccount.address,
				createMintingWallet.publicKey,
				[],
				100000000
			);

			const transaction = new Transaction().add(
				Token.createTransferInstruction(
					TOKEN_PROGRAM_ID,
					fromTokenAccount.address,
					toTokenAccount.address,
					createMintingWallet.publicKey,
					[],
					100000000
				)
			);
			await sendAndConfirmTransaction(
				connection,
				transaction,
				[createMintingWallet],
				{ commitment: "confirmed" }
			);

			// setLoading(false);
		} catch (err) {
			console.log(err);
			// setLoading(false);
		}
	};
	return (
		<>
			<li>
				Mint More 100 tokens:{" "}
				<button disabled={supplyCapped} onClick={mintAgainHelper}>
					Mint Again
				</button>
			</li>
		</>
	);
};

export default MintMore;
