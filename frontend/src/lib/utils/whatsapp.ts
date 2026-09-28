export interface WhatsAppOrderParams {
  productName: string;
  weightGrams?: number | string | null;
  price: number;
  discountPrice?: number | null;
  quantity?: number;
  productSlug?: string;
  baseUrl?: string;
  whatsappNumber?: string;
  templateString?: string;
  customerName?: string;
}

const DEFAULT_TEMPLATE =
  "Hello Spelloria,\n\nI would like to order:\n\nProduct: {{product_name}}\nWeight: {{weight}}\nPrice: {{price}}\nQuantity: {{quantity}}\n\nCustomer Name: {{customer_name}}\n\nPlease confirm availability.";

export function buildWhatsAppUrl(params: WhatsAppOrderParams): string {
  const {
    productName,
    weightGrams,
    price,
    discountPrice,
    quantity = 1,
    productSlug = "",
    baseUrl = typeof window !== "undefined" ? window.location.origin : "https://spelloria.com",
    whatsappNumber = "+919876543210",
    templateString = DEFAULT_TEMPLATE,
    customerName = "",
  } = params;

  const finalUnitPrice = discountPrice ?? price;
  const totalPrice = finalUnitPrice * quantity;
  const weightText = weightGrams
    ? typeof weightGrams === "number"
      ? `${weightGrams}g`
      : weightGrams
    : "Standard Portion";
  const productUrl = `${baseUrl}/product/${productSlug}`;

  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");

  const formattedPrice =
    totalPrice % 1 === 0
      ? `₹${Math.round(totalPrice).toLocaleString("en-IN")}`
      : `₹${totalPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const message = templateString
    .replace(/{{product_name}}/g, productName)
    .replace(/{{weight}}/g, weightText)
    .replace(/{{price}}/g, formattedPrice)
    .replace(/{{quantity}}/g, quantity.toString())
    .replace(/{{customer_name}}/g, customerName || "")
    .replace(/{{url}}/g, productUrl);

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
