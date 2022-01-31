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

const CreateToken = ({ walletAddress }) => {
	const [isTokenCreated, setIsTokenCreated] = useState(false);
	const [createdTokenPublicKey, setCreatedTokenPublicKey] = useState(null);
	const [mintingWalletSecretKey, setMintingWalletSecretKey] = useState(null);

	const initialMintHelper = async () => {
		try {
			setLoading(true);
			const connection = new Connection(
				clusterApiUrl("devnet"),
				"confirmed"
			);

			const mintRequester = await provider.publicKey;
			const mintingFromWallet = await Keypair.generate();
			setMintingWalletSecretKey(
				JSON.stringify(mintingFromWallet.secretKey)
			);

			const fromAirDropSignature = await connection.requestAirdrop(
				mintingFromWallet.publicKey,
				LAMPORTS_PER_SOL
			);
			await connection.confirmTransaction(fromAirDropSignature, {
				commitment: "confirmed",
			});

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
			setLoading(false);
		} catch (err) {
			console.log(err);
			setLoading(false);
		}
	};
	return (
		<div>
			{walletConnected ? (
				<p>
					Create your own token
					<button disabled={loading} onClick={initialMintHelper}>
						Initial Mint{" "}
					</button>
				</p>
			) : (
				<></>
			)}
		</div>
	);
};

export default CreateToken;
