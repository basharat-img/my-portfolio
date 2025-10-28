import { getAdminsCollection } from "@/lib/mongodb";
import { hashPassword } from "@/lib/password";

export async function findAdminByEmail(email) {
  const admins = await getAdminsCollection();
  return admins.findOne({ email });
}

export async function findAdminByUsername(username) {
  const admins = await getAdminsCollection();
  return admins.findOne({ username });
}

export async function createAdmin({ email, username, password }) {
  const admins = await getAdminsCollection();
  const timestamp = new Date().toISOString();

  const hashedPassword = hashPassword(password);

  await admins.insertOne({
    email,
    username,
    password: hashedPassword,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  return { email, username, createdAt: timestamp, updatedAt: timestamp };
}
