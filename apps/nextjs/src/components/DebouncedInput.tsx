import { forwardRef, useEffect, useState } from "react";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { useDebouncedCallback } from "use-debounce";

import { Input } from "./ui/Input";
import { Textarea } from "./ui/Textarea";

type InputProps = {
  value?: string;
  onChange: (value?: string) => void;
  // onChange: ChangeEventHandler<HTMLInputElement>;
  debounce?: number;
  inputType?: "input" | "textarea";
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange">;

export const DebouncedInput = forwardRef<
  HTMLInputElement & HTMLTextAreaElement,
  InputProps
>(
  (
    {
      value: initialValue,
      onChange,
      inputType = "input",
      debounce = 500,
      ...props
    },
    ref,
  ) => {
    const [value, setValue] = useState(initialValue);

    // https://github.com/xnimorz/use-debounce
    const debouncedOnChange = useDebouncedCallback(() => {
      if (value) {
        onChange(value); //parent onChange
      }
    }, debounce);

    // When the component goes to be unmounted, we will force execute onChange before unmounting
    useEffect(
      () => () => {
        debouncedOnChange.flush();
      },
      [debouncedOnChange],
    );

    // useEffect(() => {
    //   setValue(initialValue);
    // }, [initialValue]);

    // useEffect(() => {
    //   const timeout = setTimeout(() => {
    //     onChange(value);
    //   }, debounce);

    //   return () => clearTimeout(timeout);
    // }, [value]);

    const renderInputType = (type: typeof inputType) => {
      if (type === "input")
        return (
          <div className="relative flex items-center justify-between align-middle">
            <Input
              {...props}
              ref={ref}
              value={value ?? ""}
              onChange={(e) => {
                setValue(e.target.value);
                debouncedOnChange();
              }}
            />
            {props.type === "number" && (
              <div className="absolute left-[90%] flex h-7 flex-col justify-center">
                <button
                  type="button"
                  onClick={() => {
                    const currentValue = Number(value);
                    if (!isNaN(currentValue)) {
                      setValue((currentValue + 1).toString());
                      debouncedOnChange();
                    }
                  }}
                >
                  <IconChevronUp size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const currentValue = Number(value);
                    if (!isNaN(currentValue)) {
                      setValue((currentValue - 1).toString());
                      debouncedOnChange();
                    }
                  }}
                >
                  <IconChevronDown size={12} />
                </button>
              </div>
            )}
          </div>
        );

      if (type === "textarea")
        return (
          <Textarea
            {...props}
            ref={ref}
            value={value ?? ""}
            onChange={(e) => {
              setValue(e.target.value);
              debouncedOnChange();
            }}
          />
        );
    };

    return <>{renderInputType(inputType)}</>;
  },
);

DebouncedInput.displayName = "DebouncedInput";
