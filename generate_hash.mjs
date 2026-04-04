import { hashPassword } from './src/server/db.ts';

hashPassword('Admin123').then(result => {
  console.log(`INSERT INTO admin_users (email, passwordHash, passwordSalt) VALUES ('renelklever@gmail.com', '${result.hash}', '${result.salt}');`);
});
