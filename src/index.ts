import { Cookie, RequestEventAction, RequestEvent, RequestEventBase, server$ } from "@builder.io/qwik-city";

export { QInput, QButton, QSelect, QForm, QHiddenInput, QInputSm, QSpinner, QContainer, QModal, QPagination, QTable, QTableCol, QTableRow, QTextarea } from "./components/qhtml/qhtml";

export type QRequestInit = {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    mode?: "cors" | "no-cors" | "same-origin";
    cache?: "default" | "no-store" | "reload" | "no-cache" | "force-cache" | "only-if-cached";
    credentials?: "omit" | "same-origin" | "include";
    redirect?: "follow" | "error" | "manual";
    referrer?: "no-referrer" | "client";
    referrerPolicy?: "no-referrer" | "no-referrer-when-downgrade" | "origin" | "origin-when-cross-origin" | "same-origin" | "strict-origin" | "strict-origin-when-cross-origin" | "unsafe-url";
    headers?: Record<string, string>;
    body?: BodyInit | null;
};

export type QResponse = {
    statusCode: number;
    message: string;
    [key: string]: any | undefined;
};
export type QData = Record<string, string | number | boolean> | { params?: Record<string, string>; body: Record<string, string | number | boolean> };

export type QEvent = { url?: URL; request?: { headers?: Headers }; cookie?: Cookie } | RequestEventAction | RequestEvent | RequestEventBase;

export async function qfetch(url: string, request?: QRequestInit, event?: QEvent): Promise<Response> {
    const { headers, ...rest } = request || {};
    return fetch(
        new Request(new URL(url, event?.url), {
            headers: new Headers({
                ...Object.entries(event?.request?.headers || {}),
                cookie: Object.entries(event?.cookie?.getAll() || {})
                    .map(([k, v]) => `${k}=${v.value}`)
                    .join("; "),
                ...(headers && { ...headers }),
            }),
            ...rest,
        })
    );
}

export const QFetch = async (url: string, request: QRequestInit, event: QEvent): Promise<QResponse> => {
    try {
        const response = await qfetch(url, request, event);
        const json = await response.json();
        const { statusCode, message, setCookies, ...rest } = json;
        if (response.ok && response.status == statusCode) {
            if (event.cookie != undefined && setCookies && setCookies.length && Array.isArray(setCookies)) {
                setCookies.forEach((cookie: any) => {
                    const options: any = cookie.options || {};
                    if (event.cookie && event.cookie != undefined)
                        event.cookie.set(cookie.name, cookie.value, {
                            ...(options.maxAge && { maxAge: parseInt(options.maxAge, 10) }),
                            ...(options.path && { path: String(options.path) }),
                            ...(options.domain && { domain: String(options.domain) }),
                            ...(options.secure && { secure: Boolean(options.secure) }),
                            ...(options.httpOnly && { httpOnly: Boolean(options.httpOnly) }),
                            ...(options.sameSite && { sameSite: String(options.sameSite) }),
                            ...(options.expires && { expires: new Date(options.expires) }),
                        });
                });
            }
            return {
                statusCode,
                message,
                ...rest,
            };
        }
    } catch (error) {
        console.error("qfetch failed: ", error);
    }
    return {
        statusCode: 500,
        message: "Server error",
    };
};

export function _QData(url: string, data: QData): { body: Record<string, string | number | boolean>; qurl: string } {
    const { body } = "params" in data && "body" in data && typeof data.body === "object" ? data : { body: data };
    const { params } = "params" in data && "body" in data && typeof data.params === "object" ? data : { params: {} };
    const qurl = Object.keys(params ?? {}).length ? `${url}?${new URLSearchParams(params)}` : url;
    return { body: (body || {}) as Record<string, string | number | boolean>, qurl: qurl };
}
export async function qget(url: string, data: QData, event: QEvent, request?: QRequestInit): Promise<QResponse> {
    const { qurl } = _QData(url, data);
    return QFetch(qurl, { ...request, method: "GET" }, event);
}
export async function qpost(url: string, data: QData, event: QEvent, request?: QRequestInit): Promise<QResponse> {
    const { body, qurl } = _QData(url, data);
    return QFetch(qurl, { ...request, method: "POST", body: JSON.stringify(body) }, event);
}
export async function qput(url: string, data: QData, event: QEvent, request?: QRequestInit): Promise<QResponse> {
    const { body, qurl } = _QData(url, data);
    return QFetch(qurl, { ...request, method: "PUT", body: JSON.stringify(body) }, event);
}
export async function qdelete(url: string, data: QData, event: QEvent, request?: QRequestInit): Promise<QResponse> {
    const { body, qurl } = _QData(url, data);
    return QFetch(qurl, { ...request, method: "DELETE", body: JSON.stringify(body) }, event);
}
export async function qpatch(url: string, data: QData, event: QEvent, request?: QRequestInit): Promise<QResponse> {
    const { body, qurl } = _QData(url, data);
    return QFetch(qurl, { ...request, method: "PATCH", body: JSON.stringify(body) }, event);
}

/////////////////// when you don;t have event object //////////////////////

export const _QFetch = server$(async function (url: string, request: QRequestInit): Promise<QResponse> {
    return await QFetch(url, request, this);
});
export async function _qget(url: string, data: QData, request?: QRequestInit): Promise<QResponse> {
    const { qurl } = _QData(url, data);
    return _QFetch(qurl, { ...request, method: "GET" });
}
export async function _qpost(url: string, data: QData, request?: QRequestInit): Promise<QResponse> {
    const { body, qurl } = _QData(url, data);
    return _QFetch(qurl, { ...request, method: "POST", body: JSON.stringify(body) });
}
export async function _qput(url: string, data: QData, request?: QRequestInit): Promise<QResponse> {
    const { body, qurl } = _QData(url, data);
    return _QFetch(qurl, { ...request, method: "PUT", body: JSON.stringify(body) });
}
export async function _qdelete(url: string, data: QData, request?: QRequestInit): Promise<QResponse> {
    const { body, qurl } = _QData(url, data);
    return _QFetch(qurl, { ...request, method: "DELETE", body: JSON.stringify(body) });
}
export async function _qpatch(url: string, data: QData, request?: QRequestInit): Promise<QResponse> {
    const { body, qurl } = _QData(url, data);
    return _QFetch(qurl, { ...request, method: "PATCH", body: JSON.stringify(body) });
}

export async function _qmget(url: string, data: QData, request?: QRequestInit): Promise<any> {
    const { qurl } = _QData(url, data);
    return (await _QFetch(qurl, { ...request, method: "GET" })).message;
}
export async function _qsget(url: string, data: QData, request?: QRequestInit): Promise<number> {
    const { qurl } = _QData(url, data);
    return Number((await _QFetch(qurl, { ...request, method: "GET" })).statusCode);
}

export type _Qdget = {
    pagination: any;
    results: {
        total: number;
        page: number;
        from: number;
        to: number;
        perPage: number;
    };
    data: any;
    signal: {
        value: number;
    };
};

export async function _qdget(url: string, data: QData, request?: QRequestInit): Promise<_Qdget> {
    const res = await _qmget(url, data, request);
    return {
        pagination: res?.pagination || [],
        results: res?.results || {
            total: res?.results?.total || 0,
            page: res?.results?.page || 0,
            from: res?.results?.from || 0,
            to: res?.results?.to || 0,
            perPage: res?.results?.perPage || 0,
        },
        data: res?.data || [],
        signal: { value: res?.results?.page || 1 },
    };
}


export const sget = _qget;
export const spost = _qpost;
export const sput = _qput;
export const sdelete = _qdelete;
export const spatch = _qpatch;
export const smget = _qmget;
export const ssget = _qsget;
export const sdget = _qdget;