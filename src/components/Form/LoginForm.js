import React, { useEffect } from "react";
import Link from "next/link";
import Input from "../FormInput/formInputs";
import { FormHeader } from "../FormHeader/FormHeader";
import CustomButton from "../CustomButton/CustomButton";
import { KgtinIcon, PasswordIcon } from "../Icons";
import { useForm } from "react-hook-form";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import {
  login,
  disableSubmitting,
} from "../../redux/authentication/auth.actions";
import { clearSignUp } from "../../redux/signup/signup.actions";
import { clearSignUpAuth } from "../../redux/signup-auth/signup-auth.actions";
import Loader from "react-loader-spinner";
// import { PasswordHideIcon, PasswordShowIcon } from "../Icons";

const LoginForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  //state
  const { submitting, auth, loginErrors, isValid, isSignUpComplete } =
    useSelector(
      (state) => ({
        submitting: state.authentication.submitting,
        auth: state.authentication.auth,
        loginErrors: state.authentication.loginErrors,
        isValid: state.signUp.isValid,
        isSignUpComplete: state.signUpAuth.isSignUpComplete,
      }),
      shallowEqual
    );

  useEffect(() => {
    dispatch(disableSubmitting());
    if (isValid) {
      dispatch(clearSignUp());
    }
    if (isSignUpComplete) {
      dispatch(clearSignUpAuth());
    }
    if (auth) {
      router.push("/dashboard");
    }
  }, [auth]);

  //hook form
  const { register, handleSubmit, errors } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const SubmitHandler = (data) => {
    // console.log("data", data);
    dispatch(login(data));
  };
  return (
    <form onSubmit={handleSubmit(SubmitHandler)} autoComplete="off">
      <div className="w-full p-1">
        <FormHeader text="Revenue House Manager" />
        {loginErrors !== null && (
          <p className="text-red-500 shadow-md py-2 px-2 border-l-2 border-red-500">
            {loginErrors}
          </p>
        )}
        <Input
          name="email"
          label={<KgtinIcon />}
          ref={register({
            pattern: {
              value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
              message: "please enter a valid email address",
            },
          })}
          
           value="adminlogin@mail.com"
          autoComplete="off"
          type="text"
          required
          placeholder="Email"
        />
 
        {errors.email && (
          <p className="text-red-600 bg-white">Enter a valid email</p>
        )}

        <Input
          name="password"
         value="Adminp@$$"
          label={<PasswordIcon />}
          ref={register()}
          autoComplete="off"
          required
          placeholder="Password"
          usePasswordIcon
        />

        <div className="mt-8 flex justify-between">
          <CustomButton name="Login" type="Submit" disabled={submitting}>
            Login
            <Loader
              visible={submitting}
              type="TailSpin"
              color="#00FA9A"
              height={19}
              width={19}
              timeout={0}
              className="ml-2"
            />
          </CustomButton>
          <div className="mt-2">
            <p>
              <Link legacyBehavior href="/reset-password">
                <a className="text-blue-500">Forgot password ?</a>
              </Link>
            </p>
          </div>
        </div>

        {/* <div className="mt-6">
          <p>
            Don't have an account?
            <Link href="/signup">
              <a className="text-blue-500"> Sign Up</a>
            </Link>
          </p>
        </div> */}
      </div>
    </form>
  );
};

export default LoginForm;
