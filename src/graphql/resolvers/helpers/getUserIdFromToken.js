import jwt from 'jsonwebtoken';

const getUserIdFromToken = ({ request }) => {
    const header = request.request.headers.authorization;

    if (!header) {
        throw new Error('Autherization required');
    }

    const token = header.replace('Bearer ', '');
    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);

    return tokenDecoded.userId;
}

export { getUserIdFromToken as default}