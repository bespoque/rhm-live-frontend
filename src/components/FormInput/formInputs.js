import React, { useState } from "react";
import { Controller } from "react-hook-form";
import NumberFormat from "react-number-format";
import { PasswordHideIcon, PasswordShowIcon } from "../Icons";

const Input = React.forwardRef((props, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [inputType, setInputType] = useState(props.type || "password");

  const typeHandler = () => {
    if (showPassword) {
      setShowPassword(false);
      setInputType("password");
    } else {
      setShowPassword(true);
      setInputType("text");
    }
  };
  return (
    <>
      <div className="">
        <div className="form relative  flex">
          <input
            className="px-10"
            type={inputType}
            name={props.name}
            {...props}
            ref={ref}
          />

          {props.label && (
            <label className="label-name">
              <span className="content-name">{props.label}</span>
            </label>
          )}
          {/* {props.usePasswordIcon && (
            <div className="absolute">
              <button
                type="button"
                className="relative top-10 btn-abs  p-2 cursor-pointer"
                onClick={typeHandler}
              >
                {showPassword ? <PasswordShowIcon /> : <PasswordHideIcon />}
              </button>
            </div>
          )} */}
        </div>
      </div>

      <style jsx>{`
        .form {
          width: 100%;
          height: 70px;
          overflow: hidden;
        }
        .btn-abs {
          right: -20rem;
        }
        .form input {
          width: 100%;
          height: 100%;
          color: #595f6e;
          padding-top: 30px;
          border: none;
          outline: none;
          background: none;
        }
        .form label {
          position: absolute;
          bottom: 0px;
          left: 0%;
          width: 100%;
          height: 100%;
          pointer-events: none;
          border-bottom: 1px solid black;
        }
        .form label::after {
          content: "";
          position: absolute;
          left: 0px;
          bottom: -1px;
          height: 100%;
          width: 100%;
          border-bottom: 2px solid #5fa8d3;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
        }

        .content-name {
          position: absolute;
          bottom: 2px;
          left: 0px;
          transition: all 0.3s ease;
        }
        .form input:focus + .label-name .content-name,
        .form input:valid + .label-name .content-name {
          transform: translateY(-60%);
          font-size: 14px;
          color: #5fa8d3;
        }

        .form input:focus + .label-name::after,
        .form input:valid + .label-name::after {
          transform: translateX(0%);
          transition: transform 0.3s ease;
        }
      `}</style>
    </>
  );
});
export default Input;


export const FormatMoneyComponent = ({
  control,
  onValueChange,
  name,
  defaultValue
}) => (
  <Controller
    as={
      <NumberFormat
        className="w-full rounded form-control"
        
        // customInput={TextField}
        thousandSeparator={true}
        // prefix={"₦ "}
        onValueChange={(v) => {
          onValueChange((v.value));
          // console.log(v.value);
        }}
      />
    }
    name={name}
    variant="outlined"
    defaultValue={defaultValue}
    control={control}
  />
);

export const FormatMoneyComponentBOJ = ({
  control,
  onValueChange,
  name,
  defaultValue,
  required
}) => (
  <Controller
    as={
      <NumberFormat
        className="w-full rounded my-3 form-control"
        
        // customInput={TextField}
        thousandSeparator={true}
        // prefix={"₦ "}
        onValueChange={(v) => {
          onValueChange((v.value));
          // console.log(v.value);
        }}
      />
    }
    name={name}
    variant="outlined"
    defaultValue={defaultValue}
    control={control}
    required={required}
  />
);

export const FormatMoneyComponentReport = ({
  control,
  onValueChange,
  name,
  defaultValue,
  required,
  placeholder,
  className
}) => (
  <Controller
    as={
      <NumberFormat
        className="w-full rounded form-control"
        
        // customInput={TextField}
        thousandSeparator={true}
        // prefix={"₦ "}
        onValueChange={(v) => {
          onValueChange((v.value));
          // console.log(v.value);
        }}
      />
    }
    name={name}
    variant="outlined"
    defaultValue={defaultValue}
    control={control}
    required={required}
    placeholder={placeholder}
  />
);

export const NewFormInput = React.forwardRef((props, ref) => {
  return (
    <>
      <div className="w-full">
        <div className="form">
          <input ref={ref} name={props.name} {...props} />
          {props.label ? (
            <label
              className={`label-name  border-b ${props.bordercolor ? props.bordercolor : `border-black`
                } `}
            >
              <span className="content-name">{props.label}</span>
            </label>
          ) : null}
        </div>
      </div>

      <style jsx>{`
        .form {
          width: 100%;
          position: relative;
          height: 50px;
          overflow: hidden;
        }
        .form input {
          width: 100%;
          height: 100%;
          color: black;
          padding-top: 20px;
          border: none;
          outline: none;
        }
        .form label {
          position: absolute;
          bottom: 0px;
          left: 0%;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        .form label::after {
          content: "";
          position: absolute;
          left: 0px;
          bottom: -1px;
          height: 100%;
          width: 100%;
          border-bottom: 1px solid #5fa8d3;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
        }

        .content-name {
          position: absolute;
          bottom: 2px;
          left: 0px;
          transition: all 0.3s ease;
        }
        .form input:focus + .label-name .content-name,
        .form input:valid + .label-name .content-name {
          transform: translateY(-100%);
          font-size: 14px;
          color: #5fa8d3;
        }

        .form input:focus + .label-name::after,
        .form input:valid + .label-name::after {
          transform: translateX(0%);
          transition: transform 0.3s ease;
        }
      `}</style>
    </>
  );
});
