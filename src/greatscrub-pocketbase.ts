import PocketBase from 'pocketbase';

import type { TypedPocketBase } from './greatscrub.js';

const db = new PocketBase(process.env.PB_HOST as string) as TypedPocketBase;
db.autoCancellation(false);
await db.collection('users').authWithPassword(process.env.PB_USER as string, process.env.PB_PASS as string);

export default db;
