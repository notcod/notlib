import { JSXOutput, Slot, component$ } from "@builder.io/qwik";
import { nanoid } from "nanoid";
import { twMerge } from "tailwind-merge";
import { Form, type ActionStore } from "@builder.io/qwik-city";

const QId = (id?: string) => id || nanoid();
const QRest = (reset?: boolean, form?: ActionStore<any, any, any>) => Boolean(reset && (form?.value?.statusCode == 200 || form?.value?.statusCode == 201));
const QError = (error?: string | string[] | undefined | null, form?: ActionStore<any, any, any>, name?: string) => String(error || form?.value?.fieldErrors[name || ""] || "");
const QValue = (value?: string | number, form?: ActionStore<any, any, any>, name?: string) => String(value || form?.formData?.get(name || "") || "");

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

export const QForm = component$((props: { action: ActionStore<any, any, any>; class?: string }) => {
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
