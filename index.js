const xrpl = require('xrpl');

async function main() {
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
  await client.connect();
  console.log('Connected to XRPL Testnet');

  // Replace with your NGO wallet (generate from faucet)
  const ngoWallet = xrpl.Wallet.fromSeed('YOUR_NGO_SEED_HERE'); // SECRET! Do not commit.
  const donorWallet = xrpl.Wallet.fromSeed('YOUR_DONOR_SEED_HERE');

  // Issue custom token (IOU) from NGO
  const issueTx = await client.submitAndWait({
    TransactionType: 'TrustSet',
    Account: donorWallet.address,
    LimitAmount: {
      currency: 'IMPACT', // Custom currency code
      issuer: ngoWallet.address,
      value: '1000000' // Max trust amount
    }
  }, { wallet: donorWallet });
  console.log('Trustline established:', issueTx);

  // Simulate donation (payment with IOU)
  const paymentTx = await client.submitAndWait({
    TransactionType: 'Payment',
    Account: donorWallet.address,
    Amount: {
      currency: 'IMPACT',
      issuer: ngoWallet.address,
      value: '100'
    },
    Destination: ngoWallet.address
  }, { wallet: donorWallet });
  console.log('Donation simulated:', paymentTx);

  await client.disconnect();
}

main().catch(console.error);
