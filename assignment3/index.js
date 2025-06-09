const http = require('http');
const fs = require('fs').promises; // Note we're using fs.promises here
const path = require('path');
const url = require('url');

// Directory to store files
const FILE_DIR = path.join(__dirname, 'files');

// Ensure the directory exists
async function ensureDirectoryExists() {
    try {
        await fs.access(FILE_DIR);
    } catch (err) {
        await fs.mkdir(FILE_DIR);
    }
}

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    res.setHeader('Content-Type', 'text/plain');

    try {
        if (pathname === '/create') {
            await handleCreate(res, query);
        } else if (pathname === '/read') {
            await handleRead(res, query);
        } else if (pathname === '/delete') {
            await handleDelete(res, query);
        } else {
            res.end('Available endpoints: /create, /read, /delete');
        }
    } catch (err) {
        res.end(`Error: ${err.message}`);
    }
});

async function handleCreate(res, query) {
    const { filename, content } = query;
    if (!filename) {
        res.end('Filename is required.');
        return;
    }

    const filePath = path.join(FILE_DIR, filename);
    await fs.writeFile(filePath, content || '');
    res.end(`File "${filename}" created successfully.`);
}

async function handleRead(res, query) {
    const { filename } = query;
    if (!filename) {
        res.end('Filename is required.');
        return;
    }

    const filePath = path.join(FILE_DIR, filename);
    const data = await fs.readFile(filePath, 'utf8');
    res.end(`Contents of "${filename}":\n\n${data}`);
}

async function handleDelete(res, query) {
    const { filename } = query;
    if (!filename) {
        res.end('Filename is required.');
        return;
    }

    const filePath = path.join(FILE_DIR, filename);
    await fs.unlink(filePath);
    res.end(`File "${filename}" deleted successfully.`);
}

const PORT = 3000;
ensureDirectoryExists().then(() => {
    server.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Failed to start server:', err);
});