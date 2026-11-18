import { port } from './config/env';
import app from './app';
import { connectDB } from './config/db';

async function start() {
    await connectDB();

    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
}

start().catch((err) => {
    console.error(err);
    process.exit(1);
});
