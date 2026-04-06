export const ok = (data: any, message = 'OK') => ({ statusCode: 200, message, data });
export const created = (data: any, message = 'Created') => ({ statusCode: 201, message, data });
