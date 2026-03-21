import bcrypt from 'bcrypt';

const password = 'P@$$w0rd!';
const hashedPassword = await bcrypt.hash(password, 10);
console.log (hashedPassword);

