const http = require("http");

function getBodyFromStream(req) {
    return new Promise((resolve, reject) => {
        const data = [];
        req.on("data", (chunk) => {
            data.push(chunk);
        });
        req.on("end", () => {
            const body = Buffer.concat(data).toString();
            if (body) {
                //assume body is JSON
                resolve(JSON.parse(body));
                return;
            }
            resolve({});
        });
    });

    // const data = [];
    // req.on("data", (chunk) => {
    //     data.push(chunk);
    // });
    // req.on("end", () => {
    //     const body = Buffer.concat(data).toString();
    //     if (body) {
    //         //assume body is JSON
    //         req.body = JSON.parse(body);
    //     }
    // });
}
function authenticate(req, res, next) {
    console.log("authenticate");
    const username = 'john';
    const password = '1245';

    if (req.body.username !== username || req.body.password !== password) {
        res.statusCode = 401;
        res.end();
        return;
    }
    next(req, res);
}

function getBooks(req, res) {
    console.log('getBooks', req.body);
    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify({ books: [{ name: "Harry Potter" }] }));
    res.end();
}

function getAuthors(req, res) {
    console.log('getAuthors', req.body);
    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify({ authors: [{ name: "J.K Rowling" }] }));
    res.end();
}

const server = http.createServer(async (req, res) => {
    // getBodyFromStream(req, res, getBooks);
    try {
        const body = await getBodyFromStream(req);
        req.body = body;
        // console.log("req.body", req.body);
        if (req.url === "/books") {
            authenticate(req, res, getBooks);
        }
        if (req.url === "/authors") {
            authenticate(req, res, getAuthors);
        }
    } catch (error) {
        req.statusCode = 500;
        req.end(error.message);
    }

    // res.end();
    // getBooks(req, res);
});

server.listen(8000, () => {
    console.log("server is listening on port 8000");
});