import { AnyZodObject } from 'zod';
import catchAsync from '../utils/catchAsync';
const validateRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req, res, next) => {
    const result = await schema.parseAsync({
      body: req.body,
      cookies: req.cookies,
      params: req.params,
      query: req.query,
    });

    const topLevelKeys = Object.keys(schema.shape);

    console.log(topLevelKeys);

    if (topLevelKeys[0] == 'body') {
      req.body = result.body;
    }
    if (topLevelKeys[0] == 'cookies') {
      req.cookies = result.cookies;
    }
    if (topLevelKeys[0] == 'params') {
      req.params = result.params;
    }
    if (topLevelKeys[0] == 'query') {
      req.query = result.query;
    }
    next();
  });
};

export default validateRequest;

type groupSchemas = {
  bodySchema?: AnyZodObject;
  paramsSchema?: AnyZodObject;
  querySchema?: AnyZodObject;
  cookiesSchema?: AnyZodObject;
};

export const validateRequest2 = (schema: groupSchemas) => {
  return catchAsync(async (req, res, next) => {
    if (schema.bodySchema) {
      const result = await schema.bodySchema.parseAsync({
        body: req.body,
      });
      req.body = result.body;
    }
    if (schema.paramsSchema) {
      const result = await schema.paramsSchema.parseAsync({
        params: req.params,
      });
      req.params = result.params;
    }
    if (schema.querySchema) {
      const result = await schema.querySchema.parseAsync({
        query: req.query,
      });
      req.query = result.query;
    }
    if (schema.cookiesSchema) {
      const result = await schema.cookiesSchema.parseAsync({
        cookies: req.cookies,
      });
      req.cookies = result.cookies;
    }
    next();
  });
};
