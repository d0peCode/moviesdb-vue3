import useRequest from './helpers/useRequest';
import useResponse from './helpers/useResponse';
import {AxiosRequestConfig} from "axios";

export default (
  requestConstructor: AxiosRequestConfig,
  requestValues: Record<string, Record<string, string | number | null>> = {}
): Promise<{ status: string; isSuccess: boolean; data: unknown; errors: object; } | any> | any => {

    let response;
    let valuesKeys  = requestValues ? Object.keys(requestValues) : [];
    let requestValuesBody

    // Shortcut for POST : If no 'params','query','body' keys in requestValues object, so it is 'body' object itself.
    if (valuesKeys.length && !valuesKeys.some((key: string) => ['path', 'params', 'query', 'body'].includes(key))) {
        const body = { ...requestValues };
        requestValuesBody = {
            body
        }
    }

    const request = useRequest(requestConstructor, requestValuesBody);
    console.log('►►►', request.method.toUpperCase(), request.path, requestConstructor, requestValuesBody);

    if (request)
        response = useResponse({ method: request.method, path: request.path, exec: request.exec });
    else throw new Error('Something went wrong with your API request.');
    return response;
};
