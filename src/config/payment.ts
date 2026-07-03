
export const paymentConfig = {
  mpesa: {
    tillNumber: "000000", // e.g. "174379"
    paybillNumber: "", // e.g. "400222"
    paybillAccountName: "", // e.g. "Smart Wear" — only needed if using Paybill
    recipientName: "Smart Wear Collection", // Name registered on the M-Pesa line
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
