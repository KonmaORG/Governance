1. [Things I'd Like to See Improved](#things-id-like-to-see-improved)
2. [Things I Can Contribute On](#things-i-can-contribute-on)

---

# Things I'd like to see improved

1. **Improved Token and Balance Management**:

   - **Easy Balance Fetching**: Developers should be able to quickly check a wallet’s balance (e.g., ADA or custom tokens) with a simple function.
   - **Simplified Token Handling**: Make it easy to select and manage tokens from a user’s wallet for transactions. For example, automatically pick the right **UTxOs** containing a specific token when building a transaction.
   - **Example Need**: A function like `lucid.getBalance(tokenId)` or `lucid.selectUTxOByToken(tokenId)` that handles everything automatically.

2. **Enhanced Testing with Private Networks and Visualization**:

   - **Large-Scale Emulation**: Provide a **private testnet** (a personal Cardano blockchain) for testing apps, similar to an emulator but more robust, allowing developers to simulate real-world scenarios.
   - **Network Visualization**: Show a visual dashboard of the testnet’s state (e.g., slot, transactions, balances, Address) instead of just text logs in the console.

3. **Consistent and Flexible Error Handling**:

   - **Unified Error Messages**: Fix inconsistent error formats (e.g., errors appearing in `error.message`, `error.info`, or `error.cause.failure`, `error.cause.failure.cause.info/message`). All errors should have a standard structure.
   - **Clearer Errors**: Avoid the need to stringify and parse errors to understand them. Errors should be human-readable and actionable.
   - **Example Need**: A standard error object like `{ message: "Invalid UTXO", details: {...} }` for all Lucid functions.

4. **Better Documentation and Developer Tools**:

   - **Modern Framework Guides**: Provide step-by-step setup guides for using Lucid with popular tools like **Next.js**, **Vite**+**React**+**TypeScript**.
   - **CLI for Project Setup**: Offer a command-line tool (CLI) to initialize a Lucid project with pre-configured files (e.g., `lucid init` to set up a TypeScript project).
   - **Interactive Playground**: Create a web-based playground where developers can try Lucid functions (e.g., building a transaction) and see results instantly.

5. **Plug-and-Play UI Components**:

   - **Ready-to-Use Wallet Components**: Provide pre-built, customizable React components for common tasks, like connecting a wallet or displaying a balance.
   - **Easy Customization**: Ensure these components are flexible so developers can style or modify them to fit their app’s design.
   - **Example Need**: A `<WalletConnect />` component that handles wallet connection and shows the user’s balance, with customizable colors and layout.

6. **Deriving Types From Blueprint `plutus.json`**:
   - **Type-Safe Off-Chain Code**: Automatically generate TypeScript types from the compiled Plutus plutus.json (blueprint) file to reduce manual errors
   - **Better Dev Experience**: Enable IDE auto-completion and validation when interacting with smart contracts—developers shouldn’t have to manually define Datum, Redeemer, or parameter types.
   - **Example Need**: A CLI tool or library function like lucid generate-types ./plutus.json that outputs a .ts file with properly typed interfaces for scripts, validators, and redeemers.

---

# Things I Can Contribute On

1. **Onboarding Materials**
   - Create clear, beginner-friendly guides for new developers joining the project.

2. **Documentation**  
     - Write and maintain precise, well-structured docs covering setup, usage, and API references.

3. **Refactoring**  
     - Improve code readability, structure, and efficiency without changing functionality.

4. **Schema Upgrade**  
     - Migrate existing Lucid-Evolution schema from **TypeBox** to **Effect Schema** for stronger type-safety and validation.

5. **Testing**  
     - Design and implement robust unit and integration tests to ensure reliability and catch edge cases.
