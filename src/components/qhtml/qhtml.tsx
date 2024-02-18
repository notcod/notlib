import { component$ } from "@builder.io/qwik";
import { nanoid } from "nanoid";
import { twMerge } from "tailwind-merge";
import { type ActionStore } from "@builder.io/qwik-city";

export const Input = component$(
  (props: {
    label: string;
    id?: string;
    name?: string;
    type?: string;
    class?: string;
    value?: string | number;
    error?: string;
    pattern?: string;
    readOnly?: boolean;
    autoComplete?: string;
    form?: ActionStore<any, any, any>;
    onInput$?: (ev: Event, el: HTMLInputElement) => void;
    onChange$?: (event: Event, element: HTMLInputElement) => any;
    disabled?: boolean;
    reset?: boolean;
  }) => {
    const getError = (something: any, find: string) => {
      if (something && something[find] && something[find] != "") {
        return something[find];
      }
      return "";
    };
    const _ID = props.id || nanoid();
    const _NAME = props.name || _ID;
    const _TYPE = props.type || "text";
    const _VALUE = props.value || props.form?.formData?.get(_NAME) || "";
    const _LABEL = props.label;
    const _AUTOCOMPLETE = props.autoComplete || "off";
    const _ERROR =
      props.error || getError(props.form?.value?.fieldErrors, _NAME);
    const _DISABLED = props.disabled || false;
    const _isSuccess =
      props.form?.value?.statusCode == 200 ||
      props.form?.value?.statusCode == 201;
    const _isReset = props.reset && _isSuccess;
    return (
      <div class={twMerge(["mb-4", props.class])}>
        <div class="relative">
          <input
            type={_TYPE}
            class={[
              _ERROR ? "border-red-300" : "border-gray-300",
              _DISABLED ? "cursor-default opacity-70" : "",
              "peer block w-full appearance-none rounded border bg-transparent  pb-2 pl-3  pr-6 pt-6 text-base text-gray-900 autofill:bg-transparent focus:border-indigo-600 focus:outline-none focus:ring-0 ",
            ]}
            disabled={_DISABLED}
            placeholder=" "
            pattern={props.pattern}
            value={_isReset ? "" : _VALUE}
            id={_ID}
            name={_NAME}
            autoComplete={_AUTOCOMPLETE || "off"}
            onInput$={props.onInput$}
            onChange$={props.onChange$}
            readOnly={props.readOnly}
          />
          <label
            for={_ID}
            class="pointer-events-none absolute start-1 top-5 z-10 origin-[0] -translate-y-4 transform select-none px-2 text-sm font-medium text-gray-500 duration-300  peer-placeholder-shown:top-1/2  peer-placeholder-shown:-translate-y-1/2  peer-placeholder-shown:text-base  peer-focus:left-auto  peer-focus:start-1  peer-focus:top-5  peer-focus:-translate-y-4 peer-focus:px-2 peer-focus:text-sm peer-focus:text-indigo-600 "
          >
            {_LABEL}
          </label>
        </div>
        {!!_ERROR && _ERROR != "" && (
          <div class="text-sm font-medium text-red-600">{_ERROR}</div>
        )}
      </div>
    );
  },
);