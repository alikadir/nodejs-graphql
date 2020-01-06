import jwt from 'jsonwebtoken';

export const checkAuth = role => next => (parent, args, context, info) => {
  if (!context.req.headers.authorization) throw new Error('Please signIn before!');

  const token = context.req.headers.authorization.replace('Bearer ', '');
  const admin = jwt.verify(token, 'AKB_SecretKey');

  if (admin.type !== role) throw new Error('User not authorized!');

  context.admin = admin;

  return next(root, args, context, info);
};
