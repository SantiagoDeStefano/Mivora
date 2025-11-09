// import { useContext } from "react";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";


import Card from "../../components/Card";
import Label from "../../components/Label";
import Input from "../../components/Input/Input";
import Button from "../../components/Button";
import Container from "../../components/Container/Container";

// import authApi, { type LoginRequest } from "../../apis/auth.api";
// import * as yup from 'yup'
// import { AppContext } from "../../contexts/app.context";
// import { type AuthErrorResponse } from "../../types/auth.types";

// const loginSchema = yup.object({
//   email: yup
//     .string()
//     .required('Email is required')
//     .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, 'Email must be a valid Google email address')
//     .min(5, 'Email must be between 5 - 160 characters')
//     .max(160, 'Email must be between 5 - 160 characters')
//     .defined(),
//   password: yup
//     .string()
//     .required('Password is required')
//     .min(6, 'Password must be at least 6 - 160 characters')
//     .max(160, 'Password must be at least 6 - 160 characters')
//     .defined()
// })

// type LoginForm = LoginRequest;

export default function Login() {
  // const { setIsAuthenticated } = useContext(AppContext)
  // const navigate = useNavigate()
  // const {
  //   register,
  //   handleSubmit,
  //   setError,
  //   formState: { errors }
  // }
  //  = useForm({
  //   resolver: yupResolver(loginSchema),
  //   defaultValues: {
  //     email: '',
  //     password: ''
  //   }
  // })

  // const loginAccountMutation = useMutation({
  //   mutationFn: (body: LoginForm) => {
  //     return authApi.loginAccount(body)
  //   }
  // })

  // const onSubmit = handleSubmit((data) => {
  //   console.log('Login attempt with data:', data);
  //   loginAccountMutation.mutate(data as LoginRequest, {
  //     onSuccess: (response) => {
  //       console.log('Login success:', response.data);
  //       // Store tokens in localStorage
  //       localStorage.setItem('access_token', response.data.result.access_token);
  //       localStorage.setItem('refresh_token', response.data.result.refresh_token);
  //       setIsAuthenticated(true);
  //       navigate('/');
  //     },
  //     onError: (error: unknown) => {
  //       console.log('Login error:', error);
  //       if (error && typeof error === 'object' && 'response' in error) {
  //         const axiosError = error as { response?: { data?: { errors?: Record<string, { msg: string }> } } };
  //         if (axiosError.response?.data?.errors) {
  //           const formErrors = axiosError.response.data.errors;
  //           Object.keys(formErrors).forEach((key) => {
  //             setError(key as keyof LoginForm, {
  //               message: formErrors[key].msg,
  //               type: 'Server'
  //             });
  //           });
  //         }
  //       }
  //     }
  //   });
  // });

  // const isPending = loginAccountMutation.isPending;

  return (
    <section id="login" className="py-10 sm:py-14">
      <Container>
        <div className="mx-auto max-w-md">
          <Card>
            <header>
              <h2 className="text-2xl font-semibold">Log in</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Welcome back</p>
            </header>

            <form className=" mt-4 grid gap-4" noValidate>
              <div>
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  name="email"
                  type="email"
                  placeHolder="you@email.com"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="login-pass">Password</Label>
                <Input
                  id="login-pass"
                  name="password"
                  type="password"
                  // register={register}
                  placeHolder="At least 8 characters"
                  className="mt-1"
                  // errorMessages={errors.password?.message}
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link to="/forgot-password" className="text-pink-600 hover:underline">Forgot password?</Link>
              </div>

              <Button type="submit" className="h-10">
                Log in
              </Button>
            </form>

            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              New to Mivora?{" "}
              <Link to="/signup" className="text-pink-600 hover:underline">Create an account</Link>
            </p>
          </Card>
        </div>
      </Container>
    </section>
  );
}
