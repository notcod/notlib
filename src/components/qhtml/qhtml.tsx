import { $, Fragment, JSXOutput, Resource, ResourceReturn, Signal, Slot, component$, useSignal } from "@builder.io/qwik";
import { nanoid } from "nanoid";
import { twMerge } from "tailwind-merge";
import { Cookie, Form, RequestEvent, RequestEventAction, RequestEventBase, server$, type ActionStore } from "@builder.io/qwik-city";
import { LuChevronLeft, LuChevronRight } from "@qwikest/icons/lucide";

const QId = (id?: string) => id || nanoid();
const QRest = (reset?: boolean, form?: ActionStore<any, any, any>) => Boolean(reset && form && form.value && form.value.statusCode && (form.value.statusCode == 200 || form.value.statusCode == 201));
const QError = (error?: string | string[] | undefined | null, form?: ActionStore<any, any, any>, name?: string) => String(error || (form && form.value && form.value.fieldErrors && form.value.fieldErrors[name || ""]) || "");
const QValue = (value?: string | number, form?: ActionStore<any, any, any>, name?: string) => String(value || (form && form.formData && form.formData.get(name || "")) || "");

export const QInput = component$((props: { label: string; id?: string; name?: string; type?: string; class?: string; value?: string | number; error?: string; pattern?: string; readOnly?: boolean; autoComplete?: string; form?: ActionStore<any, any, any>; onInput$?: (ev: Event, el: HTMLInputElement) => void; onChange$?: (event: Event, element: HTMLInputElement) => any; disabled?: boolean; reset?: boolean }) => {
    const QID = QId(props.id);
    const QNAME = props.name || QID;
    const QTYPE = props.type || "text";
    const QLABEL = props.label;
    const QERROR = QError(props.error, props.form, QNAME);
    const QAUTOCOMPLETE = props.autoComplete || "off";
    const QDISABLED = props.disabled;
    const QRESET = QRest(props.reset, props.form);
    const QVALUE = QRESET ? "" : QValue(props.value, props.form, QNAME);
    const QRUNNING = !!(props.form && props.form.isRunning);
    const QREADONLY = QRUNNING || props.readOnly;
    return (
        <div class={twMerge(["mb-4", props.class])}>
            <div class={`${QREADONLY && "pointer-events-none cursor-wait"} relative`}>
                <input type={QTYPE} class={[QERROR ? "border-red-300" : "border-gray-300", QDISABLED ? "cursor-default opacity-70" : "", "peer block w-full appearance-none rounded border bg-transparent  pb-2 pl-3  pr-6 pt-6 text-base text-gray-900 autofill:bg-transparent focus:border-indigo-600 focus:outline-none focus:ring-0 "]} disabled={QDISABLED} placeholder=" " pattern={props.pattern} value={QVALUE} id={QID} name={QNAME} autoComplete={QAUTOCOMPLETE} onInput$={props.onInput$} onChange$={props.onChange$} readOnly={QREADONLY} />
                <label for={QID} class="pointer-events-none absolute start-1 top-5 z-10 origin-[0] -translate-y-4 transform select-none px-2 text-sm font-medium text-gray-500 duration-300  peer-placeholder-shown:top-1/2  peer-placeholder-shown:-translate-y-1/2  peer-placeholder-shown:text-base  peer-focus:left-auto  peer-focus:start-1  peer-focus:top-5  peer-focus:-translate-y-4 peer-focus:px-2 peer-focus:text-sm peer-focus:text-indigo-600 ">
                    {QLABEL}
                </label>
            </div>
            {!!QERROR && <div class="text-sm font-medium text-red-600">{QERROR}</div>}
        </div>
    );
});

export const QHiddenInput = component$((props: { name: string; value: string | number }) => {
    return <input type="hidden" name={props.name} value={props.value} />;
});

export const QSelect = component$(
    (props: {
        label: string;
        id?: string;
        name?: string;
        form?: ActionStore<any, any, any>;
        value?: string | number;
        error?: string | string[] | undefined | null;
        pattern?: string;
        onInput$?: (event: Event, element: HTMLSelectElement) => any;
        onChange$?: (event: Event, element: HTMLSelectElement) => any;
        class?: string;
        disabled?: boolean;
        reset?: boolean;
        options?: Array<{
            label: string;
            value?: string | number;
        }>;
    }) => {
        const QID = QId(props.id);
        const QNAME = props.name || QID;
        const QLABEL = props.label;
        const QERROR = QError(props.error, props.form, QNAME);
        const QRESET = QRest(props.reset, props.form);
        const QVALUE = QRESET ? "" : QValue(props.value, props.form, QNAME);
        const QRUNNING = !!(props.form && props.form.isRunning);
        const QDISABLED = QRUNNING || props.disabled;
        return (
            <div class={`${QDISABLED && "pointer-events-none cursor-wait"} relative mb-4`}>
                <label for={QID} class="pointer-events-none absolute start-1 top-5 z-10 origin-[0] -translate-y-4 transform px-2 text-sm font-medium text-gray-500 duration-300  peer-placeholder-shown:top-1/2  peer-placeholder-shown:-translate-y-1/2  peer-placeholder-shown:text-base  peer-focus:left-auto  peer-focus:start-1  peer-focus:top-5  peer-focus:-translate-y-4 peer-focus:px-2 peer-focus:text-sm peer-focus:text-indigo-600 ">
                    {QLABEL}
                </label>
                <select disabled={QDISABLED} id={QID} name={QNAME} onInput$={props.onInput$} onChange$={props.onChange$} class="peer block w-full appearance-none rounded border border-gray-300 bg-transparent pb-2  pl-3 pr-6 pt-6 text-base text-gray-900 focus:border-indigo-600 focus:outline-none focus:ring-0 ">
                    {props.options &&
                        props.options.map(({ label, value }) => (
                            <option key={(value || label) + QID + QNAME} value={value || label} selected={QVALUE === (value || label)}>
                                {label}
                            </option>
                        ))}
                </select>
                {!!QERROR && <div class="text-sm font-medium text-red-600">{QERROR}</div>}
            </div>
        );
    }
);

export const QButton = component$((props: { form?: ActionStore<any, any, boolean> }) => {
    const QRUNNING = !!(props.form && props.form.isRunning);
    return (
        <button type={QRUNNING ? "button" : "submit"} class={`${QRUNNING ? "cursor-not-allowed opacity-90" : "cursor-pointer hover:bg-indigo-700"} relative flex w-full items-center  justify-center rounded bg-indigo-600 py-2 text-center text-base text-white`}>
            <span class={`${QRUNNING && "hidden"} absolute left-0 top-0 flex h-full w-full items-center justify-center`}>
                Loading
                <QSpinner />
            </span>
            <span class={`${QRUNNING && "opacity-0"} left-0 top-0 flex h-full w-full items-center justify-center`}>
                <Slot />
            </span>
        </button>
    );
});

export const QSpinner = component$((props: { class?: string }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" class={twMerge(["ml-2 h-4 w-4", props.class])}>
            <g>
                <circle cx="12" cy="2.5" r="1.5" fill="currentColor" opacity=".14" />
                <circle cx="16.75" cy="3.77" r="1.5" fill="currentColor" opacity=".29" />
                <circle cx="20.23" cy="7.25" r="1.5" fill="currentColor" opacity=".43" />
                <circle cx="21.5" cy="12" r="1.5" fill="currentColor" opacity=".57" />
                <circle cx="20.23" cy="16.75" r="1.5" fill="currentColor" opacity=".71" />
                <circle cx="16.75" cy="20.23" r="1.5" fill="currentColor" opacity=".86" />
                <circle cx="12" cy="21.5" r="1.5" fill="currentColor" />
                <animateTransform attributeName="transform" calcMode="discrete" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12" />
            </g>
        </svg>
    );
});

export const QForm = component$((props: { action?: ActionStore<any, any, any>; class?: string }) => {
    const QRUNNING = !!(props.action && props.action.isRunning);
    return (
        <Form action={props.action} class={twMerge([`${QRUNNING && "pointer-events-none cursor-progress opacity-75"} mx-auto w-[600px] max-w-full bg-white p-8 shadow`, props.class])}>
            <Slot />
        </Form>
    );
});

export const QInputSm = component$((props: { label: string; class?: string; id?: string; name?: string; type?: string; value?: string | number; error?: string; pattern?: string; autoComplete?: string; form?: ActionStore<any, any, any>; onInput$?: (ev: Event, el: HTMLInputElement) => void; onChange$?: (event: Event, element: HTMLInputElement) => any; onClick$?: any; disabled?: boolean; readOnly?: boolean; reset?: boolean; button?: string | JSXOutput }) => {
    const QID = QId(props.id);
    const QNAME = props.name || QID;
    const QTYPE = props.type || "text";
    const QLABEL = props.label;
    const QERROR = QError(props.error, props.form, QNAME);
    const QAUTOCOMPLETE = props.autoComplete || "off";
    const QDISABLED = props.disabled || false;
    const QRESET = QRest(props.reset, props.form);
    const QVALUE = QRESET ? "" : QValue(props.value, props.form, QNAME);
    const QRUNNING = !!(props.form && props.form.isRunning);
    const QREADONLY = QRUNNING || props.readOnly || false;
    return (
        <div class={twMerge([`${QREADONLY && "pointer-events-none cursor-wait opacity-75"} relative mb-4`, props.class])}>
            <input type={QTYPE} class={`peer block w-full appearance-none rounded border bg-transparent  pb-2 pl-3  pr-6 pt-6 text-base text-gray-900 autofill:bg-transparent focus:border-indigo-600 focus:outline-none focus:ring-0 ${QERROR ? "border-red-300" : "border-gray-300"} ${QDISABLED && "cursor-default opacity-70"}`} disabled={QDISABLED} pattern={props.pattern} value={QVALUE} id={QID} name={QNAME} autoComplete={QAUTOCOMPLETE} onInput$={props.onInput$} onChange$={props.onChange$} readOnly={QREADONLY} />
            <label for={QID} class="pointer-events-none absolute  start-1 top-1 z-10 origin-[0] -translate-y-4 scale-75 transform select-none bg-white px-2 text-base text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100">
                {QLABEL}
            </label>
            {!!props.button && (
                <button onClick$={props.onClick$} type={QRUNNING ? "button" : "submit"} class={`${QRUNNING ? "cursor-not-allowed opacity-90" : "cursor-pointer hover:bg-indigo-700"} absolute bottom-[3px] end-[3px] rounded bg-indigo-600 px-4  py-2 text-sm font-medium text-white`}>
                    <span class={`${QRUNNING ? "absolute" : "hidden"} left-0 top-0 flex h-full w-full items-center justify-center`}>
                        <QSpinner class="ml-0" />
                    </span>
                    <span class={`${QRUNNING && "opacity-0"} left-0 top-0 flex h-full w-full items-center justify-center`}>{props.button}</span>
                </button>
            )}
        </div>
    );
});

export const QTextarea = component$((props: { label: string; class?: string; id?: string; name?: string; value?: string | number; error?: string; pattern?: string; autoComplete?: string; form?: ActionStore<any, any, any>; onInput$?: (ev: Event, el: HTMLInputElement) => void; onChange$?: (event: Event, element: HTMLInputElement) => any; disabled?: boolean; readOnly?: boolean; reset?: boolean }) => {
    const QID = QId(props.id);
    const QNAME = props.name || QID;
    const QLABEL = props.label;
    const QERROR = QError(props.error, props.form, QNAME);
    const QDISABLED = props.disabled || false;
    const QRESET = QRest(props.reset, props.form);
    const QVALUE = QRESET ? "" : QValue(props.value, props.form, QNAME);
    const QRUNNING = !!(props.form && props.form.isRunning);
    const QREADONLY = QRUNNING || props.readOnly || false;
    return (
        <div class={twMerge(["mb-4", props.class])}>
            <div class="relative">
                <textarea class={`peer block w-full appearance-none rounded border bg-transparent  pb-2 pl-3  pr-6 pt-6 text-base text-gray-900 autofill:bg-transparent focus:border-indigo-600 focus:outline-none focus:ring-0 ${QERROR ? "border-red-300" : "border-gray-300"}`} placeholder=" " id={QID} name={QNAME} value={QVALUE} readOnly={QREADONLY} defaultValue={QVALUE} disabled={QDISABLED} />
                <label for={QID} class="pointer-events-none absolute start-1 top-5 z-10 origin-[0] -translate-y-4 transform select-none px-2 text-sm font-medium text-gray-500 duration-300  peer-placeholder-shown:top-1/2  peer-placeholder-shown:-translate-y-1/2  peer-placeholder-shown:text-base  peer-focus:left-auto  peer-focus:start-1  peer-focus:top-5  peer-focus:-translate-y-4 peer-focus:px-2 peer-focus:text-sm peer-focus:text-indigo-600 ">
                    {QLABEL}
                </label>
            </div>
            {!!QERROR && <div class="text-sm font-medium text-red-600">{QERROR}</div>}
        </div>
    );
});

export const QModal = component$((props: { signal: Signal<boolean> }) => {
    const QELEMENT = useSignal<Element>();
    const QVSIGNAL = props.signal.value;
    const QSIGNAL = props.signal;
    const QHIDE = $(() => (QSIGNAL.value = false));
    const QHANDLER = $((ev: PointerEvent) => {
        if (QELEMENT.value && ev.target && !QELEMENT.value.contains(ev.target as HTMLDivElement)) return QHIDE();
    });
    return (
        <Fragment>
            <div class={`fixed inset-0 z-50  bg-black bg-opacity-70 transition-opacity ${!QVSIGNAL && "hidden"}`} />
            <div class={`fixed inset-0 z-50 overflow-y-auto ${!QVSIGNAL && "hidden"}`} onClick$={QHANDLER}>
                <div class="flex min-h-full items-baseline justify-center p-4 text-center sm:p-0">
                    <div class="relative transform overflow-hidden border-t-2 border-indigo-500 bg-white p-8 text-left shadow-2xl  sm:my-8 sm:w-full sm:max-w-lg" ref={QELEMENT}>
                        <div class="absolute right-0 top-0 cursor-pointer bg-indigo-500 p-1 text-white shadow hover:text-indigo-900" onClick$={QHIDE}>
                            <svg type="button" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <Slot />
                    </div>
                </div>
            </div>
        </Fragment>
    );
});

export const QContainer = component$((props: { class?: string }) => {
    return (
        <div class={twMerge("mb-10 w-full max-w-full bg-white p-8 shadow", props.class)}>
            <Slot />
        </div>
    );
});
export const QPagination = component$((props: { resource: ResourceReturn<any>; page?: Signal<number> }) => {
    return (
        <Resource
            value={props.resource}
            onResolved={(e) => {
                if (!e.pagination || (!props.page && !e?.signal) || !e.pagination.length || e.results.total <= e.results.perPage) return <></>;
                return (
                    <div class="flex items-center justify-between border-t border-gray-200 bg-white pt-4 select-none">
                        <div class="flex-1 items-center justify-between sm:flex">
                            <div class="hidden sm:block">
                                <p class="text-sm font-medium text-gray-700">
                                    Showing {e.results.from} to {e.results.to} of {e.results.total} results
                                </p>
                            </div>
                            <div>
                                <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm">
                                    {e.pagination.length &&
                                        e.pagination.map((item: { text: string; page: number; active: boolean; disabled: boolean }) => {
                                            const QTEXT = String(item.text);
                                            const QPAGE = Number(item.page);
                                            const QSIGNAL = props.page;
                                            const QACTIVE = Boolean(item.active);
                                            const QDISABLED = Boolean(item.disabled);
                                            return (
                                                <span key={`${QTEXT}-${QPAGE}-${QACTIVE}-${QDISABLED}-${Math.random()}`} onClick$={() => !QDISABLED && QSIGNAL && (QSIGNAL.value = QPAGE)} class={`relative select-none inline-flex items-center px-4 py-2 text-sm font-semibold  ${QDISABLED && "cursor-default text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"} ${QACTIVE && "z-10 cursor-pointer bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"} ${!QACTIVE && !QDISABLED && "cursor-pointer text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"}`}>
                                                    {QTEXT == "«" && <LuChevronLeft class="h-5 w-5" />}
                                                    {QTEXT == "»" && <LuChevronRight class="h-5 w-5" />}
                                                    {QTEXT != "«" && QTEXT != "»" && QTEXT}
                                                </span>
                                            );
                                        })}
                                </nav>
                            </div>
                        </div>
                    </div>
                );
            }}
        />
    );
});

export const QTable = component$((props: { resource?: ResourceReturn<any>; page?: Signal<number>; header?: string[] }) => {
    return (
        <div class="overflow-x-auto">
            <table class="border-ingigo-50 w-full border-collapse border text-center text-base">
                {props.header && (
                    <thead>
                        <tr class="bg-indigo-500 text-white">
                            {props.header.map((item, i) => (
                                <th class="border-ingigo-50 border p-2" key={item + i}>
                                    {item}
                                </th>
                            ))}
                        </tr>
                    </thead>
                )}
                <tbody>
                    {props.resource && (
                        <Resource
                            value={props.resource}
                            onResolved={(e) =>
                                (("data" in e && e.data.length === 0) || Object.keys(e).length === 0) && (
                                    <QTableRow>
                                        <QTableCol colSpan={props.header?.length} class="text-center">
                                            No data found
                                        </QTableCol>
                                    </QTableRow>
                                )
                            }
                        />
                    )}
                    <Slot />
                </tbody>
            </table>
        </div>
    );
});

export const QTableRow = component$(() => (
    <tr>
        <Slot />
    </tr>
));

export const QTableCol = component$((props: { class?: string; colSpan?: number }) => {
    return (
        <td class={twMerge(["border-ingigo-50 border p-2", props.class])} colSpan={props.colSpan}>
            <Slot />
        </td>
    );
});

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
