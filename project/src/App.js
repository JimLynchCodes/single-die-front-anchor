import React, { useEffect, useState } from 'react';
import * as anchor from '@coral-xyz/anchor';
import { Connection, PublicKey, Commitment, SystemProgram, Keypair } from '@solana/web3.js';
import { WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import idl from './sb_randomness.json'; // Your program's IDL

const App = () => {
  const wallet = useWallet();
  const [program, setProgram] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Constants
  const network = 'https://api.devnet.solana.com';
  const programID = new PublicKey(idl.address);
  const opts = {
    preflightCommitment: 'confirmed',
    commitment: 'confirmed',
  };
  const connection = new Connection(network, opts.commitment);

  useEffect(() => {
    if (wallet.connected) {
      initializeProgram();
    }
  }, [wallet.connected]);


  // Initialize Anchor Program
  // const initializeProgram = () => {
  //   try {

  //     const sendAndConfirm = async (tx, signers) => {
  //       const signature = await connection.sendTransaction(tx, signers, {
  //         skipPreflight: false,
  //         preflightCommitment: 'confirmed',
  //       });
  //       await connection.confirmTransaction(signature, 'confirmed');
  //       return signature;
  //     };


  //     const provider = new anchor.AnchorProvider(
  //       connection, 
  //       wallet,
  //       {
  //         ...opts,
  //         sendAndConfirm
  //       }
  //     );
  //     anchor.setProvider(provider);
  //     const program = new anchor.Program(idl, programID);
  //     setProgram(program);
  //   } catch (error) {
  //     console.error('Error initializing program:', error);
  //   }
  // };

  // Call Smart Contract Function
  const callContractOld = async () => {
    try {
      if (!program) {
        alert('Program not initialized');
        return;
      }

      console.log("Calling ", idl.address)

      const accountPublicKey = new PublicKey(idl.address);

      // Updated fetch method with proper error handling
      try {
        const accountData = await program.account.player_state.fetch(
          accountPublicKey,
          opts.commitment
        );
        setData(accountData);
        console.log('Account Data:', accountData);
      } catch (e) {
        if (e.toString().includes('Account does not exist')) {
          console.error('Account not found');
        } else {
          throw e;
        }
      }
    } catch (error) {
      console.error('Error calling contract:', error);
    }
  };

  // const callContract = async () => {
  //   if (!program || !wallet.publicKey) {
  //     setError('Program not initialized or wallet not connected');
  //     return;
  //   }

  //   setLoading(true);
  //   setError(null);

  //   try {
  //     // Generate a new account keypair for the program
  //     const newAccount = Keypair.generate();

  //     // Calculate the space needed for the account (adjust based on your account structure)
  //     const ACCOUNT_SIZE = 1000; // Adjust this based on your actual account size

  //     // Calculate rent exemption amount
  //     const rentExemption = await connection.getMinimumBalanceForRentExemption(ACCOUNT_SIZE);

  //     // Create the transaction
  //     const tx = await program.methods
  //       .initialize()  // Your initialize method name from the IDL
  //       .accounts({
  //         newAccount: newAccount.publicKey,
  //         user: wallet.publicKey,
  //         systemProgram: SystemProgram.programId,
  //         // Add any other accounts required by your initialize instruction
  //       })
  //       .signers([newAccount])  // Add the new account keypair as a signer
  //       .preInstructions([
  //         SystemProgram.createAccount({
  //           fromPubkey: wallet.publicKey,
  //           newAccountPubkey: newAccount.publicKey,
  //           space: ACCOUNT_SIZE,
  //           lamports: rentExemption,
  //           programId: programID,
  //         }),
  //       ])
  //       .rpc();

  //     console.log('Transaction signature:', tx);

  //     // Wait for transaction confirmation
  //     await connection.confirmTransaction(tx, opts.commitment);

  //     // Fetch the initialized account data
  //     const accountData = await program.account.newAccount.fetch(newAccount.publicKey);
  //     setData(accountData);

  //     console.log('Initialized account data:', accountData);

  //     // Save the account public key for future reference
  //     localStorage.setItem('programAccountKey', newAccount.publicKey.toString());

  //   } catch (error) {
  //     console.error('Error initializing contract:', error);
  //     setError(error.toString());
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const initializeProgram = async () => {
    try {
     

      // Constants
      const network = 'https://api.devnet.solana.com';  // Devnet endpoint
      const opts = {
        preflightCommitment: 'confirmed',
        commitment: 'confirmed',
      };

      // Create a connection to the devnet
      const connection = new Connection(network, opts.commitment);

      // Define the program ID from the IDL (replace with your actual program ID)
      const programID = new PublicKey("6Txeg9dhUq3aNhgoATKW1eeoxgdjvyxHxn2xhtELi7Ba");

      // Set up the provider
      const provider = new anchor.AnchorProvider(
        connection,
        wallet,  // Use local wallet for provider (use your wallet here if needed)
        opts
      );

      anchor.setProvider(provider);

      const idl = require("./sb_randomness.json");

      // Generate the program client from IDL.
      const program = new anchor.Program(idl);

      console.log("program", program)
      // Execute the RPC.
      // await program.rpc.initialize();

      setProgram(program);

    } catch (error) {
      console.error('Error initializing program:', error);
      setError('Failed to initialize program');
    }

  };

  const callInit = async () => {

    // await program.ins

    // const { publicKey, connected, signTransaction } = useWallet();

    console.log("trying with key: ", wallet.publicKey.toString())


    try {
      // const playerState = anchor.web3.Keypair.generate();  // Create a new playerState account
      // Log signers to ensure they are valid
      // console.log('Signers:', [playerState, wallet]);

      const keyp = new PublicKey(wallet.publicKey)

      // const tx = await program.methods
      //   .initialize()
      //   .accounts({
      //     playerState: playerState.publicKey,
      //     user: wallet.publicKey,
      //     systemProgram: anchor.web3.SystemProgram.programId,
      //   })
      //   .signers([playerState, keyp ])  // Ensure both the generated keypair and wallet are signers
      //   .rpc();

      // const playerState = anchor.web3.Keypair.generate();

      // const tx = await program.methods
      //   .initialize()
      //   .accounts({
      //     playerState: playerState.publicKey,
      //     user: wallet.publicKey,
      //     systemProgram: anchor.web3.SystemProgram.programId,
      //   })
      //   .signers([playerState, wallet])
      //   .rpc();

      // console.log('Transaction signature:', tx);

      // Generate a new keypair for the playerState account
      const playerStateKeypair = anchor.web3.Keypair.generate();

      // Calculate rent exemption for the playerState account
      const playerStateRentExemption = await connection.getMinimumBalanceForRentExemption(
        500 // Assuming PlayerState.size is defined correctly
      );

      console.log('playerState key: ', playerStateKeypair.publicKey.toString());
      console.log('wallet.publicKey: ', wallet.publicKey.toString());
      console.log('anchor.web3.SystemProgram.programId: ', anchor.web3.SystemProgram.programId.toString());
      


      // const tx = await program.methods
      //   .initialize()
      //   .accounts({
      //     playerState: playerStateKeypair.publicKey,
      //     user: wallet.publicKey,
      //     systemProgram: anchor.web3.SystemProgram.programId,
      //   })
      //   .signers([playerStateKeypair])
      //   // .signers([playerStateKeypair])
      //   .rpc();

      // console.log('Transaction signature:', tx);


       // Derive the PDA for player_state
    const [playerStatePDA, playerStateBump] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("playerState"),
        wallet.publicKey.toBuffer()
      ],
      program.programId
    );

    console.log("Player State PDA:", playerStatePDA.toString());

    // Initialize the player state
    const tx = await program.methods
      .initialize()
      .accounts({
        playerState: playerStatePDA,
        user: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Transaction signature:", tx);

    // Fetch the initialized account
    
    
    // Optionally, you can fetch data from the playerState account after the transaction
    const accountData = await program.account.playerState.fetch(playerStatePDA);
    // const accountData = await program.account.playerState.fetch(playerStateKeypair.publicKey);
    console.log("Player State Data:", accountData);
      setData(accountData);

      console.log('Player state data:', accountData);
    } catch (error) {
      console.error('Error initializing contract:', error);
      // setError(error.toString());
    } finally {
      // setLoading(false);
    }



  }

  // const callContract = async () => {
  //   if (!program || !wallet.publicKey) {
  //     setError('Program not initialized or wallet not connected');
  //     return;
  //   }

  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const newAccount = Keypair.generate();
  //     console.log("New account pubkey:", newAccount.publicKey.toString());

  //     const ACCOUNT_SIZE = 1000;
  //     const rentExemption = await connection.getMinimumBalanceForRentExemption(ACCOUNT_SIZE);

  //     const tx = await program.methods
  //       .initialize()
  //       .accounts({
  //         newAccount: newAccount.publicKey,
  //         user: wallet.publicKey,
  //         systemProgram: SystemProgram.programId,
  //       })
  //       .signers([newAccount])
  //       .preInstructions([
  //         SystemProgram.createAccount({
  //           fromPubkey: wallet.publicKey,
  //           newAccountPubkey: newAccount.publicKey,
  //           space: ACCOUNT_SIZE,
  //           lamports: rentExemption,
  //           programId: programID,
  //         }),
  //       ])
  //       .rpc();

  //     console.log('Transaction signature:', tx);

  //     // Fetch the initialized account data
  //     const accountData = await program.account.newAccount.fetch(newAccount.publicKey);
  //     setData(accountData);

  //     console.log('Initialized account data:', accountData);
  //     localStorage.setItem('programAccountKey', newAccount.publicKey.toString());

  //   } catch (error) {
  //     console.error('Error initializing contract:', error);
  //     setError(error.toString());
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const callContract = async () => {

    const guess = 0; // Replace with user input

    // Calculate the size of the PlayerState account based on the IDL definition
    const playerStateSize = 100; // Adjust based on your specific struct


    if (!program || !wallet.publicKey) {
      setError('Program not initialized or wallet not connected');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Generate a new account keypair for the player state
      const playerStateKeypair = Keypair.generate();

      // Calculate rent exemption for the player state account
      const playerStateRentExemption = await connection.getMinimumBalanceForRentExemption(
        1000
      );

      // Create the transaction
      const tx = await program.methods
        .initialize()
        .accounts({
          playerState: playerStateKeypair.publicKey,
          user: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([playerStateKeypair])
        .preInstructions([
          SystemProgram.createAccount({
            fromPubkey: wallet.publicKey,
            newAccountPubkey: playerStateKeypair.publicKey,
            space: 1000,
            lamports: playerStateRentExemption,
            programId: programID,
          }),
        ])
        .rpc();

      console.log('Transaction signature:', tx);

      // ... (rest of the code)

      // Now you can call the `coin_flip` instruction using the `playerStateKeypair.publicKey`
      const tx2 = await program.methods
        .coin_flip(guess) // Replace `guess` with the desired value (0 or 1)
        .accounts({
          playerState: playerStateKeypair.publicKey,
          user: wallet.publicKey,
          // ... other accounts as specified in the IDL
        })
        .rpc();

      // ... (handle the response)
    } catch (error) {
      console.error('Error initializing contract:', error);
      setError(error.toString());
    } finally {
      setLoading(false);
    }
  };



  const callGuess = async () => {

    // await program.ins

    // const { publicKey, connected, signTransaction } = useWallet();

    console.log("trying with key: ", wallet.publicKey.toString())


    try {
      // const playerState = anchor.web3.Keypair.generate();  // Create a new playerState account
      // Log signers to ensure they are valid
      // console.log('Signers:', [playerState, wallet]);

      const keyp = new PublicKey(wallet.publicKey)

      // const tx = await program.methods
      //   .initialize()
      //   .accounts({
      //     playerState: playerState.publicKey,
      //     user: wallet.publicKey,
      //     systemProgram: anchor.web3.SystemProgram.programId,
      //   })
      //   .signers([playerState, keyp ])  // Ensure both the generated keypair and wallet are signers
      //   .rpc();

      // const playerState = anchor.web3.Keypair.generate();

      // const tx = await program.methods
      //   .initialize()
      //   .accounts({
      //     playerState: playerState.publicKey,
      //     user: wallet.publicKey,
      //     systemProgram: anchor.web3.SystemProgram.programId,
      //   })
      //   .signers([playerState, wallet])
      //   .rpc();

      // console.log('Transaction signature:', tx);

      // Generate a new keypair for the playerState account
      const playerStateKeypair = anchor.web3.Keypair.generate();

      // Calculate rent exemption for the playerState account
      const playerStateRentExemption = await connection.getMinimumBalanceForRentExemption(
        500 // Assuming PlayerState.size is defined correctly
      );

      console.log('playerState key: ', playerStateKeypair.publicKey.toString());
      console.log('wallet.publicKey: ', wallet.publicKey.toString());
      console.log('anchor.web3.SystemProgram.programId: ', anchor.web3.SystemProgram.programId.toString());
      


      // const tx = await program.methods
      //   .initialize()
      //   .accounts({
      //     playerState: playerStateKeypair.publicKey,
      //     user: wallet.publicKey,
      //     systemProgram: anchor.web3.SystemProgram.programId,
      //   })
      //   .signers([playerStateKeypair])
      //   // .signers([playerStateKeypair])
      //   .rpc();

      // console.log('Transaction signature:', tx);


       // Derive the PDA for player_state
    const [playerStatePDA, playerStateBump] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("playerState"),
        wallet.publicKey.toBuffer()
      ],
      program.programId
    );

    console.log("Player State PDA:", playerStatePDA.toString());
    console.log("sending guess!", playerStatePDA.toString());

    console.log(program.methods)

    // 2. Derive the escrow account PDA
    const [escrowPDA] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("stateEscrow")
      ],
      program.programId
    );

    console.log("Player State PDA:", playerStatePDA.toString());
    console.log("Escrow PDA:", escrowPDA.toString());
    console.log("User wallet:", wallet.publicKey.toString());
    console.log("Randomness Account:", randomnessAccount.toString());

    // 3. Call the coin_flip instruction
    const tx = await program.methods
      .coinFlip(
        randomnessAccount, // Pass the randomness account pubkey
        guess              // Pass the user's guess (should be a number 0 or 1)
      )
      .accounts({
        playerState: playerStatePDA,
        user: wallet.publicKey,
        randomnessAccountData: randomnessAccount,
        escrowAccount: escrowPDA,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Coin flip transaction signature:", tx);

    // 4. Fetch updated player state
    const playerState = await program.account.playerState.fetch(playerStatePDA);
    console.log("Updated player state:", playerState);

    // Fetch the initialized account
    
    
    // Optionally, you can fetch data from the playerState account after the transaction
    // const accountData = await program.account.playerState.fetch(playerStatePDA);
    // const accountData = await program.account.playerState.fetch(playerStateKeypair.publicKey);
    // console.log("Player State Data:", accountData);
      // setData(accountData);

      // console.log('Player state data:', accountData);
    } catch (error) {
      console.error('Error calling coinFlip:', error);
      // setError(error.toString());
    } finally {
      // setLoading(false);
    }



  }

  

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <WalletMultiButton />
      {wallet.connected && (
        <div>
          <button
            onClick={callInit}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              cursor: 'pointer'
            }}
          >
            Init
          </button>
          <button
            onClick={callGuess}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              cursor: 'pointer'
            }}
          >
            Guess 2
          </button>
          <button
            onClick={callContract}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              cursor: 'pointer'
            }}
          >
            Call Smart Contract
          </button>
          {data && (
            <pre style={{ marginTop: '20px', textAlign: 'left' }}>
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};

export default App;


