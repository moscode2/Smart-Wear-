
export const paymentConfig = {
  mpesa: {
    pochiNumber: "+254707183283", 

    AccountName: "+254707183283", // e.g. "Smart Wear" — only needed if using Paybill
    recipientName: "Ann Onyango", // Name registered on the M-Pesa line
  },
  bank: {
    bankName: "Your Bank Name",
    accountName: "Smart Wear Collection",
    accountNumber: "0000000000",
    branch: "Branch Name (optional)",
    swiftCode: "", // optional, for international transfers
  },
  // Phone number customers can WhatsApp/call to confirm payment or ask questions
  supportPhone: "+254707183283",
};
