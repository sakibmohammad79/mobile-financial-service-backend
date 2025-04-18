import mongoose from 'mongoose';
import app from './app';
import config from './app/config';

async function main() {
  try {
    await mongoose.connect(config.DATABASE_URL as string);
    console.log('Connected to database');
    app.listen(config.PORT, () => {
      console.log(`mfs apps listening on port ${config.PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();
