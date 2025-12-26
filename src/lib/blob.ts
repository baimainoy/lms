import { put, del } from "@vercel/blob";

export async function uploadSlip(file: File, orderId: string) {
  const filename = `slips/${orderId}-${Date.now()}.${file.name.split(".").pop()}`;

  const blob = await put(filename, file, {
    access: "public",
  });

  return blob.url;
}

export async function deleteSlip(url: string) {
  await del(url);
}
