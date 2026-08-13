/* eslint-disable */
import * as apiModule from "../src/services/api.js";
import * as borrow from "../src/services/borrowService.js";
import * as exchange from "../src/services/exchangeService.js";
import * as wallet from "../src/services/walletService.js";
import * as msg from "../src/services/messageService.js";

const calls = [];
const mockClient = {
  get: (url, opts) => {
    calls.push({ method: "get", url, opts });
    return Promise.resolve({ data: { ok: true } });
  },
  post: (url, payload) => {
    calls.push({ method: "post", url, payload });
    return Promise.resolve({ data: { ok: true } });
  },
  put: (url, payload) => {
    calls.push({ method: "put", url, payload });
    return Promise.resolve({ data: { ok: true } });
  },
  delete: (url) => {
    calls.push({ method: "delete", url });
    return Promise.resolve({ data: { ok: true } });
  },
};

async function run() {
  // inject mock
  apiModule.apiClient.get = mockClient.get;
  apiModule.apiClient.post = mockClient.post;
  apiModule.apiClient.put = mockClient.put;
  apiModule.apiClient.delete = mockClient.delete;

  // Borrow
  await borrow.createBorrowRequest({ userId: 1, bookId: "b1" });
  await borrow.fetchBorrowRequests({ userId: 1 });
  await borrow.fetchBorrowRequestById("r1");
  await borrow.updateBorrowRequest("r1", { status: "approved" });
  await borrow.cancelBorrowRequest("r1");

  // Exchange
  await exchange.createExchangeRequest({ userId: 1 });
  await exchange.fetchExchangeRequests({ userId: 1 });
  await exchange.fetchExchangeById("e1");
  await exchange.updateExchangeRequest("e1", { status: "accepted" });
  await exchange.cancelExchangeRequest("e1");

  // Wallet
  await wallet.fetchWallet(1);
  await wallet.fetchWalletTransactions(1);
  await wallet.topUpWallet(1, { amount: 100 });
  await wallet.transferWallet(1, { to: 2, amount: 50 });

  // Messages
  await msg.fetchConversations(1);
  await msg.fetchMessages("c1");
  await msg.sendMessage("c1", { text: "hi" });
  await msg.createConversation({ participants: [1, 2] });

  console.log("Service calls made:", calls.length);
  console.log(JSON.stringify(calls, null, 2));
  console.log("Service smoke tests passed (mocked)");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
